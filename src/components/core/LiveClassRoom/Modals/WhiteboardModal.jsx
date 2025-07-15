import React, { useRef, useEffect } from "react";

const COLORS = ["#fff", "#f87171", "#34d399", "#60a5fa", "#fbbf24", "#a78bfa"];

const WhiteboardModal = ({ onClose, whiteboardData, onDraw, onClear, drawColor, setDrawColor, drawSize, setDrawSize, drawing, setDrawing }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    whiteboardData.forEach(({ x0, y0, x1, y1, color, size }) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    });
  }, [whiteboardData]);

  const handleMouseDown = (e) => {
    setDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onDraw({ type: "start", x, y });
  };
  const handleMouseMove = (e) => {
    if (!drawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onDraw({ type: "move", x, y });
  };
  const handleMouseUp = () => setDrawing(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose} aria-label="Close">✖️</button>
        <div className="font-bold mb-2">Whiteboard</div>
        <div className="flex gap-2 mb-2">
          {COLORS.map((c) => (
            <button key={c} className="w-6 h-6 rounded-full border-2" style={{ background: c, borderColor: drawColor === c ? '#333' : '#fff' }} onClick={() => setDrawColor(c)} />
          ))}
          <input type="range" min="2" max="10" value={drawSize} onChange={e => setDrawSize(Number(e.target.value))} className="ml-2" />
          <button className="ml-2 bg-red-500 px-2 py-1 rounded text-white" onClick={onClear}>Clear</button>
        </div>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="bg-black rounded-xl border border-blue-400 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    </div>
  );
};

export default WhiteboardModal; 