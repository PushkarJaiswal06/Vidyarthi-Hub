import React, { useEffect, useRef } from "react";

const InstructorVideo = ({ instructor, stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className="relative flex items-center justify-center w-full h-full rounded-xl border-4 border-blue-500 bg-black shadow-lg"
      style={{ maxWidth: '100vw', maxHeight: '30vh' }}
    >
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow z-10">
        Instructor: {instructor?.name || "Unknown"}
      </div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ maxWidth: '100%', maxHeight: '100%' }}
        className="object-contain"
        aria-label="Instructor video"
      />
    </div>
  );
};

export default InstructorVideo; 