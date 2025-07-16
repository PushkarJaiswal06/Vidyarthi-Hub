import React, { useRef, useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";

export default function ExcalidrawWhiteboard({ isInstructor, socket, roomId, scene }) {
  const excalidrawRef = useRef(null);
  const lastSentElements = useRef(null);

  // Instructor: emit scene changes only if changed
  const handleChange = (elements, appState, files) => {
    if (isInstructor && socket && roomId) {
      // Only emit if elements actually changed
      if (JSON.stringify(elements) !== JSON.stringify(lastSentElements.current)) {
        socket.emit("whiteboard-scene-update", { roomId, elements });
        lastSentElements.current = elements;
      }
    }
  };

  // Student: update scene when new scene is received
  useEffect(() => {
    if (!isInstructor && excalidrawRef.current && scene) {
      // Only update if scene differs
      const currentElements = excalidrawRef.current.getSceneElements ? excalidrawRef.current.getSceneElements() : [];
      if (JSON.stringify(scene) !== JSON.stringify(currentElements)) {
        excalidrawRef.current.updateScene({ elements: scene });
      }
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