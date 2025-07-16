import React, { useRef, useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";

export default function ExcalidrawWhiteboard({ isInstructor, socket, roomId, scene }) {
  const excalidrawRef = useRef(null);

  // Instructor: emit scene changes
  const handleChange = (elements, appState, files) => {
    if (isInstructor && socket && roomId) {
      socket.emit("whiteboard-scene-update", { roomId, elements });
    }
  };

  // Student: update scene when new scene is received
  useEffect(() => {
    if (!isInstructor && excalidrawRef.current && scene) {
      excalidrawRef.current.updateScene({ elements: scene });
    }
  }, [scene, isInstructor]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Excalidraw
        ref={excalidrawRef}
        onChange={isInstructor ? handleChange : undefined}
        viewModeEnabled={!isInstructor}
      />
    </div>
  );
} 