// import { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import { useNavigate, useLocation } from "react-router-dom";

// const SIGNALING_SERVER_URL = process.env.REACT_APP_SIGNALING_SERVER_URL || "http://localhost:5000";
// const ICE_SERVERS = [
//   { urls: "stun:stun.l.google.com:19302" },
//   {
//     urls: "turn:openrelay.metered.ca:80",
//     username: "openrelayproject",
//     credential: "openrelayproject"
//   }
// ];
// const REACTIONS = ["👍", "👏", "😂", "😮", "❤️"];
// const COLORS = ["#fff", "#f87171", "#34d399", "#60a5fa", "#fbbf24", "#a78bfa"];

// export default function LiveClassRoom({ roomId, userId, userName, isInstructor }) {
//   const [connected, setConnected] = useState(false);
//   const [peers, setPeers] = useState({});
//   const [remoteStreams, setRemoteStreams] = useState({});
//   const [participants, setParticipants] = useState([]);
//   const [error, setError] = useState(null);
//   const [leaving, setLeaving] = useState(false);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [chatInput, setChatInput] = useState("");
//   const socketRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const localVideoRef = useRef(null);
//   const remoteVideoRefs = useRef({});
//   const chatEndRef = useRef(null);
//   const [isSharingScreen, setIsSharingScreen] = useState(false);
//   const screenStreamRef = useRef(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordedChunks, setRecordedChunks] = useState([]);
//   const mediaRecorderRef = useRef(null);
//   const [pollModalOpen, setPollModalOpen] = useState(false);
//   const [pollQuestion, setPollQuestion] = useState("");
//   const [pollOptions, setPollOptions] = useState(["", ""]);
//   const [activePoll, setActivePoll] = useState(null); // {question, options, votes}
//   const [pollResults, setPollResults] = useState(null);
//   const [hasVoted, setHasVoted] = useState(false);
//   const [raisedHands, setRaisedHands] = useState([]); // [{userId, userName}]
//   const [showReaction, setShowReaction] = useState(null); // {emoji, userName}
//   const [whiteboardOpen, setWhiteboardOpen] = useState(false);
//   const [drawing, setDrawing] = useState(false);
//   const [drawColor, setDrawColor] = useState("#fff");
//   const [drawSize, setDrawSize] = useState(3);
//   const [whiteboardData, setWhiteboardData] = useState([]); // [{x0,y0,x1,y1,color,size}]
//   const canvasRef = useRef(null);
//   const [mutedUsers, setMutedUsers] = useState([]); // [userId]
//   const [isMuted, setIsMuted] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [pendingCandidates, setPendingCandidates] = useState({});

//   // Get camera/mic and connect to signaling server
//   useEffect(() => {
//     (async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         localStreamRef.current = stream;
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = stream;
//         }
//         // Now connect to signaling server
//         if (!socketRef.current) {
//           connectToSignalingServer();
//         }
//       } catch (e) {
//         setError("Could not access camera/mic");
//       }
//     })();
//   }, []);

//   function connectToSignalingServer() {
//     console.log("Connecting to signaling server:", SIGNALING_SERVER_URL);
//     socketRef.current = io(SIGNALING_SERVER_URL, { transports: ["websocket"] });
//     const socket = socketRef.current;
//     socket.on("connect", () => {
//       console.log("Connected to signaling server, joining room:", roomId);
//       setConnected(true);
//       socket.emit("join-room", { roomId, userId, userName });
//     });
//     socket.on("user-joined", ({ userId: newUserId, socketId }) => {
//       console.log("User joined:", newUserId, "socketId:", socketId);
//       if (socket.id === socketId) return;
//       // Only the existing user (initiator) creates a peer connection and sends an offer
//       if (socket.id !== socketId) {
//         createPeerConnection(socketId, true);
//       }
//     });
//     socket.on("offer", async ({ offer, socketId }) => {
//       console.log("Received offer from", socketId, offer);
//       // Only create a peer connection if it doesn't exist (receiver)
//       const pc = peers[socketId] || createPeerConnection(socketId, false);
//       await pc.setRemoteDescription(new RTCSessionDescription(offer));
//       // After setting remote description, add any queued candidates
//       if (pendingCandidates[socketId]) {
//         pendingCandidates[socketId].forEach((c) => {
//           pc.addIceCandidate(new RTCIceCandidate(c));
//         });
//         setPendingCandidates((prevQ) => {
//           const newQ = { ...prevQ };
//           delete newQ[socketId];
//           return newQ;
//         });
//       }
//       const answer = await pc.createAnswer();
//       await pc.setLocalDescription(answer);
//       if (socketRef.current) {
//         console.log("Sending answer to", socketId, answer);
//         socketRef.current.emit("answer", { roomId, answer, userId, to: socketId });
//       }
//     });
//     socket.on("answer", async ({ answer, socketId }) => {
//       console.log("Received answer from", socketId, answer);
//       setPeers((prev) => {
//         const pc = prev[socketId];
//         if (pc && pc.signalingState === "have-local-offer") {
//           pc.setRemoteDescription(new RTCSessionDescription(answer));
//           // After setting remote description, add any queued candidates
//           if (pendingCandidates[socketId]) {
//             pendingCandidates[socketId].forEach((c) => {
//               pc.addIceCandidate(new RTCIceCandidate(c));
//             });
//             setPendingCandidates((prevQ) => {
//               const newQ = { ...prevQ };
//               delete newQ[socketId];
//               return newQ;
//             });
//           }
//         }
//         return prev;
//       });
//     });
//     socket.on("ice-candidate", async ({ candidate, socketId }) => {
//       console.log("Received ICE candidate from", socketId, candidate);
//       setPeers((prev) => {
//         const pc = prev[socketId];
//         if (pc && candidate) {
//           if (pc.remoteDescription && pc.remoteDescription.type) {
//             pc.addIceCandidate(new RTCIceCandidate(candidate));
//           } else {
//             // Queue the candidate
//             setPendingCandidates((prevQ) => ({
//               ...prevQ,
//               [socketId]: [...(prevQ[socketId] || []), candidate],
//             }));
//           }
//         }
//         return prev;
//       });
//     });
//     socket.on("user-left", ({ socketId }) => {
//       setPeers((prev) => {
//         if (prev[socketId]) {
//           prev[socketId].close();
//           const newPeers = { ...prev };
//           delete newPeers[socketId];
//           return newPeers;
//         }
//         return prev;
//       });
//       setRemoteStreams((prev) => {
//         const newStreams = { ...prev };
//         delete newStreams[socketId];
//         return newStreams;
//       });
//       setParticipants((prev) => prev.filter((id) => id !== socketId));
//     });
//     // Chat events
//     socket.on("chat-message", (msg) => {
//       setChatMessages((prev) => [...prev, msg]);
//     });
//   }

//   // Create peer connection
//   function createPeerConnection(socketId, isInitiator) {
//     if (peers[socketId]) return peers[socketId];
//     if (!localStreamRef.current) {
//       console.warn("No local stream available when creating peer connection");
//       return null;
//     }
//     const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
//     localStreamRef.current.getTracks().forEach((track) => pc.addTrack(track, localStreamRef.current));
//     pc.onicecandidate = (event) => {
//       if (event.candidate && socketRef.current) {
//         console.log("Sending ICE candidate to", socketId, event.candidate);
//         socketRef.current.emit("ice-candidate", { roomId, candidate: event.candidate, userId, to: socketId });
//       }
//     };
//     pc.oniceconnectionstatechange = () => {
//       console.log("ICE connection state for", socketId, ":", pc.iceConnectionState);
//     };
//     pc.onconnectionstatechange = () => {
//       console.log("Connection state for", socketId, ":", pc.connectionState);
//     };
//     pc.ontrack = (event) => {
//       const stream = event.streams[0];
//       console.log("Received remote track from", socketId, stream);
//       if (stream) {
//         stream.getTracks().forEach(track => {
//           console.log(`[Remote] Track kind: ${track.kind}, enabled: ${track.enabled}, readyState: ${track.readyState}, muted: ${track.muted}`);
//         });
//       }
//       setRemoteStreams((prev) => ({ ...prev, [socketId]: stream }));
//       setParticipants((prev) => prev.includes(socketId) ? prev : [...prev, socketId]);
//     };
//     if (isInitiator) {
//       pc.onnegotiationneeded = async () => {
//         const offer = await pc.createOffer();
//         await pc.setLocalDescription(offer);
//         if (socketRef.current) {
//           console.log("Sending offer to", socketId, offer);
//           socketRef.current.emit("offer", { roomId, offer, userId, to: socketId });
//         }
//       };
//     }
//     setPeers((prev) => ({ ...prev, [socketId]: pc }));
//     return pc;
//   }

//   // Leave class
//   const handleLeave = () => {
//     setLeaving(true);
//     if (socketRef.current) {
//       socketRef.current.disconnect();
//     }
//     Object.values(peers).forEach((pc) => pc.close());
//     setPeers({});
//     setRemoteStreams({});
//     setParticipants([]);
//     // Redirect to previous page if available, else fallback
//     if (location.state && location.state.from) {
//       navigate(location.state.from);
//     } else {
//       navigate(-1);
//     }
//   };

//   // Send chat message
//   const sendChatMessage = (e) => {
//     e.preventDefault();
//     if (!chatInput.trim()) return;
//     const msg = {
//       userId,
//       userName,
//       text: chatInput,
//       timestamp: new Date().toISOString(),
//     };
//     if (socketRef.current) socketRef.current.emit("chat-message", { roomId, ...msg });
//     setChatMessages((prev) => [...prev, { ...msg, self: true }]);
//     setChatInput("");
//   };

//   // Scroll chat to bottom on new message
//   useEffect(() => {
//     if (chatEndRef.current) {
//       chatEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [chatMessages]);

//   // Attach remote streams to video elements
//   useEffect(() => {
//     Object.entries(remoteStreams).forEach(([socketId, stream]) => {
//       const videoElement = remoteVideoRefs.current[socketId];
//       if (videoElement && stream) {
//         console.log("Attaching remote stream to video element for", socketId);
//         videoElement.srcObject = stream;
//         // Ensure the video plays
//         videoElement.play().catch(e => console.log("Video play error:", e));
//       }
//     });
//   }, [remoteStreams]);

//   // Screen sharing logic
//   const startScreenShare = async () => {
//     try {
//       const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
//       screenStreamRef.current = screenStream;
//       replaceVideoTrackForAllPeers(screenStream.getVideoTracks()[0]);
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = screenStream;
//       }
//       setIsSharingScreen(true);
//       screenStream.getVideoTracks()[0].onended = stopScreenShare;
//     } catch (e) {
//       // User cancelled or error
//     }
//   };

//   const stopScreenShare = () => {
//     if (!screenStreamRef.current) return;
//     const cameraTrack = localStreamRef.current.getVideoTracks()[0];
//     replaceVideoTrackForAllPeers(cameraTrack);
//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = localStreamRef.current;
//     }
//     screenStreamRef.current.getTracks().forEach((t) => t.stop());
//     screenStreamRef.current = null;
//     setIsSharingScreen(false);
//   };

//   function replaceVideoTrackForAllPeers(newTrack) {
//     Object.values(peers).forEach((pc) => {
//       const senders = pc.getSenders().filter((s) => s.track && s.track.kind === "video");
//       senders.forEach((sender) => sender.replaceTrack(newTrack));
//     });
//   }

//   // Recording logic
//   const startRecording = () => {
//     if (!localVideoRef.current) return;
//     const stream = localVideoRef.current.srcObject;
//     if (!stream) return;
//     const recorder = new window.MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus' });
//     mediaRecorderRef.current = recorder;
//     setRecordedChunks([]);
//     recorder.ondataavailable = (e) => {
//       if (e.data.size > 0) setRecordedChunks((prev) => [...prev, e.data]);
//     };
//     recorder.onstop = () => {
//       setIsRecording(false);
//     };
//     recorder.start();
//     setIsRecording(true);
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//     }
//   };

//   const downloadRecording = () => {
//     if (recordedChunks.length === 0) return;
//     const blob = new Blob(recordedChunks, { type: 'video/webm' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.style.display = 'none';
//     a.href = url;
//     a.download = `LiveClass-${roomId}-${Date.now()}.webm`;
//     document.body.appendChild(a);
//     a.click();
//     setTimeout(() => {
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
//     }, 100);
//   };

//   // Polls & Quizzes logic
//   const launchPoll = () => {
//     if (!pollQuestion.trim() || pollOptions.some(opt => !opt.trim())) return;
//     const poll = {
//       question: pollQuestion,
//       options: pollOptions,
//       votes: Array(pollOptions.length).fill(0),
//       voters: [],
//     };
//     if (socketRef.current) socketRef.current.emit("launch-poll", { roomId, poll });
//     setActivePoll(poll);
//     setPollModalOpen(false);
//     setPollQuestion("");
//     setPollOptions(["", ""]);
//     setHasVoted(false);
//   };

//   const votePoll = (optionIdx) => {
//     if (!activePoll || hasVoted) return;
//     if (socketRef.current) socketRef.current.emit("vote-poll", { roomId, optionIdx, userId });
//     setHasVoted(true);
//   };

//   // Socket.io poll events
//   useEffect(() => {
//     if (!socketRef.current) return;
//     socketRef.current.on("poll-launched", (poll) => {
//       setActivePoll(poll);
//       setHasVoted(false);
//     });
//     socketRef.current.on("poll-updated", (poll) => {
//       setActivePoll(poll);
//     });
//     socketRef.current.on("poll-ended", (results) => {
//       setPollResults(results);
//       setActivePoll(null);
//       setHasVoted(false);
//     });
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.off("poll-launched");
//         socketRef.current.off("poll-updated");
//         socketRef.current.off("poll-ended");
//       }
//     };
//   }, [socketRef.current]);

//   const endPoll = () => {
//     if (socketRef.current) socketRef.current.emit("end-poll", { roomId });
//   };

//   // Hand raise logic
//   const raiseHand = () => {
//     if (socketRef.current) socketRef.current.emit("raise-hand", { roomId, userId, userName });
//   };
//   const lowerHand = () => {
//     if (socketRef.current) socketRef.current.emit("lower-hand", { roomId, userId });
//   };
//   // Reaction logic
//   const sendReaction = (emoji) => {
//     if (socketRef.current) socketRef.current.emit("send-reaction", { roomId, emoji, userName });
//   };

//   // Socket.io hand raise & reaction events
//   useEffect(() => {
//     if (!socketRef.current) return;
//     socketRef.current.on("hands-updated", (hands) => {
//       setRaisedHands(hands);
//     });
//     socketRef.current.on("show-reaction", ({ emoji, userName }) => {
//       setShowReaction({ emoji, userName });
//       setTimeout(() => setShowReaction(null), 2000);
//     });
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.off("hands-updated");
//         socketRef.current.off("show-reaction");
//       }
//     };
//   }, [socketRef.current]);

//   // Whiteboard drawing logic
//   const handleMouseDown = (e) => {
//     setDrawing(true);
//     const rect = canvasRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     setWhiteboardData((prev) => [...prev, { x0: x, y0: y, x1: x, y1: y, color: drawColor, size: drawSize }]);
//   };
//   const handleMouseMove = (e) => {
//     if (!drawing) return;
//     const rect = canvasRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     setWhiteboardData((prev) => {
//       const last = prev[prev.length - 1];
//       if (!last) return prev;
//       const updated = [...prev];
//       updated[updated.length - 1] = { ...last, x1: x, y1: y };
//       return updated;
//     });
//     // Emit draw event
//     if (socketRef.current) socketRef.current.emit("whiteboard-draw", { roomId, x1: x, y1: y });
//   };
//   const handleMouseUp = () => setDrawing(false);

//   // Draw on canvas
//   useEffect(() => {
//     if (!canvasRef.current) return;
//     const ctx = canvasRef.current.getContext("2d");
//     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//     whiteboardData.forEach(({ x0, y0, x1, y1, color, size }) => {
//       ctx.strokeStyle = color;
//       ctx.lineWidth = size;
//       ctx.lineCap = "round";
//       ctx.beginPath();
//       ctx.moveTo(x0, y0);
//       ctx.lineTo(x1, y1);
//       ctx.stroke();
//     });
//   }, [whiteboardData]);

//   // Socket.io whiteboard events
//   useEffect(() => {
//     if (!socketRef.current) return;
//     socketRef.current.on("whiteboard-update", (data) => {
//       setWhiteboardData(data);
//     });
//     socketRef.current.on("whiteboard-clear", () => {
//       setWhiteboardData([]);
//     });
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.off("whiteboard-update");
//         socketRef.current.off("whiteboard-clear");
//       }
//     };
//   }, [socketRef.current]);

//   // Emit whiteboard data on change
//   useEffect(() => {
//     if (!socketRef.current) return;
//     if (drawing) {
//       if (socketRef.current) socketRef.current.emit("whiteboard-update", { roomId, data: whiteboardData });
//     }
//   }, [whiteboardData, drawing]);

//   const clearWhiteboard = () => {
//     setWhiteboardData([]);
//     if (socketRef.current) socketRef.current.emit("whiteboard-clear", { roomId });
//   };

//   // Mute/unmute logic
//   const muteAll = () => {
//     if (socketRef.current) socketRef.current.emit("mute-all", { roomId });
//   };
//   const unmuteAll = () => {
//     if (socketRef.current) socketRef.current.emit("unmute-all", { roomId });
//   };
//   const muteUser = (uid) => {
//     if (socketRef.current) socketRef.current.emit("mute-user", { roomId, userId: uid });
//   };
//   const unmuteUser = (uid) => {
//     if (socketRef.current) socketRef.current.emit("unmute-user", { roomId, userId: uid });
//   };
//   const requestUnmute = () => {
//     if (socketRef.current) socketRef.current.emit("request-unmute", { roomId, userId, userName });
//   };

//   // Socket.io mute events
//   useEffect(() => {
//     if (!socketRef.current) return;
//     socketRef.current.on("muted-users", (list) => {
//       setMutedUsers(list);
//       setIsMuted(list.includes(userId));
//       // Actually mute/unmute local audio
//       if (localStreamRef.current) {
//         localStreamRef.current.getAudioTracks().forEach(track => track.enabled = !list.includes(userId));
//       }
//     });
//     socketRef.current.on("unmute-requested", ({ userId: reqId, userName }) => {
//       if (isInstructor) {
//         // Optionally show a toast or UI for instructor to approve
//         // For MVP, auto-approve
//         unmuteUser(reqId);
//       }
//     });
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.off("muted-users");
//         socketRef.current.off("unmute-requested");
//       }
//     };
//   }, [socketRef.current, isInstructor]);

//   return (
//     <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80">
//       <div className="bg-white/10 border border-cyan-900/30 rounded-2xl shadow-2xl p-6 text-white max-w-6xl w-full flex flex-col md:flex-row items-stretch">
//         {/* Video Grid */}
//         <div className="flex-1 flex flex-col items-center justify-center relative">
//           <h2 className="text-2xl font-bold mb-4">Live Class Room</h2>
//           {/* Mute/Unmute Controls (Instructor) */}
//           {isInstructor && (
//             <div className="mb-2 flex gap-2">
//               <button className="bg-red-500 px-3 py-1 rounded" onClick={muteAll}>Mute All</button>
//               <button className="bg-green-500 px-3 py-1 rounded" onClick={unmuteAll}>Unmute All</button>
//             </div>
//           )}
//           {/* Mute/Unmute for self (Student) */}
//           {!isInstructor && isMuted && (
//             <button className="bg-yellow-500 px-3 py-1 rounded mb-2" onClick={requestUnmute}>Request to Unmute</button>
//           )}
//           {/* Mute status indicator */}
//           {isMuted && <div className="text-red-300 mb-2">You are muted by the instructor</div>}
//           {/* Whiteboard toggle */}
//           <button
//             className={`mb-2 px-4 py-2 rounded-lg font-semibold shadow ${whiteboardOpen ? 'bg-cyan-700' : 'bg-cyan-500 hover:bg-cyan-600'} text-white`}
//             onClick={() => setWhiteboardOpen((v) => !v)}
//           >
//             {whiteboardOpen ? "Close Whiteboard" : "Open Whiteboard"}
//           </button>
//           {whiteboardOpen && (
//             <div className="mb-4 flex flex-col items-center">
//               <div className="flex gap-2 mb-2">
//                 {COLORS.map((c) => (
//                   <button key={c} className="w-6 h-6 rounded-full border-2" style={{ background: c, borderColor: drawColor === c ? '#fff' : '#333' }} onClick={() => setDrawColor(c)} />
//                 ))}
//                 <input type="range" min="2" max="10" value={drawSize} onChange={e => setDrawSize(Number(e.target.value))} className="ml-2" />
//                 <button className="ml-2 bg-red-500 px-2 py-1 rounded" onClick={clearWhiteboard}>Clear</button>
//               </div>
//               <canvas
//                 ref={canvasRef}
//                 width={600}
//                 height={400}
//                 className="bg-black rounded-xl border border-cyan-400 cursor-crosshair"
//                 onMouseDown={handleMouseDown}
//                 onMouseMove={handleMouseMove}
//                 onMouseUp={handleMouseUp}
//                 onMouseLeave={handleMouseUp}
//               />
//             </div>
//           )}
//           {/* Hand Raise & Reactions */}
//           <div className="flex gap-4 mb-2 items-center">
//             {raisedHands.some(h => h.userId === userId) ? (
//               <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold shadow" onClick={lowerHand}>Lower Hand ✋</button>
//             ) : (
//               <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold shadow" onClick={raiseHand}>Raise Hand ✋</button>
//             )}
//             <div className="flex gap-2">
//               {REACTIONS.map((emoji) => (
//                 <button key={emoji} className="text-2xl" onClick={() => sendReaction(emoji)}>{emoji}</button>
//               ))}
//             </div>
//           </div>
//           {/* Show raised hands */}
//           {raisedHands.length > 0 && (
//             <div className="mb-2 text-yellow-200 text-sm">Hands Raised: {raisedHands.map(h => h.userName).join(", ")}</div>
//           )}
//           {/* Show reaction overlay */}
//           {showReaction && (
//             <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 text-5xl animate-bounce bg-black/40 px-6 py-2 rounded-xl border border-cyan-400/40">
//               {showReaction.emoji} <span className="text-cyan-200 text-lg">{showReaction.userName}</span>
//             </div>
//           )}
//           <div className="mb-2 flex gap-4 items-center">
//             {!isSharingScreen ? (
//               <button
//                 className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
//                 onClick={startScreenShare}
//               >
//                 Share Screen
//               </button>
//             ) : (
//               <button
//                 className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
//                 onClick={stopScreenShare}
//               >
//                 Stop Sharing
//               </button>
//             )}
//             {isSharingScreen && <span className="text-yellow-300 font-bold">You are sharing your screen</span>}
//             {isInstructor && !isRecording && (
//               <button
//                 className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
//                 onClick={startRecording}
//               >
//                 Start Recording
//               </button>
//             )}
//             {isInstructor && isRecording && (
//               <button
//                 className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
//                 onClick={stopRecording}
//               >
//                 Stop Recording
//               </button>
//             )}
//             {isInstructor && recordedChunks.length > 0 && !isRecording && (
//               <button
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
//                 onClick={downloadRecording}
//               >
//                 Download Recording
//               </button>
//             )}
//             {isRecording && <span className="text-red-300 font-bold animate-pulse">Recording...</span>}
//           </div>
//           <div className="mb-2">Room ID: <span className="text-cyan-300">{roomId}</span></div>
//           <div className="mb-2">User: <span className="text-cyan-300">{userName || userId}</span></div>
//           <div className="mb-2">Participants: <span className="text-cyan-300">{participants.length + 1}</span></div>
//           <div className="mb-2">Signaling Server: <span className="text-cyan-300">{connected ? "Connected" : "Connecting..."}</span></div>
//           <div className="mb-2">Remote Streams: <span className="text-cyan-300">{Object.keys(remoteStreams).length}</span></div>
//           <div className="mb-2">Peer Connections: <span className="text-cyan-300">{Object.keys(peers).length}</span></div>
//           {error && <div className="text-red-400 mb-2">{error}</div>}
//           <div className="flex flex-wrap gap-6 justify-center items-center w-full mb-4">
//             {/* Local video */}
//             <div className="flex flex-col items-center">
//               <video ref={localVideoRef} autoPlay muted playsInline className="rounded-lg border border-cyan-400 w-64 h-48 bg-black" />
//               <div className="text-cyan-200 mt-2">You</div>
//             </div>
//             {/* Remote videos */}
//             {Object.entries(remoteStreams).map(([id, stream]) => {
//               const videoTrack = stream?.getVideoTracks?.()[0];
//               return (
//                 <div key={id} className="flex flex-col items-center">
//                   <video
//                     ref={el => {
//                       remoteVideoRefs.current[id] = el;
//                       if (el && stream && el.srcObject !== stream) {
//                         el.srcObject = stream;
//                         el.play().catch(e => {
//                           if (e.name !== 'AbortError') console.log('Remote video play error:', e);
//                         });
//                       }
//                     }}
//                     autoPlay
//                     playsInline
//                     className="rounded-lg border border-cyan-400 w-64 h-48 bg-black"
//                   />
//                   <div className="text-cyan-200 mt-2">Participant {id.slice(-4)}</div>
//                   <div className="text-xs text-cyan-100/60">
//                     Stream: {stream ? 'Active' : 'No stream'}<br/>
//                     Video track: {videoTrack ? `enabled=${videoTrack.enabled}, state=${videoTrack.readyState}, muted=${videoTrack.muted}` : 'none'}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//           <button
//             className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-semibold shadow transition-all mb-4"
//             onClick={handleLeave}
//             disabled={leaving}
//           >
//             {leaving ? "Leaving..." : "Leave Class"}
//           </button>
//           {/* Polls & Quizzes */}
//           {isInstructor && (
//             <button
//               className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow mb-2"
//               onClick={() => setPollModalOpen(true)}
//             >
//               Launch Poll/Quiz
//             </button>
//           )}
//           {pollModalOpen && (
//             <div className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/60">
//               <div className="bg-white/20 border border-cyan-900/30 rounded-2xl shadow-2xl p-8 text-white max-w-md w-full">
//                 <h3 className="text-xl font-bold mb-4">Create Poll/Quiz</h3>
//                 <input
//                   className="w-full mb-2 px-3 py-2 rounded bg-cyan-900/40 text-white"
//                   placeholder="Question"
//                   value={pollQuestion}
//                   onChange={e => setPollQuestion(e.target.value)}
//                 />
//                 {pollOptions.map((opt, idx) => (
//                   <input
//                     key={idx}
//                     className="w-full mb-2 px-3 py-2 rounded bg-cyan-900/40 text-white"
//                     placeholder={`Option ${idx + 1}`}
//                     value={opt}
//                     onChange={e => setPollOptions(pollOptions.map((o, i) => i === idx ? e.target.value : o))}
//                   />
//                 ))}
//                 <button
//                   className="text-cyan-300 underline text-sm mb-2"
//                   onClick={() => setPollOptions([...pollOptions, ""])}
//                   disabled={pollOptions.length >= 6}
//                 >
//                   + Add Option
//                 </button>
//                 <div className="flex gap-2 mt-4">
//                   <button className="bg-purple-500 px-4 py-2 rounded" onClick={launchPoll}>Launch</button>
//                   <button className="bg-gray-500 px-4 py-2 rounded" onClick={() => setPollModalOpen(false)}>Cancel</button>
//                 </div>
//               </div>
//             </div>
//           )}
//           {activePoll && (
//             <div className="bg-cyan-900/60 border border-cyan-400/30 rounded-xl p-4 my-4 w-full max-w-md">
//               <div className="font-bold mb-2">{activePoll.question}</div>
//               <div className="space-y-2">
//                 {activePoll.options.map((opt, idx) => (
//                   <button
//                     key={idx}
//                     className={`w-full px-4 py-2 rounded ${hasVoted ? 'bg-cyan-700/60' : 'bg-cyan-500 hover:bg-cyan-600'} text-white font-semibold`}
//                     onClick={() => votePoll(idx)}
//                     disabled={hasVoted}
//                   >
//                     {opt} {activePoll.votes && hasVoted ? `(${activePoll.votes[idx]} votes)` : ""}
//                   </button>
//                 ))}
//               </div>
//               {isInstructor && (
//                 <button className="mt-4 bg-red-500 px-4 py-2 rounded" onClick={endPoll}>End Poll</button>
//               )}
//             </div>
//           )}
//           {pollResults && (
//             <div className="bg-cyan-900/60 border border-cyan-400/30 rounded-xl p-4 my-4 w-full max-w-md">
//               <div className="font-bold mb-2">Poll Results</div>
//               <div className="mb-2">{pollResults.question}</div>
//               <ul>
//                 {pollResults.options.map((opt, idx) => (
//                   <li key={idx}>{opt}: <b>{pollResults.votes[idx]}</b> votes</li>
//                 ))}
//               </ul>
//               <button className="mt-2 bg-gray-500 px-4 py-2 rounded" onClick={() => setPollResults(null)}>Close</button>
//             </div>
//           )}
//         </div>
//         {/* Chat Panel */}
//         <div className="w-full md:w-80 bg-black/40 border-l border-cyan-900/30 rounded-2xl flex flex-col p-4 ml-0 md:ml-6 mt-6 md:mt-0">
//           <div className="font-bold text-cyan-200 mb-2">Live Chat</div>
//           <div className="flex-1 overflow-y-auto mb-2" style={{ maxHeight: 320 }}>
//             {chatMessages.length === 0 ? (
//               <div className="text-cyan-100/60 text-sm">No messages yet.</div>
//             ) : (
//               chatMessages.map((msg, idx) => (
//                 <div key={idx} className={`mb-2 ${msg.self ? "text-right" : "text-left"}`}>
//                   <span className="font-semibold text-cyan-300">{msg.userName || msg.userId}</span>
//                   <span className="text-xs text-cyan-100/60 ml-2">{new Date(msg.timestamp).toLocaleTimeString()}</span>
//                   <div className="inline-block bg-cyan-900/60 rounded-lg px-3 py-1 mt-1 text-cyan-100 text-sm max-w-[90%] break-words">
//                     {msg.text}
//                   </div>
//                 </div>
//               ))
//             )}
//             <div ref={chatEndRef} />
//           </div>
//           <form onSubmit={sendChatMessage} className="flex gap-2 mt-2">
//             <input
//               type="text"
//               className="flex-1 rounded-lg px-3 py-2 bg-cyan-900/40 text-white placeholder-cyan-200 text-sm focus:outline-none"
//               placeholder="Type a message..."
//               value={chatInput}
//               onChange={(e) => setChatInput(e.target.value)}
//               disabled={leaving}
//               maxLength={500}
//             />
//             <button
//               type="submit"
//               className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
//               disabled={leaving || !chatInput.trim()}
//             >
//               Send
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// } 






import { useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";

const SIGNALING_SERVER_URL = process.env.REACT_APP_SIGNALING_SERVER_URL || "http://localhost:5000";
const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  {
    urls: "turn:openrelay.metered.ca:80",
    username: "openrelayproject",
    credential: "openrelayproject"
  }
];
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
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [pollModalOpen, setPollModalOpen] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [activePoll, setActivePoll] = useState(null);
  const [pollResults, setPollResults] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [raisedHands, setRaisedHands] = useState([]);
  const [showReaction, setShowReaction] = useState(null);
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState("#fff");
  const [drawSize, setDrawSize] = useState(3);
  const [whiteboardData, setWhiteboardData] = useState([]);
  const [mutedUsers, setMutedUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [pendingCandidates, setPendingCandidates] = useState({});
  const [connectionStates, setConnectionStates] = useState({});
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});
  const chatEndRef = useRef(null);
  const screenStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize media and connection
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720 }, 
          audio: { echoCancellation: true, noiseSuppression: true }
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        connectToSignalingServer();
      } catch (e) {
        console.error("Media access error:", e);
        setError("Could not access camera/mic. Please check permissions.");
      }
    };

    initializeMedia();

    return () => {
      // Cleanup on unmount
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      Object.values(peers).forEach(pc => pc.close());
    };
  }, []);

  const connectToSignalingServer = useCallback(() => {
    console.log("Connecting to signaling server:", SIGNALING_SERVER_URL);
    socketRef.current = io(SIGNALING_SERVER_URL, { 
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });
    
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to signaling server, joining room:", roomId);
      setConnected(true);
      setError(null);
      socket.emit("join-room", { roomId, userId, userName });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from signaling server");
      setConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setError("Failed to connect to signaling server");
    });

    socket.on("user-joined", ({ userId: newUserId, socketId }) => {
      console.log("User joined:", newUserId, "socketId:", socketId);
      if (socket.id !== socketId) {
        createPeerConnection(socketId, true);
      }
    });

    socket.on("offer", async ({ offer, socketId }) => {
      console.log("Received offer from", socketId);
      try {
        const pc = peers[socketId] || createPeerConnection(socketId, false);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        
        // Process pending candidates
        if (pendingCandidates[socketId]) {
          for (const candidate of pendingCandidates[socketId]) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
          setPendingCandidates(prev => {
            const newPending = { ...prev };
            delete newPending[socketId];
            return newPending;
          });
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { roomId, answer, userId, to: socketId });
      } catch (error) {
        console.error("Error handling offer:", error);
        setError("Failed to handle incoming call");
      }
    });

    socket.on("answer", async ({ answer, socketId }) => {
      console.log("Received answer from", socketId);
      try {
        const pc = peers[socketId];
        if (pc && pc.signalingState === "have-local-offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          
          // Process pending candidates
          if (pendingCandidates[socketId]) {
            for (const candidate of pendingCandidates[socketId]) {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
            setPendingCandidates(prev => {
              const newPending = { ...prev };
              delete newPending[socketId];
              return newPending;
            });
          }
        }
      } catch (error) {
        console.error("Error handling answer:", error);
      }
    });

    socket.on("ice-candidate", async ({ candidate, socketId }) => {
      console.log("Received ICE candidate from", socketId);
      try {
        const pc = peers[socketId];
        if (pc && candidate) {
          if (pc.remoteDescription && pc.remoteDescription.type) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } else {
            setPendingCandidates(prev => ({
              ...prev,
              [socketId]: [...(prev[socketId] || []), candidate]
            }));
          }
        }
      } catch (error) {
        console.error("Error handling ICE candidate:", error);
      }
    });

    socket.on("user-left", ({ socketId }) => {
      console.log("User left:", socketId);
      setPeers(prev => {
        if (prev[socketId]) {
          prev[socketId].close();
          const newPeers = { ...prev };
          delete newPeers[socketId];
          return newPeers;
        }
        return prev;
      });
      setRemoteStreams(prev => {
        const newStreams = { ...prev };
        delete newStreams[socketId];
        return newStreams;
      });
      setParticipants(prev => prev.filter(id => id !== socketId));
      setConnectionStates(prev => {
        const newStates = { ...prev };
        delete newStates[socketId];
        return newStates;
      });
    });

    // Chat events
    socket.on("chat-message", (msg) => {
      setChatMessages(prev => [...prev, msg]);
    });

    // Poll events
    socket.on("poll-launched", (poll) => {
      setActivePoll(poll);
      setHasVoted(false);
    });

    socket.on("poll-updated", (poll) => {
      setActivePoll(poll);
    });

    socket.on("poll-ended", (results) => {
      setPollResults(results);
      setActivePoll(null);
      setHasVoted(false);
    });

    // Hand raise and reaction events
    socket.on("hands-updated", (hands) => {
      setRaisedHands(hands);
    });

    socket.on("show-reaction", ({ emoji, userName }) => {
      setShowReaction({ emoji, userName });
      setTimeout(() => setShowReaction(null), 2000);
    });

    // Whiteboard events
    socket.on("whiteboard-update", (data) => {
      setWhiteboardData(data);
    });

    socket.on("whiteboard-clear", () => {
      setWhiteboardData([]);
    });

    // Mute events
    socket.on("muted-users", (list) => {
      setMutedUsers(list);
      const wasMuted = list.includes(userId);
      setIsMuted(wasMuted);
      
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach(track => {
          track.enabled = !wasMuted;
        });
      }
    });

    socket.on("unmute-requested", ({ userId: reqId, userName }) => {
      if (isInstructor) {
        unmuteUser(reqId);
      }
    });

  }, [roomId, userId, userName, isInstructor]);

  const createPeerConnection = useCallback((socketId, isInitiator) => {
    if (peers[socketId]) return peers[socketId];
    if (!localStreamRef.current) {
      console.warn("No local stream available");
      return null;
    }

    const pc = new RTCPeerConnection({ 
      iceServers: ICE_SERVERS,
      iceCandidatePoolSize: 10
    });

    // Add local stream tracks
    localStreamRef.current.getTracks().forEach(track => {
      pc.addTrack(track, localStreamRef.current);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("ice-candidate", { 
          roomId, 
          candidate: event.candidate, 
          userId, 
          to: socketId 
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`ICE connection state for ${socketId}:`, pc.iceConnectionState);
      setConnectionStates(prev => ({ 
        ...prev, 
        [socketId]: pc.iceConnectionState 
      }));
    };

    pc.ontrack = (event) => {
      console.log("Received remote track from", socketId);
      const stream = event.streams[0];
      if (stream) {
        setRemoteStreams(prev => ({ ...prev, [socketId]: stream }));
        setParticipants(prev => prev.includes(socketId) ? prev : [...prev, socketId]);
      }
    };

    if (isInitiator) {
      pc.onnegotiationneeded = async () => {
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          if (socketRef.current) {
            socketRef.current.emit("offer", { roomId, offer, userId, to: socketId });
          }
        } catch (error) {
          console.error("Error creating offer:", error);
        }
      };
    }

    setPeers(prev => ({ ...prev, [socketId]: pc }));
    return pc;
  }, [roomId, userId, peers]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(prev => !prev);
    }
  }, []);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current && !isMuted) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(prev => !prev);
    }
  }, [isMuted]);

  // Screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { mediaSource: 'screen' }, 
        audio: true 
      });
      screenStreamRef.current = screenStream;
      
      const videoTrack = screenStream.getVideoTracks()[0];
      replaceVideoTrackForAllPeers(videoTrack);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }
      
      setIsSharingScreen(true);
      videoTrack.onended = stopScreenShare;
    } catch (error) {
      console.error("Screen share error:", error);
    }
  }, []);

  const stopScreenShare = useCallback(() => {
    if (!screenStreamRef.current) return;
    
    const cameraTrack = localStreamRef.current.getVideoTracks()[0];
    replaceVideoTrackForAllPeers(cameraTrack);
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
    
    screenStreamRef.current.getTracks().forEach(track => track.stop());
    screenStreamRef.current = null;
    setIsSharingScreen(false);
  }, []);

  const replaceVideoTrackForAllPeers = useCallback((newTrack) => {
    Object.values(peers).forEach(pc => {
      const senders = pc.getSenders().filter(sender => 
        sender.track && sender.track.kind === "video"
      );
      senders.forEach(sender => sender.replaceTrack(newTrack));
    });
  }, [peers]);

  // Recording
  const startRecording = useCallback(() => {
    if (!localVideoRef.current) return;
    
    const stream = localVideoRef.current.srcObject;
    if (!stream) return;
    
    try {
      const recorder = new MediaRecorder(stream, { 
        mimeType: 'video/webm;codecs=vp9,opus' 
      });
      
      mediaRecorderRef.current = recorder;
      setRecordedChunks([]);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setRecordedChunks(prev => [...prev, e.data]);
        }
      };
      
      recorder.onstop = () => {
        setIsRecording(false);
      };
      
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
      setError("Failed to start recording");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const downloadRecording = useCallback(() => {
    if (recordedChunks.length === 0) return;
    
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LiveClass-${roomId}-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  }, [recordedChunks, roomId]);

  // Chat
  const sendChatMessage = useCallback((e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const msg = {
      userId,
      userName,
      text: chatInput,
      timestamp: new Date().toISOString(),
    };
    
    if (socketRef.current) {
      socketRef.current.emit("chat-message", { roomId, ...msg });
    }
    setChatMessages(prev => [...prev, { ...msg, self: true }]);
    setChatInput("");
  }, [chatInput, userId, userName, roomId]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Polls
  const launchPoll = useCallback(() => {
    if (!pollQuestion.trim() || pollOptions.some(opt => !opt.trim())) return;
    
    const poll = {
      question: pollQuestion,
      options: pollOptions,
      votes: Array(pollOptions.length).fill(0),
      voters: [],
    };
    
    if (socketRef.current) {
      socketRef.current.emit("launch-poll", { roomId, poll });
    }
    
    setActivePoll(poll);
    setPollModalOpen(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setHasVoted(false);
  }, [pollQuestion, pollOptions, roomId]);

  const votePoll = useCallback((optionIdx) => {
    if (!activePoll || hasVoted) return;
    if (socketRef.current) {
      socketRef.current.emit("vote-poll", { roomId, optionIdx, userId });
    }
    setHasVoted(true);
  }, [activePoll, hasVoted, roomId, userId]);

  const endPoll = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("end-poll", { roomId });
    }
  }, [roomId]);

  // Hand raise
  const raiseHand = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("raise-hand", { roomId, userId, userName });
    }
  }, [roomId, userId, userName]);

  const lowerHand = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("lower-hand", { roomId, userId });
    }
  }, [roomId, userId]);

  // Reactions
  const sendReaction = useCallback((emoji) => {
    if (socketRef.current) {
      socketRef.current.emit("send-reaction", { roomId, emoji, userName });
    }
  }, [roomId, userName]);

  // Whiteboard
  const handleMouseDown = useCallback((e) => {
    if (!canvasRef.current) return;
    setDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setWhiteboardData(prev => [...prev, { 
      x0: x, y0: y, x1: x, y1: y, color: drawColor, size: drawSize 
    }]);
  }, [drawColor, drawSize]);

  const handleMouseMove = useCallback((e) => {
    if (!drawing || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setWhiteboardData(prev => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last) {
        updated[updated.length - 1] = { ...last, x1: x, y1: y };
      }
      return updated;
    });
  }, [drawing]);

  const handleMouseUp = useCallback(() => {
    setDrawing(false);
  }, []);

  const clearWhiteboard = useCallback(() => {
    setWhiteboardData([]);
    if (socketRef.current) {
      socketRef.current.emit("whiteboard-clear", { roomId });
    }
  }, [roomId]);

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

  // Emit whiteboard updates
  useEffect(() => {
    if (drawing && socketRef.current) {
      socketRef.current.emit("whiteboard-update", { roomId, data: whiteboardData });
    }
  }, [whiteboardData, drawing, roomId]);

  // Mute controls
  const muteAll = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("mute-all", { roomId });
    }
  }, [roomId]);

  const unmuteAll = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("unmute-all", { roomId });
    }
  }, [roomId]);

  const muteUser = useCallback((uid) => {
    if (socketRef.current) {
      socketRef.current.emit("mute-user", { roomId, userId: uid });
    }
  }, [roomId]);

  const unmuteUser = useCallback((uid) => {
    if (socketRef.current) {
      socketRef.current.emit("unmute-user", { roomId, userId: uid });
    }
  }, [roomId]);

  const requestUnmute = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("request-unmute", { roomId, userId, userName });
    }
  }, [roomId, userId, userName]);

  // Leave class
  const handleLeave = useCallback(() => {
    setLeaving(true);
    
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    
    Object.values(peers).forEach(pc => pc.close());
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  }, [peers, location.state, navigate]);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 text-white max-w-7xl w-full h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Live Class Room</h2>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">{connected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Room: {roomId}</span>
            <span className="text-sm">Participants: {participants.length + 1}</span>
            <button
              onClick={handleLeave}
              disabled={leaving}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
            >
              {leaving ? "Leaving..." : "Leave"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4 text-red-200">
            {error}
          </div>
        )}

        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Control Panel */}
            <div className="flex flex-wrap items-center gap-4 mb-4 p-4 bg-gray-800 rounded-lg">
              {/* Video/Audio Controls */}
              <div className="flex gap-2">
                <button
                  onClick={toggleVideo}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    isVideoEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {isVideoEnabled ? '📹' : '📹❌'} Video
                </button>
                <button
                  onClick={toggleAudio}
                  disabled={isMuted}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    isAudioEnabled && !isMuted ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {isAudioEnabled && !isMuted ? '🎤' : '🎤❌'} Audio
                </button>
                {!isInstructor && isMuted && (
                  <button
                    onClick={requestUnmute}
                    className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-semibold"
                  >
                    Request Unmute
                  </button>
                )}
              </div>

              {/* Screen Share */}
              <button
                onClick={isSharingScreen ? stopScreenShare : startScreenShare}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  isSharingScreen ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isSharingScreen ? 'Stop Share' : 'Share Screen'}
              </button>

              {/* Recording (Instructor only) */}
              {isInstructor && (
                <div className="flex gap-2">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </button>
                  {recordedChunks.length > 0 && !isRecording && (
                    <button
                      onClick={downloadRecording}
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold"
                    >
                      Download
                    </button>
                  )}
                </div>
              )}

              {/* Instructor Controls */}
              {isInstructor && (
                <div className="flex gap-2">
                  <button
                    onClick={muteAll}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold"
                  >
                    Mute All
                  </button>
                  <button
                    onClick={unmuteAll}
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold"
                  >
                    Unmute All
                  </button>
                  <button
                    onClick={() => setPollModalOpen(true)}
                    className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg font-semibold"
                  >
                    Create Poll
                  </button>
                </div>
              )}

              {/* Hand Raise & Reactions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={raisedHands.some(h => h.userId === userId) ? lowerHand : raiseHand}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    raisedHands.some(h => h.userId === userId) 
                      ? 'bg-yellow-500 hover:bg-yellow-600' 
                      : 'bg-gray-500 hover:bg-gray-600'
                  }`}
                >
                  ✋ {raisedHands.some(h => h.userId === userId) ? 'Lower' : 'Raise'}
                </button>
                {REACTIONS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => sendReaction(emoji)}
                    className="text-2xl hover:scale-110 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

             

              {/* Whiteboard Toggle */}
              <button
              onClick={() => setWhiteboardOpen(v => !v)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                whiteboardOpen ? 'bg-cyan-700' : 'bg-cyan-500 hover:bg-cyan-600'
              }`}
            >
              {whiteboardOpen ? 'Close Whiteboard' : 'Open Whiteboard'}
            </button>
          </div>

          {/* Whiteboard */}
          {whiteboardOpen && (
            <div className="my-4 flex flex-col items-center">
              <div className="flex gap-2 mb-2">
                {COLORS.map(c => (
                  <button
                    key={c}
                    className="w-6 h-6 rounded-full border-2"
                    style={{ background: c, borderColor: drawColor === c ? '#fff' : '#333' }}
                    onClick={() => setDrawColor(c)}
                  />
                ))}
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={drawSize}
                  onChange={e => setDrawSize(Number(e.target.value))}
                  className="ml-2"
                />
                <button
                  className="ml-2 bg-red-500 px-2 py-1 rounded"
                  onClick={clearWhiteboard}
                >
                  Clear
                </button>
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

          {/* Video Grid */}
          <div className="flex flex-wrap gap-6 justify-center items-center w-full mb-4">
            {/* Local video */}
            <div className="flex flex-col items-center">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="rounded-lg border border-cyan-400 w-64 h-48 bg-black"
              />
              <div className="text-cyan-200 mt-2">You</div>
            </div>
            {/* Remote videos */}
            {Object.entries(remoteStreams).map(([id, stream]) => (
              <div key={id} className="flex flex-col items-center">
                <video
                  ref={el => {
                    remoteVideoRefs.current[id] = el;
                    if (el && stream && el.srcObject !== stream) {
                      el.srcObject = stream;
                      el.play().catch(e => {
                        if (e.name !== 'AbortError') console.log('Remote video play error:', e);
                      });
                    }
                  }}
                  autoPlay
                  playsInline
                  className="rounded-lg border border-cyan-400 w-64 h-48 bg-black"
                />
                <div className="text-cyan-200 mt-2">Participant {id.slice(-4)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 rounded-2xl flex flex-col p-4 ml-0 md:ml-6">
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
              onChange={e => setChatInput(e.target.value)}
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

      {/* Poll Modal */}
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

      {/* Poll Results */}
      {pollResults && (
        <div className="bg-cyan-900/60 border border-cyan-400/30 rounded-xl p-4 my-4 w-full max-w-md mx-auto">
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
  </div>
);
}