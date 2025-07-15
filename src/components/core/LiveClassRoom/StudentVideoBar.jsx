import React, { useEffect, useRef } from "react";

const StudentVideoTile = ({ participant, stream }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return (
    <div className="relative flex flex-col items-center bg-white rounded-lg shadow p-2 m-2 w-32 h-40">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded w-full h-24 object-cover border"
        muted={participant.isSelf}
        aria-label={`Student video: ${participant.name}`}
      />
      <div className="mt-2 text-xs font-semibold text-gray-700 truncate w-full text-center">
        {participant.name}
      </div>
      <div className="absolute top-2 right-2 flex gap-1">
        {participant.isMuted && <span title="Muted">🔇</span>}
        {participant.handRaised && <span title="Hand Raised">✋</span>}
      </div>
    </div>
  );
};

const StudentVideoBar = ({ participants }) => {
  return (
    <div className="flex md:flex-col flex-row md:w-56 w-full md:h-full h-40 overflow-x-auto md:overflow-y-auto bg-gray-50 border-l md:border-t-0 border-t md:border-l">
      {participants.filter(p => !p.isInstructor).map((participant) => (
        <StudentVideoTile key={participant.id} participant={participant} stream={participant.stream} />
      ))}
    </div>
  );
};

export default StudentVideoBar; 