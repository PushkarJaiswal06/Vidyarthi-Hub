import React, { useEffect, useRef, useState } from "react";

const ChatTab = ({ chatMessages, onSendMessage, userId }) => {
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="font-bold mb-2">Live Chat</div>
      <div className="flex-1 h-64 overflow-y-auto bg-gray-50 rounded p-2 mb-2">
        {chatMessages.length === 0 ? (
          <div className="text-gray-400 text-center">No messages yet.</div>
        ) : (
          chatMessages.map((msg, idx) => (
            <div key={idx} className={`mb-2 ${msg.userId === userId ? "text-right" : "text-left"}`}>
              <span className="font-semibold text-blue-700">{msg.userName || msg.userId}</span>
              <span className="text-xs text-gray-400 ml-2">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              <div className="inline-block bg-blue-100 rounded-lg px-3 py-1 mt-1 text-gray-800 text-sm max-w-[90%] break-words">
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2 mt-2">
        <input
          type="text"
          className="flex-1 rounded-lg px-3 py-2 bg-white border text-sm focus:outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
          disabled={!input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatTab; 