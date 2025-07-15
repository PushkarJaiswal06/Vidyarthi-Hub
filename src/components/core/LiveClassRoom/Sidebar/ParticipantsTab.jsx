import React from "react";

const ParticipantsTab = ({ participants, userId, isInstructor, onMuteUser, onUnmuteUser, onLowerHand }) => (
  <div className="p-4">
    <div className="font-bold mb-2">Participants</div>
    <ul className="space-y-2">
      {participants.length === 0 ? (
        <li className="text-gray-400 text-center">No participants yet.</li>
      ) : (
        participants.map((p) => (
          <li key={p._id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
            <div>
              <span className="font-semibold text-gray-800">{p.name || p.userName || p._id}</span>
              {p.handRaised && <span className="ml-2 text-yellow-500" title="Hand Raised">✋</span>}
              {p.isMuted && <span className="ml-2 text-red-500" title="Muted">🔇</span>}
              {p._id === userId && <span className="ml-2 text-blue-500">(You)</span>}
            </div>
            {isInstructor && p._id !== userId && (
              <div className="flex gap-2">
                {p.isMuted ? (
                  <button className="text-green-600 hover:underline" onClick={() => onUnmuteUser(p._id)}>Unmute</button>
                ) : (
                  <button className="text-red-600 hover:underline" onClick={() => onMuteUser(p._id)}>Mute</button>
                )}
                {p.handRaised && (
                  <button className="text-yellow-600 hover:underline" onClick={() => onLowerHand(p._id)}>Lower Hand</button>
                )}
              </div>
            )}
          </li>
        ))
      )}
    </ul>
  </div>
);

export default ParticipantsTab; 