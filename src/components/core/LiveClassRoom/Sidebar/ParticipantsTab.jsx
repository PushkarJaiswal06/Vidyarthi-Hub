import React from "react";

const DEFAULT_AVATAR = "https://api.dicebear.com/5.x/initials/svg?seed=User";

const ParticipantsTab = ({ participants, userId, isInstructor, onMuteUser, onUnmuteUser, onLowerHand }) => (
  <div className="p-4">
    <div className="font-bold mb-2">Participants</div>
    <ul className="space-y-2">
      {participants.length === 0 ? (
        <li className="text-gray-400 text-center">No participants yet.</li>
      ) : (
        participants.map((p) => (
          <li key={p.userId} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
            <div className="flex items-center gap-3">
              <img
                src={p.image || DEFAULT_AVATAR}
                alt={p.userName || p.userId}
                className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400 bg-white"
                onError={e => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }}
              />
              <div>
                <span className="font-semibold text-gray-800">{p.userName || p.userId}</span>
                {p.handRaised && <span className="ml-2 text-yellow-500" title="Hand Raised">✋</span>}
                {p.isMuted && <span className="ml-2 text-red-500" title="Muted">🔇</span>}
                {p.userId === userId && <span className="ml-2 text-blue-500">(You)</span>}
                {p.isInstructor && <span className="ml-2 text-green-600 font-semibold">[Instructor]</span>}
              </div>
            </div>
            {isInstructor && (p.userId !== userId) && (
              <div className="flex gap-2">
                {p.isMuted ? (
                  <button className="text-green-600 hover:underline" onClick={() => onUnmuteUser(p.userId)}>Unmute</button>
                ) : (
                  <button className="text-red-600 hover:underline" onClick={() => onMuteUser(p.userId)}>Mute</button>
                )}
                {p.handRaised && (
                  <button className="text-yellow-600 hover:underline" onClick={() => onLowerHand(p.userId)}>Lower Hand</button>
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