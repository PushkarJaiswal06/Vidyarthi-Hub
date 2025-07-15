import React from "react";

const ControlButton = ({ icon, label, onClick, active, disabled }) => (
  <button
    className={`flex flex-col items-center justify-center px-3 py-2 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${active ? "bg-blue-100" : ""}`}
    onClick={onClick}
    aria-label={label}
    title={label}
    disabled={disabled}
    type="button"
  >
    <span className="text-2xl">{icon}</span>
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const BottomBar = ({
  recording,
  onToggleRecording,
  onDownloadRecording,
  onOpenWhiteboard,
  onOpenPolls,
  onOpenReactions,
  onMute,
  onCamera,
  onScreenShare,
  onRaiseHand,
  onLeave,
  isMuted,
  isCameraOn,
  isScreenSharing,
  isHandRaised,
  isInstructor,
  hasRecording
}) => {
  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center items-center bg-white shadow-lg py-3 z-50">
      <div className="flex gap-4">
        <ControlButton icon={isMuted ? "🔇" : "🎤"} label={isMuted ? "Unmute" : "Mute"} onClick={onMute} active={isMuted} />
        <ControlButton icon={isCameraOn ? "📷" : "🚫"} label={isCameraOn ? "Camera Off" : "Camera On"} onClick={onCamera} active={!isCameraOn} />
        {isInstructor && (
          <ControlButton icon={isScreenSharing ? "🖥️" : "📺"} label={isScreenSharing ? "Stop Share" : "Share Screen"} onClick={onScreenShare} active={isScreenSharing} />
        )}
        <ControlButton icon={isHandRaised ? "✋" : "🤚"} label={isHandRaised ? "Lower Hand" : "Raise Hand"} onClick={onRaiseHand} active={isHandRaised} />
        <ControlButton icon={"😊"} label="Reactions" onClick={onOpenReactions} />
        <ControlButton icon={"📝"} label="Whiteboard" onClick={onOpenWhiteboard} />
        <ControlButton icon={"📊"} label="Polls" onClick={onOpenPolls} />
        {isInstructor && (
          <ControlButton icon={recording ? "⏹️" : "⏺️"} label={recording ? "Stop Recording" : "Record"} onClick={onToggleRecording} active={recording} />
        )}
        {isInstructor && hasRecording && !recording && (
          <ControlButton icon={"⬇️"} label="Download" onClick={onDownloadRecording} />
        )}
        <ControlButton icon={"🚪"} label="Leave" onClick={onLeave} />
      </div>
    </div>
  );
};

export default BottomBar; 