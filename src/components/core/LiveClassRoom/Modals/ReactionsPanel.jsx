import React from "react";

const REACTIONS = ["👍", "👏", "😂", "😮", "❤️"];

const ReactionsPanel = ({ onClose, onSendReaction }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
      <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose} aria-label="Close">✖️</button>
      <div className="font-bold mb-2">Reactions</div>
      <div className="flex gap-4 justify-center mt-4">
        {REACTIONS.map((emoji) => (
          <button
            key={emoji}
            className="text-3xl hover:scale-125 transition-transform"
            onClick={() => onSendReaction(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default ReactionsPanel; 