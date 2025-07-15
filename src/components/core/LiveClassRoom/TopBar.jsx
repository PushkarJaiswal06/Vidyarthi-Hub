import React, { useEffect, useState } from "react";

const TopBar = ({ classInfo, participants }) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    // Start timer when component mounts
    const startTime = Date.now();
    const interval = setInterval(() => {
      setTimer(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white shadow-md border-b">
      <div className="text-xl font-bold text-gray-800 mt-4">{classInfo.title || "Live Class"}</div>
      <div className="flex items-center gap-6">
        <div className="text-gray-600">⏰ {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}</div>
        <div className="text-gray-600">👥 {participants.length} participants</div>
      </div>
    </div>
  );
};

export default TopBar; 