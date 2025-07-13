import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const SIGNALING_SERVER_URL = process.env.NODE_ENV === 'production' 
  ? "https://vidyarthi-hub.xyz" 
  : "http://localhost:5000";
const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];
const REACTIONS = ["👍", "👏", "😂", "😮", "❤️"];
const COLORS = ["#fff", "#f87171", "#34d399", "#60a5fa", "#fbbf24", "#a78bfa"];

export default function LiveClassRoom({ roomId, userId, userName, isInstructor }) {
  const [connected, setConnected] = useState(false);
  const [peers, setPeers] = useState({});
  const [remoteStreams, setRemoteStreams] = useState({});
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const chatEndRef = useRef(null);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const screenStreamRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const [pollModalOpen, setPollModalOpen] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [activePoll, setActivePoll] = useState(null); // {question, options, votes}
  const [pollResults, setPollResults] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [raisedHands, setRaisedHands] = useState([]); // [{userId, userName}]
  const [showReaction, setShowReaction] = useState(null); // {emoji, userName}
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState("#fff");
  const [drawSize, setDrawSize] = useState(3);
  const [whiteboardData, setWhiteboardData] = useState([]); // [{x0,y0,x1,y1,color,size}]
  const canvasRef = useRef(null);
  const [mutedUsers, setMutedUsers] = useState([]); // [userId]
  const [isMuted, setIsMuted] = useState(false);

  // Get camera/mic
  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (e) {
        setError("Could not access camera/mic");
      }
    })();
  }, []);

  // Connect to signaling server and handle WebRTC and chat
  useEffect(() => {
    if (!localStreamRef.current) return;
    console.log("Connecting to signaling server:", SIGNALING_SERVER_URL);
    socketRef.current = io(SIGNALING_SERVER_URL, { transports: ["websocket"] });
    const socket = socketRef.current;
    socket.on("connect", () => {
      console.log("Connected to signaling server, joining room:", roomId);
      setConnected(true);
      socket.emit("join-room", { roomId, userId, userName });
    });
    socket.on("user-joined", ({ userId: newUserId, socketId }) => {
      console.log("User joined:", newUserId, "socketId:", socketId);
      if (socket.id === socketId) return;
      createPeerConnection(socketId, true);
    });
    socket.on("offer", async ({ offer, socketId }) => {
      const pc = createPeerConnection(socketId, false);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { roomId, answer, userId, to: socketId });
    });
    socket.on("answer", async ({ answer, socketId }) => {
      const pc = peers[socketId];
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });
    socket.on("ice-candidate", async ({ candidate, socketId }) => {
      const pc = peers[socketId];
      if (pc && candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });
    socket.on("user-left", ({ socketId }) => {
      if (peers[socketId]) {
        peers[socketId].close();
        delete peers[socketId];
        setPeers({ ...peers });
        const newStreams = { ...remoteStreams };
        delete newStreams[socketId];
        setRemoteStreams(newStreams);
        setParticipants((prev) => prev.filter((id) => id !== socketId));
      }
    });
    // Chat events
    socket.on("chat-message", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.disconnect();
      Object.values(peers).forEach((pc) => pc.close());
      setPeers({});
      setRemoteStreams({});
      setParticipants([]);
    };
    // eslint-disable-next-line
  }, [localStreamRef.current]);

  // Create peer connection
  function createPeerConnection(socketId, isInitiator) {
    if (peers[socketId]) return peers[socketId];
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    localStreamRef.current.getTracks().forEach((track) => pc.addTrack(track, localStreamRef.current));
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("ice-candidate", { roomId, candidate: event.candidate, userId, to: socketId });
      }
    };
    pc.ontrack = (event) => {
      setRemoteStreams((prev) => ({ ...prev, [socketId]: event.streams[0] }));
      setParticipants((prev) => prev.includes(socketId) ? prev : [...prev, socketId]);
    };
    if (isInitiator) {
      pc.onnegotiationneeded = async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current.emit("offer", { roomId, offer, userId, to: socketId });
      };
    }
    setPeers((prev) => ({ ...prev, [socketId]: pc }));
    return pc;
  }

  // Leave class
  const handleLeave = () => {
    setLeaving(true);
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    Object.values(peers).forEach((pc) => pc.close());
    setPeers({});
    setRemoteStreams({});
    setParticipants([]);
  };

  // Send chat message
  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = {
      userId,
      userName,
      text: chatInput,
      timestamp: new Date().toISOString(),
    };
    socketRef.current.emit("chat-message", { roomId, ...msg });
    setChatMessages((prev) => [...prev, { ...msg, self: true }]);
    setChatInput("");
  };

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Screen sharing logic
  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current = screenStream;
      replaceVideoTrackForAllPeers(screenStream.getVideoTracks()[0]);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }
      setIsSharingScreen(true);
      screenStream.getVideoTracks()[0].onended = stopScreenShare;
    } catch (e) {
      // User cancelled or error
    }
  };

  const stopScreenShare = () => {
    if (!screenStreamRef.current) return;
    const cameraTrack = localStreamRef.current.getVideoTracks()[0];
    replaceVideoTrackForAllPeers(cameraTrack);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
    screenStreamRef.current.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
    setIsSharingScreen(false);
  };

  function replaceVideoTrackForAllPeers(newTrack) {
    Object.values(peers).forEach((pc) => {
      const senders = pc.getSenders().filter((s) => s.track && s.track.kind === "video");
      senders.forEach((sender) => sender.replaceTrack(newTrack));
    });
  }

  // Recording logic
  const startRecording = () => {
    if (!localVideoRef.current) return;
    const stream = localVideoRef.current.srcObject;
    if (!stream) return;
    const recorder = new window.MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus' });
    mediaRecorderRef.current = recorder;
    setRecordedChunks([]);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) setRecordedChunks((prev) => [...prev, e.data]);
    };
    recorder.onstop = () => {
      setIsRecording(false);
    };
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
    a.download = `LiveClass-${roomId}-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  // Polls & Quizzes logic
  const launchPoll = () => {
    if (!pollQuestion.trim() || pollOptions.some(opt => !opt.trim())) return;
    const poll = {
      question: pollQuestion,
      options: pollOptions,
      votes: Array(pollOptions.length).fill(0),
      voters: [],
    };
    socketRef.current.emit("launch-poll", { roomId, poll });
    setActivePoll(poll);
    setPollModalOpen(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setHasVoted(false);
  };

  const votePoll = (optionIdx) => {
    if (!activePoll || hasVoted) return;
    socketRef.current.emit("vote-poll", { roomId, optionIdx, userId });
    setHasVoted(true);
  };

  // Socket.io poll events
  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on("poll-launched", (poll) => {
      setActivePoll(poll);
      setHasVoted(false);
    });
    socketRef.current.on("poll-updated", (poll) => {
      setActivePoll(poll);
    });
    socketRef.current.on("poll-ended", (results) => {
      setPollResults(results);
      setActivePoll(null);
      setHasVoted(false);
    });
    return () => {
      if (socketRef.current) {
        socketRef.current.off("poll-launched");
        socketRef.current.off("poll-updated");
        socketRef.current.off("poll-ended");
      }
    };
  }, [socketRef.current]);

  const endPoll = () => {
    socketRef.current.emit("end-poll", { roomId });
  };

  // Hand raise logic
  const raiseHand = () => {
    socketRef.current.emit("raise-hand", { roomId, userId, userName });
  };
  const lowerHand = () => {
    socketRef.current.emit("lower-hand", { roomId, userId });
  };
  // Reaction logic
  const sendReaction = (emoji) => {
    socketRef.current.emit("send-reaction", { roomId, emoji, userName });
  };

  // Socket.io hand raise & reaction events
  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on("hands-updated", (hands) => {
      setRaisedHands(hands);
    });
    socketRef.current.on("show-reaction", ({ emoji, userName }) => {
      setShowReaction({ emoji, userName });
      setTimeout(() => setShowReaction(null), 2000);
    });
    return () => {
      if (socketRef.current) {
        socketRef.current.off("hands-updated");
        socketRef.current.off("show-reaction");
      }
    };
  }, [socketRef.current]);

  // Whiteboard drawing logic
  const handleMouseDown = (e) => {
    setDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setWhiteboardData((prev) => [...prev, { x0: x, y0: y, x1: x, y1: y, color: drawColor, size: drawSize }]);
  };
  const handleMouseMove = (e) => {
    if (!drawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setWhiteboardData((prev) => {
      const last = prev[prev.length - 1];
      if (!last) return prev;
      const updated = [...prev];
      updated[updated.length - 1] = { ...last, x1: x, y1: y };
      return updated;
    });
    // Emit draw event
    socketRef.current.emit("whiteboard-draw", { roomId, x1: x, y1: y });
  };
  const handleMouseUp = () => setDrawing(false);

  // Draw on canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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

  // Socket.io whiteboard events
  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on("whiteboard-update", (data) => {
      setWhiteboardData(data);
    });
    socketRef.current.on("whiteboard-clear", () => {
      setWhiteboardData([]);
    });
    return () => {
      if (socketRef.current) {
        socketRef.current.off("whiteboard-update");
        socketRef.current.off("whiteboard-clear");
      }
    };
  }, [socketRef.current]);

  // Emit whiteboard data on change
  useEffect(() => {
    if (!socketRef.current) return;
    if (drawing) {
      socketRef.current.emit("whiteboard-update", { roomId, data: whiteboardData });
    }
  }, [whiteboardData, drawing]);

  const clearWhiteboard = () => {
    setWhiteboardData([]);
    socketRef.current.emit("whiteboard-clear", { roomId });
  };

  // Mute/unmute logic
  const muteAll = () => {
    socketRef.current.emit("mute-all", { roomId });
  };
  const unmuteAll = () => {
    socketRef.current.emit("unmute-all", { roomId });
  };
  const muteUser = (uid) => {
    socketRef.current.emit("mute-user", { roomId, userId: uid });
  };
  const unmuteUser = (uid) => {
    socketRef.current.emit("unmute-user", { roomId, userId: uid });
  };
  const requestUnmute = () => {
    socketRef.current.emit("request-unmute", { roomId, userId, userName });
  };

  // Socket.io mute events
  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on("muted-users", (list) => {
      setMutedUsers(list);
      setIsMuted(list.includes(userId));
      // Actually mute/unmute local audio
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach(track => track.enabled = !list.includes(userId));
      }
    });
    socketRef.current.on("unmute-requested", ({ userId: reqId, userName }) => {
      if (isInstructor) {
        // Optionally show a toast or UI for instructor to approve
        // For MVP, auto-approve
        unmuteUser(reqId);
      }
    });
    return () => {
      if (socketRef.current) {
        socketRef.current.off("muted-users");
        socketRef.current.off("unmute-requested");
      }
    };
  }, [socketRef.current, isInstructor]);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80">
      <div className="bg-white/10 border border-cyan-900/30 rounded-2xl shadow-2xl p-6 text-white max-w-6xl w-full flex flex-col md:flex-row items-stretch">
        {/* Video Grid */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <h2 className="text-2xl font-bold mb-4">Live Class Room</h2>
          {/* Mute/Unmute Controls (Instructor) */}
          {isInstructor && (
            <div className="mb-2 flex gap-2">
              <button className="bg-red-500 px-3 py-1 rounded" onClick={muteAll}>Mute All</button>
              <button className="bg-green-500 px-3 py-1 rounded" onClick={unmuteAll}>Unmute All</button>
            </div>
          )}
          {/* Mute/Unmute for self (Student) */}
          {!isInstructor && isMuted && (
            <button className="bg-yellow-500 px-3 py-1 rounded mb-2" onClick={requestUnmute}>Request to Unmute</button>
          )}
          {/* Mute status indicator */}
          {isMuted && <div className="text-red-300 mb-2">You are muted by the instructor</div>}
          {/* Whiteboard toggle */}
          <button
            className={`mb-2 px-4 py-2 rounded-lg font-semibold shadow ${whiteboardOpen ? 'bg-cyan-700' : 'bg-cyan-500 hover:bg-cyan-600'} text-white`}
            onClick={() => setWhiteboardOpen((v) => !v)}
          >
            {whiteboardOpen ? "Close Whiteboard" : "Open Whiteboard"}
          </button>
          {whiteboardOpen && (
            <div className="mb-4 flex flex-col items-center">
              <div className="flex gap-2 mb-2">
                {COLORS.map((c) => (
                  <button key={c} className="w-6 h-6 rounded-full border-2" style={{ background: c, borderColor: drawColor === c ? '#fff' : '#333' }} onClick={() => setDrawColor(c)} />
                ))}
                <input type="range" min="2" max="10" value={drawSize} onChange={e => setDrawSize(Number(e.target.value))} className="ml-2" />
                <button className="ml-2 bg-red-500 px-2 py-1 rounded" onClick={clearWhiteboard}>Clear</button>
              </div>
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="bg-black rounded-xl border border-cyan-400 cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>
          )}
          {/* Hand Raise & Reactions */}
          <div className="flex gap-4 mb-2 items-center">
            {raisedHands.some(h => h.userId === userId) ? (
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold shadow" onClick={lowerHand}>Lower Hand ✋</button>
            ) : (
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold shadow" onClick={raiseHand}>Raise Hand ✋</button>
            )}
            <div className="flex gap-2">
              {REACTIONS.map((emoji) => (
                <button key={emoji} className="text-2xl" onClick={() => sendReaction(emoji)}>{emoji}</button>
              ))}
            </div>
          </div>
          {/* Show raised hands */}
          {raisedHands.length > 0 && (
            <div className="mb-2 text-yellow-200 text-sm">Hands Raised: {raisedHands.map(h => h.userName).join(", ")}</div>
          )}
          {/* Show reaction overlay */}
          {showReaction && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 text-5xl animate-bounce bg-black/40 px-6 py-2 rounded-xl border border-cyan-400/40">
              {showReaction.emoji} <span className="text-cyan-200 text-lg">{showReaction.userName}</span>
            </div>
          )}
          <div className="mb-2 flex gap-4 items-center">
            {!isSharingScreen ? (
              <button
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
                onClick={startScreenShare}
              >
                Share Screen
              </button>
            ) : (
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
                onClick={stopScreenShare}
              >
                Stop Sharing
              </button>
            )}
            {isSharingScreen && <span className="text-yellow-300 font-bold">You are sharing your screen</span>}
            {isInstructor && !isRecording && (
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
                onClick={startRecording}
              >
                Start Recording
              </button>
            )}
            {isInstructor && isRecording && (
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
                onClick={stopRecording}
              >
                Stop Recording
              </button>
            )}
            {isInstructor && recordedChunks.length > 0 && !isRecording && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
                onClick={downloadRecording}
              >
                Download Recording
              </button>
            )}
            {isRecording && <span className="text-red-300 font-bold animate-pulse">Recording...</span>}
          </div>
          <div className="mb-2">Room ID: <span className="text-cyan-300">{roomId}</span></div>
          <div className="mb-2">User: <span className="text-cyan-300">{userName || userId}</span></div>
          <div className="mb-2">Participants: <span className="text-cyan-300">{participants.length + 1}</span></div>
          <div className="mb-2">Signaling Server: <span className="text-cyan-300">{connected ? "Connected" : "Connecting..."}</span></div>
          {error && <div className="text-red-400 mb-2">{error}</div>}
          <div className="flex flex-wrap gap-6 justify-center items-center w-full mb-4">
            {/* Local video */}
            <div className="flex flex-col items-center">
              <video ref={localVideoRef} autoPlay muted playsInline className="rounded-lg border border-cyan-400 w-64 h-48 bg-black" />
              <div className="text-cyan-200 mt-2">You</div>
            </div>
            {/* Remote videos */}
            {Object.entries(remoteStreams).map(([id, stream]) => (
              <div key={id} className="flex flex-col items-center">
                <video
                  autoPlay
                  playsInline
                  className="rounded-lg border border-cyan-400 w-64 h-48 bg-black"
                  ref={(el) => { if (el) el.srcObject = stream; }}
                />
                <div className="text-cyan-200 mt-2">Participant</div>
              </div>
            ))}
          </div>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-semibold shadow transition-all mb-4"
            onClick={handleLeave}
            disabled={leaving}
          >
            {leaving ? "Leaving..." : "Leave Class"}
          </button>
          {/* Polls & Quizzes */}
          {isInstructor && (
            <button
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow mb-2"
              onClick={() => setPollModalOpen(true)}
            >
              Launch Poll/Quiz
            </button>
          )}
          {pollModalOpen && (
            <div className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/60">
              <div className="bg-white/20 border border-cyan-900/30 rounded-2xl shadow-2xl p-8 text-white max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Create Poll/Quiz</h3>
                <input
                  className="w-full mb-2 px-3 py-2 rounded bg-cyan-900/40 text-white"
                  placeholder="Question"
                  value={pollQuestion}
                  onChange={e => setPollQuestion(e.target.value)}
                />
                {pollOptions.map((opt, idx) => (
                  <input
                    key={idx}
                    className="w-full mb-2 px-3 py-2 rounded bg-cyan-900/40 text-white"
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={e => setPollOptions(pollOptions.map((o, i) => i === idx ? e.target.value : o))}
                  />
                ))}
                <button
                  className="text-cyan-300 underline text-sm mb-2"
                  onClick={() => setPollOptions([...pollOptions, ""])}
                  disabled={pollOptions.length >= 6}
                >
                  + Add Option
                </button>
                <div className="flex gap-2 mt-4">
                  <button className="bg-purple-500 px-4 py-2 rounded" onClick={launchPoll}>Launch</button>
                  <button className="bg-gray-500 px-4 py-2 rounded" onClick={() => setPollModalOpen(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
          {activePoll && (
            <div className="bg-cyan-900/60 border border-cyan-400/30 rounded-xl p-4 my-4 w-full max-w-md">
              <div className="font-bold mb-2">{activePoll.question}</div>
              <div className="space-y-2">
                {activePoll.options.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`w-full px-4 py-2 rounded ${hasVoted ? 'bg-cyan-700/60' : 'bg-cyan-500 hover:bg-cyan-600'} text-white font-semibold`}
                    onClick={() => votePoll(idx)}
                    disabled={hasVoted}
                  >
                    {opt} {activePoll.votes && hasVoted ? `(${activePoll.votes[idx]} votes)` : ""}
                  </button>
                ))}
              </div>
              {isInstructor && (
                <button className="mt-4 bg-red-500 px-4 py-2 rounded" onClick={endPoll}>End Poll</button>
              )}
            </div>
          )}
          {pollResults && (
            <div className="bg-cyan-900/60 border border-cyan-400/30 rounded-xl p-4 my-4 w-full max-w-md">
              <div className="font-bold mb-2">Poll Results</div>
              <div className="mb-2">{pollResults.question}</div>
              <ul>
                {pollResults.options.map((opt, idx) => (
                  <li key={idx}>{opt}: <b>{pollResults.votes[idx]}</b> votes</li>
                ))}
              </ul>
              <button className="mt-2 bg-gray-500 px-4 py-2 rounded" onClick={() => setPollResults(null)}>Close</button>
            </div>
          )}
        </div>
        {/* Chat Panel */}
        <div className="w-full md:w-80 bg-black/40 border-l border-cyan-900/30 rounded-2xl flex flex-col p-4 ml-0 md:ml-6 mt-6 md:mt-0">
          <div className="font-bold text-cyan-200 mb-2">Live Chat</div>
          <div className="flex-1 overflow-y-auto mb-2" style={{ maxHeight: 320 }}>
            {chatMessages.length === 0 ? (
              <div className="text-cyan-100/60 text-sm">No messages yet.</div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div key={idx} className={`mb-2 ${msg.self ? "text-right" : "text-left"}`}>
                  <span className="font-semibold text-cyan-300">{msg.userName || msg.userId}</span>
                  <span className="text-xs text-cyan-100/60 ml-2">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  <div className="inline-block bg-cyan-900/60 rounded-lg px-3 py-1 mt-1 text-cyan-100 text-sm max-w-[90%] break-words">
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendChatMessage} className="flex gap-2 mt-2">
            <input
              type="text"
              className="flex-1 rounded-lg px-3 py-2 bg-cyan-900/40 text-white placeholder-cyan-200 text-sm focus:outline-none"
              placeholder="Type a message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={leaving}
              maxLength={500}
            />
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
              disabled={leaving || !chatInput.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 