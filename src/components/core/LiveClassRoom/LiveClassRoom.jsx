import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import TopBar from "./TopBar";
import InstructorVideo from "./InstructorVideo";
import StudentVideoBar from "./StudentVideoBar";
import BottomBar from "./BottomBar";
import Sidebar from "./Sidebar/Sidebar";
import WhiteboardModal from "./Modals/WhiteboardModal";
import PollsModal from "./Modals/PollsModal";
import RecordingIndicator from "./Modals/RecordingIndicator";
import ReactionsPanel from "./Modals/ReactionsPanel";
import ChatTab from "./Sidebar/ChatTab";
import ParticipantsTab from "./Sidebar/ParticipantsTab";

const SIGNALING_SERVER_URL = process.env.REACT_APP_SIGNALING_SERVER_URL || "http://localhost:5000";
const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  {
    urls: "turn:openrelay.metered.ca:80",
    username: "openrelayproject",
    credential: "openrelayproject"
  }
];

const LiveClassRoom = ({ classId }) => {
  // Redux state
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  // Local state
  const [classInfo, setClassInfo] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);
  const [pollsOpen, setPollsOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [reactionsOpen, setReactionsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [isInstructor, setIsInstructor] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const mediaRecorderRef = useRef(null);

  // --- WebRTC Peer Connection Logic ---
  const [peers, setPeers] = useState({});
  const [pendingCandidates, setPendingCandidates] = useState({});
  const [mySocketId, setMySocketId] = useState(null);

  // Helper: Create peer connection
  const createPeerConnection = (socketId, isInitiator) => {
    if (peersRef.current[socketId]) return peersRef.current[socketId];
    if (!localStreamRef.current) return null;
    const pc = new window.RTCPeerConnection({ iceServers: ICE_SERVERS });
    localStreamRef.current.getTracks().forEach((track) => pc.addTrack(track, localStreamRef.current));
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("ice-candidate", { roomId: classId, candidate: event.candidate, userId: user._id, to: socketId });
      }
    };
    pc.ontrack = (event) => {
      const stream = event.streams[0];
      setRemoteStreams((prev) => ({ ...prev, [socketId]: stream }));
    };
    if (isInitiator) {
      pc.onnegotiationneeded = async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        if (socketRef.current) {
          socketRef.current.emit("offer", { roomId: classId, offer, userId: user._id, to: socketId });
        }
      };
    }
    peersRef.current[socketId] = pc;
    setPeers((prev) => ({ ...prev, [socketId]: pc }));
    return pc;
  };

  // Refs
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef({});

  // --- Whiteboard State ---
  const [whiteboardData, setWhiteboardData] = useState([]);
  const [drawColor, setDrawColor] = useState("#fff");
  const [drawSize, setDrawSize] = useState(3);
  const [drawing, setDrawing] = useState(false);

  // --- Polls State ---
  const [poll, setPoll] = useState(null);
  const [pollResults, setPollResults] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);

  // --- Reactions State ---
  const [showReaction, setShowReaction] = useState(null);

  // Set instructor status from Redux user
  useEffect(() => {
    if (user) {
      setIsInstructor(user.accountType === 'Instructor');
    }
  }, [user]);

  // Get camera/mic and connect to signaling server
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        localStreamRef.current = stream;
        connectToSignalingServer(stream);
      } catch (e) {
        // handle error
      }
    })();
    // Cleanup on unmount
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      Object.values(peersRef.current).forEach((pc) => pc.close());
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line
  }, [user]);

  // Connect to Socket.IO
  const connectToSignalingServer = (stream) => {
    socketRef.current = io(SIGNALING_SERVER_URL, {
      transports: ["websocket"],
      auth: { token },
    });
    const socket = socketRef.current;
    socket.on("connect", () => {
      setMySocketId(socket.id);
      socket.emit("join-room", {
        roomId: classId,
        userId: user._id,
        userName: user.firstName + " " + user.lastName,
        isInstructor,
      });
    });
    // On receiving the full participant list (with socketId)
    socket.on("participants", (list) => {
      setParticipants(list);
      // On join, connect to all existing participants (except self)
      list.forEach((p) => {
        if (p.socketId !== socket.id && !peersRef.current[p.socketId]) {
          createPeerConnection(p.socketId, true);
        }
      });
    });
    socket.on("chat-message", (msg) => setChatMessages((prev) => [...prev, msg]));
    // --- WebRTC signaling ---
    socket.on("user-joined", ({ userId: newUserId, userName, socketId, isInstructor: joinedIsInstructor }) => {
      if (socket.id === socketId) return;
      // New user joined, create peer connection as responder
      if (!peersRef.current[socketId]) {
        createPeerConnection(socketId, false);
      }
    });
    socket.on("offer", async ({ offer, socketId }) => {
      const pc = peersRef.current[socketId] || createPeerConnection(socketId, false);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      if (pendingCandidates[socketId]) {
        pendingCandidates[socketId].forEach((c) => pc.addIceCandidate(new RTCIceCandidate(c)));
        setPendingCandidates((prevQ) => { const newQ = { ...prevQ }; delete newQ[socketId]; return newQ; });
      }
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { roomId: classId, answer, userId: user._id, to: socketId });
    });
    socket.on("answer", async ({ answer, socketId }) => {
      const pc = peersRef.current[socketId];
      if (pc && pc.signalingState === "have-local-offer") {
        pc.setRemoteDescription(new RTCSessionDescription(answer));
        if (pendingCandidates[socketId]) {
          pendingCandidates[socketId].forEach((c) => pc.addIceCandidate(new RTCIceCandidate(c)));
          setPendingCandidates((prevQ) => { const newQ = { ...prevQ }; delete newQ[socketId]; return newQ; });
        }
      }
    });
    socket.on("ice-candidate", async ({ candidate, socketId }) => {
      const pc = peersRef.current[socketId];
      if (pc && candidate) {
        if (pc.remoteDescription && pc.remoteDescription.type) {
          pc.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          setPendingCandidates((prevQ) => ({ ...prevQ, [socketId]: [...(prevQ[socketId] || []), candidate] }));
        }
      }
    });
    socket.on("user-left", ({ socketId }) => {
      if (peersRef.current[socketId]) {
        peersRef.current[socketId].close();
        delete peersRef.current[socketId];
        setPeers((prev) => { const newPeers = { ...prev }; delete newPeers[socketId]; return newPeers; });
        setRemoteStreams((prev) => { const newStreams = { ...prev }; delete newStreams[socketId]; return newStreams; });
      }
      setParticipants((prev) => prev.filter((p) => p.socketId !== socketId));
    });
    // --- Hand raise ---
    socket.on("hands-updated", (hands) => {
      setParticipants((prev) => prev.map((p) => ({ ...p, handRaised: hands.includes(p._id) })));
    });
    // --- Mute/unmute ---
    socket.on("muted-users", (list) => {
      setParticipants((prev) => prev.map((p) => ({ ...p, isMuted: list.includes(p._id) })));
      setIsMuted(list.includes(user._id));
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach(track => track.enabled = !list.includes(user._id));
      }
    });
    // --- Whiteboard ---
    socket.on("whiteboard-update", (data) => {
      setWhiteboardData(data);
    });
    socket.on("whiteboard-clear", () => {
      setWhiteboardData([]);
    });
    // --- Polls ---
    socket.on("poll-launched", (poll) => {
      setPoll(poll);
      setHasVoted(false);
      setPollResults(null);
      if (user && user.accountType !== 'Instructor') {
        setPollsOpen(true);
      }
    });
    socket.on("poll-updated", (poll) => {
      setPoll(poll);
    });
    socket.on("poll-ended", (results) => {
      setPollResults(results);
      setPoll(null);
      setHasVoted(false);
    });
    // --- Reactions ---
    socket.on("show-reaction", ({ emoji, userName }) => {
      setShowReaction({ emoji, userName });
      setTimeout(() => setShowReaction(null), 2000);
    });
  };

  // --- Chat Handlers ---
  const handleSendMessage = (text) => {
    const msg = {
      userId: user._id,
      userName: user.firstName + " " + user.lastName,
      text,
      timestamp: new Date().toISOString(),
    };
    if (socketRef.current) socketRef.current.emit("chat-message", { roomId: classId, ...msg });
    // Do not update chatMessages here; let the socket event handle it
  };

  // --- Participants Handlers ---
  const handleMuteUser = (uid) => {
    if (socketRef.current) socketRef.current.emit("mute-user", { roomId: classId, userId: uid });
  };
  const handleUnmuteUser = (uid) => {
    if (socketRef.current) socketRef.current.emit("unmute-user", { roomId: classId, userId: uid });
  };
  const handleLowerHand = (uid) => {
    if (socketRef.current) socketRef.current.emit("lower-hand", { roomId: classId, userId: uid });
  };

  // --- Whiteboard Handlers ---
  const handleDraw = ({ type, x, y }) => {
    setWhiteboardData((prev) => {
      if (type === "start") {
        return [...prev, { x0: x, y0: y, x1: x, y1: y, color: drawColor, size: drawSize }];
      } else if (type === "move" && prev.length > 0) {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        updated[updated.length - 1] = { ...last, x1: x, y1: y };
        return updated;
      }
      return prev;
    });
    if (socketRef.current) socketRef.current.emit("whiteboard-update", { roomId: classId, data: whiteboardData });
  };
  const handleClearWhiteboard = () => {
    setWhiteboardData([]);
    if (socketRef.current) socketRef.current.emit("whiteboard-clear", { roomId: classId });
  };

  // --- Polls Handlers ---
  const handleLaunchPoll = (question, options) => {
    const pollObj = {
      question,
      options,
      votes: Array(options.length).fill(0),
      voters: [],
    };
    if (socketRef.current) socketRef.current.emit("launch-poll", { roomId: classId, poll: pollObj });
    setPoll(pollObj);
    setPollsOpen(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setHasVoted(false);
  };
  const handleVote = (optionIdx) => {
    if (!poll || hasVoted) return;
    if (socketRef.current) socketRef.current.emit("vote-poll", { roomId: classId, optionIdx, userId: user._id });
    setHasVoted(true);
  };

  // --- Reactions Handler ---
  const handleSendReaction = (emoji) => {
    if (socketRef.current) socketRef.current.emit("send-reaction", { roomId: classId, emoji, userName: user.firstName + " " + user.lastName });
    setShowReaction({ emoji, userName: user.firstName + " " + user.lastName });
    setTimeout(() => setShowReaction(null), 2000);
  };

  // --- Socket.IO Event Updates for Whiteboard, Polls, Reactions ---
  useEffect(() => {
    if (!socketRef.current) return;
    // Remove duplicate event listeners if already handled in connectToSignalingServer
    return () => {
      if (socketRef.current) {
        socketRef.current.off("whiteboard-update");
        socketRef.current.off("whiteboard-clear");
        socketRef.current.off("poll-launched");
        socketRef.current.off("poll-updated");
        socketRef.current.off("poll-ended");
        socketRef.current.off("show-reaction");
      }
    };
  }, [socketRef.current]);

  // Controls
  const handleMute = () => {
    setIsMuted((m) => !m);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => (track.enabled = isMuted));
    }
    // Emit mute event if needed
  };
  const handleCamera = () => {
    setIsCameraOn((c) => !c);
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => (track.enabled = !isCameraOn));
    }
    // Emit camera event if needed
  };
  // --- Screen Sharing Logic ---
  const handleScreenShare = async () => {
    if (!isInstructor) return;
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        // Replace video track in all peer connections
        Object.values(peersRef.current).forEach((pc) => {
          const senders = pc.getSenders();
          const videoSender = senders.find((s) => s.track && s.track.kind === "video");
          if (videoSender) videoSender.replaceTrack(screenTrack);
        });
        // Replace local video
        if (localStreamRef.current) {
          localStreamRef.current.getVideoTracks().forEach((track) => track.stop());
          localStreamRef.current.removeTrack(localStreamRef.current.getVideoTracks()[0]);
          localStreamRef.current.addTrack(screenTrack);
        }
        setLocalStream((prev) => {
          const newStream = new MediaStream([
            screenTrack,
            ...prev.getAudioTracks()
          ]);
          localStreamRef.current = newStream;
          return newStream;
        });
        setIsScreenSharing(true);
        // Listen for screen share end
        screenTrack.onended = () => {
          stopScreenShare();
        };
      } catch (err) {
        // User cancelled or error
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = async () => {
    // Restore camera
    try {
      const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const camTrack = camStream.getVideoTracks()[0];
      Object.values(peersRef.current).forEach((pc) => {
        const senders = pc.getSenders();
        const videoSender = senders.find((s) => s.track && s.track.kind === "video");
        if (videoSender) videoSender.replaceTrack(camTrack);
      });
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach((track) => track.stop());
        localStreamRef.current.removeTrack(localStreamRef.current.getVideoTracks()[0]);
        localStreamRef.current.addTrack(camTrack);
      }
      setLocalStream((prev) => {
        const newStream = new MediaStream([
          camTrack,
          ...prev.getAudioTracks()
        ]);
        localStreamRef.current = newStream;
        return newStream;
      });
      setIsScreenSharing(false);
    } catch (err) {
      // handle error
    }
  };
  const handleRaiseHand = () => {
    setIsHandRaised((h) => !h);
    // Emit hand raise event
  };
  const navigate = useNavigate();
  const handleLeave = () => {
    if (socketRef.current) socketRef.current.disconnect();
    Object.values(peersRef.current).forEach((pc) => pc.close());
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    navigate("/dashboard/live-classes");
  };

  // --- Recording Handlers ---
  const startRecording = () => {
    if (!localStreamRef.current) return;
    const stream = localStreamRef.current;
    const recorder = new window.MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus' });
    mediaRecorderRef.current = recorder;
    setRecordedChunks([]);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) setRecordedChunks((prev) => [...prev, e.data]);
    };
    recorder.onstop = () => setIsRecording(false);
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const downloadRecording = () => {
    if (recordedChunks.length === 0) return;
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `LiveClass-${classId}-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  if (!localStream) {
    return <div className="flex items-center justify-center h-full">Loading camera/mic...</div>;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      <TopBar classInfo={{ title: "Live Class" }} participants={participants} />
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <div className="flex-grow flex flex-col items-center md:items-start md:justify-start p-2 md:p-6">
          <div className="flex justify-center w-full md:max-w-xl mx-auto mt-4 md:mt-8">
            <InstructorVideo instructor={{ name: user?.firstName + " " + user?.lastName || "Instructor" }} stream={isInstructor ? localStream : (participants.find(p => p.isInstructor && p.socketId !== mySocketId) ? remoteStreams[participants.find(p => p.isInstructor && p.socketId !== mySocketId).socketId] : null)} />
          </div>
          <div className="w-full md:max-w-xl mx-auto">
            <StudentVideoBar participants={participants.filter(p => !p.isInstructor && p.socketId !== mySocketId).map((p) => ({ ...p, stream: remoteStreams[p.socketId] }))} />
          </div>
        </div>
        <div className="w-full md:w-96 h-auto border-l border-gray-200 bg-white">
          <Sidebar
            chatMessages={chatMessages}
            participants={participants}
            onOpenWhiteboard={() => setWhiteboardOpen(true)}
            onOpenPolls={() => setPollsOpen(true)}
            onSendMessage={handleSendMessage}
            userId={user?._id}
            isInstructor={isInstructor}
            onMuteUser={handleMuteUser}
            onUnmuteUser={handleUnmuteUser}
            onLowerHand={handleLowerHand}
          />
        </div>
      </div>
      <BottomBar
        recording={isRecording}
        onToggleRecording={() => isRecording ? stopRecording() : startRecording()}
        onDownloadRecording={downloadRecording}
        onOpenWhiteboard={() => setWhiteboardOpen(true)}
        onOpenPolls={() => setPollsOpen(true)}
        onOpenReactions={() => setReactionsOpen(true)}
        onMute={handleMute}
        onCamera={handleCamera}
        onScreenShare={handleScreenShare}
        onRaiseHand={handleRaiseHand}
        onLeave={handleLeave}
        isMuted={isMuted}
        isCameraOn={isCameraOn}
        isScreenSharing={isScreenSharing}
        isHandRaised={isHandRaised}
        isInstructor={isInstructor}
        hasRecording={recordedChunks.length > 0}
      />
      {whiteboardOpen && (
        <WhiteboardModal
          onClose={() => setWhiteboardOpen(false)}
          whiteboardData={whiteboardData}
          onDraw={handleDraw}
          onClear={handleClearWhiteboard}
          drawColor={drawColor}
          setDrawColor={setDrawColor}
          drawSize={drawSize}
          setDrawSize={setDrawSize}
          drawing={drawing}
          setDrawing={setDrawing}
        />
      )}
      {pollsOpen && (
        <PollsModal
          onClose={() => setPollsOpen(false)}
          isInstructor={isInstructor}
          onLaunchPoll={handleLaunchPoll}
          onVote={handleVote}
          poll={poll}
          pollResults={pollResults}
          hasVoted={hasVoted}
          setPollQuestion={setPollQuestion}
          setPollOptions={setPollOptions}
          pollQuestion={pollQuestion}
          pollOptions={pollOptions}
        />
      )}
      {isRecording && <RecordingIndicator />}
      {recordedChunks.length > 0 && !isRecording && (
        <div className="fixed bottom-24 right-8 z-50">
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow-lg" onClick={downloadRecording}>
            Download Recording
          </button>
        </div>
      )}
      {reactionsOpen && <ReactionsPanel onClose={() => setReactionsOpen(false)} onSendReaction={handleSendReaction} />}
      {showReaction && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 text-5xl animate-bounce bg-black/40 px-6 py-2 rounded-xl border border-blue-400/40">
          {showReaction.emoji} <span className="text-blue-800 text-lg">{showReaction.userName}</span>
        </div>
      )}
    </div>
  );
};

export default LiveClassRoom; 