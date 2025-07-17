import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import TopBar from "./TopBar";
import InstructorVideo from "./InstructorVideo";
import BottomBar from "./BottomBar";
import Sidebar from "./Sidebar/Sidebar";
import WhiteboardModal from "./Modals/WhiteboardModal";
import PollsModal from "./Modals/PollsModal";
import RecordingIndicator from "./Modals/RecordingIndicator";
import ReactionsPanel from "./Modals/ReactionsPanel";
import ChatTab from "./Sidebar/ChatTab";
import ParticipantsTab from "./Sidebar/ParticipantsTab";
import ExcalidrawWhiteboard from "./ExcalidrawWhiteboard";

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
  const [notification, setNotification] = useState(null);
  const [sidebarTab, setSidebarTab] = useState("Chat"); // Track active sidebar tab

  // --- WebRTC Peer Connection Logic ---
  const [peers, setPeers] = useState({});
  const [pendingCandidates, setPendingCandidates] = useState({});
  const [mySocketId, setMySocketId] = useState(null);

  // Helper: Create peer connection
  const createPeerConnection = (socketId, isInitiator) => {
    if (peersRef.current[socketId]) return peersRef.current[socketId];
    if (!localStreamRef.current) return null;
    console.log(`[WebRTC] Creating peer connection to ${socketId}, initiator: ${isInitiator}`);
    const pc = new window.RTCPeerConnection({ iceServers: ICE_SERVERS });
    localStreamRef.current.getTracks().forEach((track) => pc.addTrack(track, localStreamRef.current));
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        console.log(`[WebRTC] Sending ICE candidate to ${socketId}`);
        socketRef.current.emit("ice-candidate", { roomId: classId, candidate: event.candidate, userId: user._id, to: socketId });
      }
    };
    pc.ontrack = (event) => {
      const stream = event.streams[0];
      console.log(`[DEBUG][WebRTC] Received remote stream from ${socketId}`, stream);
      setRemoteStreams((prev) => ({ ...prev, [socketId]: stream }));
    };
    if (isInitiator) {
      pc.onnegotiationneeded = async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        if (socketRef.current) {
          console.log(`[WebRTC] Sending offer to ${socketId}`);
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
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const currentDrawing = useRef({ type: "start", x: 0, y: 0 });

  // --- Whiteboard State ---
  const [whiteboardData, setWhiteboardData] = useState([]);
  const [drawColor, setDrawColor] = useState("#fff");
  const [drawSize, setDrawSize] = useState(3);
  const [drawing, setDrawing] = useState(false);

  // --- Polls State ---
  const [pollHistory, setPollHistory] = useState([]); // All polls for this class
  const [activePoll, setActivePoll] = useState(null); // Current poll
  const [pollResults, setPollResults] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);

  // --- Reactions State ---
  const [showReaction, setShowReaction] = useState(null);

  // --- Whiteboard Scene State for Real-Time Sync ---
  const [whiteboardScene, setWhiteboardScene] = useState([]);

  // Set instructor status from Redux user
  useEffect(() => {
    if (user) {
      setIsInstructor(user.accountType === 'Instructor');
    }
  }, [user]);

  // Listen for whiteboard scene updates from instructor (for students)
  useEffect(() => {
    if (!isInstructor && socketRef.current) {
      const handler = ({ elements }) => {
        console.log(`[DEBUG][Whiteboard] Received scene update, elements count: ${elements.length}`, elements);
        setWhiteboardScene(elements);
      };
      socketRef.current.on("whiteboard-scene-update", handler);
      return () => socketRef.current.off("whiteboard-scene-update", handler);
    }
  }, [isInstructor]);

  // Listen for poll events
  useEffect(() => {
    if (!socketRef.current) return;
    // When a new poll is launched
    const handlePollLaunched = (poll) => {
      setActivePoll(poll);
      setHasVoted(false);
      setPollResults(null);
      setPollHistory((prev) => [...prev, poll]);
    };
    // When a poll is updated (votes)
    const handlePollUpdated = (poll) => {
      setActivePoll(poll);
      setPollHistory((prev) => prev.map(p => p.question === poll.question ? poll : p));
    };
    // When a poll ends
    const handlePollEnded = (results) => {
      setPollResults(results);
      setActivePoll(null);
      setPollHistory((prev) => prev.map(p => p.question === results.question ? results : p));
      setHasVoted(false);
    };
    socketRef.current.on("poll-launched", handlePollLaunched);
    socketRef.current.on("poll-updated", handlePollUpdated);
    socketRef.current.on("poll-ended", handlePollEnded);
    return () => {
      socketRef.current.off("poll-launched", handlePollLaunched);
      socketRef.current.off("poll-updated", handlePollUpdated);
      socketRef.current.off("poll-ended", handlePollEnded);
    };
  }, [socketRef.current]);

  // Listen for poll and whiteboard events for notifications
  useEffect(() => {
    if (!socketRef.current) return;
    const handlePollLaunched = (poll) => {
      setNotification("A new poll has been created!");
      setTimeout(() => setNotification(null), 3000);
    };
    const handleWhiteboardOpened = () => {
      setNotification("Whiteboard has been opened!");
      setTimeout(() => setNotification(null), 3000);
    };
    socketRef.current.on("poll-launched", handlePollLaunched);
    socketRef.current.on("whiteboard-opened", handleWhiteboardOpened);
    return () => {
      socketRef.current.off("poll-launched", handlePollLaunched);
      socketRef.current.off("whiteboard-opened", handleWhiteboardOpened);
    };
  }, [socketRef.current]);

  // Emit whiteboard-opened event when whiteboard is opened
  useEffect(() => {
    if (whiteboardOpen && socketRef.current) {
      socketRef.current.emit("whiteboard-opened", { roomId: classId });
    }
  }, [whiteboardOpen, classId]);

  // Get camera/mic and connect to signaling server
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        // Only instructor gets video, students get audio only
        const stream = await navigator.mediaDevices.getUserMedia(
          isInstructor ? { video: true, audio: true } : { video: false, audio: true }
        );
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
  }, [user, isInstructor]);

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
      console.log(`[WebRTC] Received offer from ${socketId}`);
      const pc = peersRef.current[socketId] || createPeerConnection(socketId, false);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      if (pendingCandidates[socketId]) {
        pendingCandidates[socketId].forEach((c) => pc.addIceCandidate(new RTCIceCandidate(c)));
        setPendingCandidates((prevQ) => { const newQ = { ...prevQ }; delete newQ[socketId]; return newQ; });
      }
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      console.log(`[WebRTC] Sending answer to ${socketId}`);
      socket.emit("answer", { roomId: classId, answer, userId: user._id, to: socketId });
    });
    socket.on("answer", async ({ answer, socketId }) => {
      console.log(`[WebRTC] Received answer from ${socketId}`);
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
      console.log(`[WebRTC] Received ICE candidate from ${socketId}`);
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
    // These handlers are now handled by the useEffect above
    // socket.on("poll-launched", (poll) => { ... });
    // socket.on("poll-updated", (poll) => { ... });
    // socket.on("poll-ended", (results) => { ... });
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
  const getCanvasCoords = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    const { x, y } = getCanvasCoords(e);
    currentDrawing.current = { x, y };
    setDrawing(true);
  };
  const handleMouseMove = (e) => {
    if (!drawing) return;
    const { x, y } = getCanvasCoords(e);
    const newSegment = {
      x0: currentDrawing.current.x,
      y0: currentDrawing.current.y,
      x1: x,
      y1: y,
      color: drawColor,
      size: drawSize,
    };
    setWhiteboardData(prev => [...prev, newSegment]);
    currentDrawing.current = { x, y };
    // Optionally emit just the new segment for real-time sync
    // if (socketRef.current) socketRef.current.emit("whiteboard-segment", { roomId: classId, segment: newSegment });
  };
  const handleMouseUp = () => {
    setDrawing(false);
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
    setActivePoll(pollObj);
    setPollsOpen(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setHasVoted(false);
  };
  const handleVote = (optionIdx) => {
    if (!activePoll || hasVoted) return;
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
        // The poll event handlers are now managed by the useEffect above
        // socketRef.current.off("poll-launched");
        // socketRef.current.off("poll-updated");
        // socketRef.current.off("poll-ended");
        socketRef.current.off("show-reaction");
      }
    };
  }, [socketRef.current]);

  // Draw whiteboard lines on canvas whenever whiteboardData changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    whiteboardData.forEach(({ x0, y0, x1, y1, color, size }) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    });
  }, [whiteboardData]);
  console.log("a");
  // Controls
  const handleMute = () => {
    if (!socketRef.current) return;
    if (isMuted) {
      socketRef.current.emit("unmute-user", { roomId: classId, userId: user._id });
    } else {
      socketRef.current.emit("mute-user", { roomId: classId, userId: user._id });
    }
    // Local audio track is enabled/disabled by the socket event handler for 'muted-users'
  };
  const handleCamera = () => {
    setIsCameraOn((c) => !c);
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => (track.enabled = !isCameraOn));
    }
    // Optionally, emit a camera toggle event if you want to sync camera state
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
    if (!socketRef.current) return;
    if (isHandRaised) {
      socketRef.current.emit("lower-hand", { roomId: classId, userId: user._id });
    } else {
      socketRef.current.emit("raise-hand", { roomId: classId, userId: user._id, userName: user.firstName + " " + user.lastName });
    }
    // The 'hands-updated' event will update local state
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

  // Handler for Polls button in BottomBar
  const handleOpenPolls = () => {
    if (isInstructor) {
      setPollsOpen(true);
    } else {
      setSidebarTab("Polls");
    }
  };

  if (!localStream) {
    return <div className="flex items-center justify-center h-full">Loading camera/mic...</div>;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg text-lg animate-fadeIn">
          {notification}
        </div>
      )}
      <TopBar classInfo={{ title: "Live Class" }} participants={participants} />
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <div className="flex-grow flex flex-col items-center md:items-start md:justify-start p-0 md:p-0 relative h-full w-full">
          {whiteboardOpen ? (
            <div className="flex flex-col items-stretch justify-stretch w-full h-full">
              {/* Use Excalidraw whiteboard with real-time sync */}
              <div className="w-full h-full flex-1">
                <ExcalidrawWhiteboard
                  isInstructor={isInstructor}
                  socket={socketRef.current}
                  roomId={classId}
                  scene={whiteboardScene}
                />
              </div>
              {/* Instructor video as small overlay in bottom right, above bottombar, left of sidebar */}
              <div className="fixed z-40 w-40 h-24 bottom-24 right-4 md:bottom-28 md:right-[26rem] md:w-56 md:h-32">
                <InstructorVideo
                  instructor={{ name: user?.firstName + " " + user?.lastName || "Instructor" }}
                  stream={isInstructor ? localStream : (participants.find(p => p.isInstructor && p.socketId !== mySocketId) ? remoteStreams[participants.find(p => p.isInstructor && p.socketId !== mySocketId).socketId] : null)}
                />
              </div>
            </div>
          ) : (
          <div className="flex justify-center w-full md:max-w-xl mx-auto mt-4 md:mt-8">
              <InstructorVideo
                instructor={{ name: user?.firstName + " " + user?.lastName || "Instructor" }}
                stream={isInstructor ? localStream : (participants.find(p => p.isInstructor && p.socketId !== mySocketId) ? remoteStreams[participants.find(p => p.isInstructor && p.socketId !== mySocketId).socketId] : null)}
              />
          </div>
          )}
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
            pollHistory={pollHistory}
            activePoll={activePoll}
            pollResults={pollResults}
            hasVoted={hasVoted}
            onVote={handleVote}
            sidebarTab={sidebarTab}
            setSidebarTab={setSidebarTab}
          />
        </div>
      </div>
      <BottomBar
        recording={isRecording}
        onToggleRecording={() => isRecording ? stopRecording() : startRecording()}
        onDownloadRecording={downloadRecording}
        onOpenWhiteboard={() => setWhiteboardOpen((prev) => !prev)}
        onOpenPolls={handleOpenPolls}
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
      {pollsOpen && (
        <PollsModal
          onClose={() => setPollsOpen(false)}
          isInstructor={isInstructor}
          onLaunchPoll={handleLaunchPoll}
          onVote={handleVote}
          poll={activePoll}
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