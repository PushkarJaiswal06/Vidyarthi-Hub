import React, { useRef, useEffect, useCallback } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";

export default function ExcalidrawWhiteboard({ isInstructor, socket, roomId, scene }) {
  const excalidrawRef = useRef(null);
  const lastSentElements = useRef(null);

  // INSTRUCTOR ONLY: Handle drawing changes and emit to students
  const handleChange = useCallback((elements, appState, files) => {
    if (!socket || !roomId) return;
    
    // Only emit if elements actually changed (performance optimization)
    if (JSON.stringify(elements) !== JSON.stringify(lastSentElements.current)) {
      console.log('[DEBUG][Whiteboard] Instructor emitting scene update', { elementsCount: elements.length, elements });
      socket.emit("whiteboard-scene-update", { 
        roomId, 
        elements,
        timestamp: Date.now()
      });
      lastSentElements.current = elements;
    }
  }, [socket, roomId]);

  // STUDENTS ONLY: Receive and display instructor's whiteboard updates
  useEffect(() => {
    console.log('[DEBUG][Whiteboard] ExcalidrawWhiteboard mounted', { isInstructor, socket, roomId });
    if (isInstructor || !excalidrawRef.current || !scene) return;
    
    try {
      // Update the whiteboard with instructor's changes
      console.log('[DEBUG][Whiteboard] Student updating Excalidraw scene', { elementsCount: scene.length, scene });
      excalidrawRef.current.updateScene({ 
        elements: scene,
        commitToHistory: false // Don't add to undo/redo stack
      });
    } catch (error) {
      console.error("Failed to update whiteboard:", error);
    }
  }, [scene, isInstructor]);

  // Render instructor's interactive whiteboard or student's view-only whiteboard
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Excalidraw
        ref={excalidrawRef}
        onChange={handleChange} // TEMP: always set for debug
        viewModeEnabled={!isInstructor} // Students can only view
        initialData={{
          appState: {
            viewBackgroundColor: "#ffffff",
            zenModeEnabled: false,
          }
        }}
        UIOptions={{
          canvasActions: {
            saveFileToDisk: isInstructor ? {} : false,
            loadScene: isInstructor ? {} : false,
            export: isInstructor ? {} : false,
            toggleTheme: true,
          },
          tools: {
            image: isInstructor ? {} : false,
            text: isInstructor ? {} : false,
          }
        }}
      />
      
      {/* Optional: Show connection status */}
      {!isInstructor && (
        <div style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: socket?.connected ? "#4CAF50" : "#f44336",
          color: "white",
          padding: "5px 10px",
          borderRadius: "4px",
          fontSize: "12px"
        }}>
          {socket?.connected ? "Connected" : "Disconnected"}
        </div>
      )}
    </div>
  );
}