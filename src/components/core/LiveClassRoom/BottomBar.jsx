import React from "react";

const ControlButton = ({ icon, label, onClick, active, disabled, className = "" }) => (
  <button
    className={`flex flex-col items-center justify-center px-4 py-2 md:px-3 md:py-2 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${active ? "bg-blue-100" : ""} ${className}`}
    onClick={onClick}
    aria-label={label}
    title={label}
    disabled={disabled}
    type="button"
  >
    <span className="text-2xl sm:text-xl md:text-2xl">{icon}</span>
    <span className="text-xs sm:text-[10px] md:text-xs mt-1 md:mt-1">{label}</span>
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
  // Responsive layout: stack/wrap on mobile, row on desktop
  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center items-center bg-white shadow-lg py-2 md:py-3 z-50">
      <div
        className="flex flex-nowrap overflow-x-auto whitespace-nowrap md:overflow-x-visible md:whitespace-normal gap-x-2 md:gap-4 w-full max-w-4xl justify-between md:justify-center px-2 md:px-0 scrollbar-thin scrollbar-thumb-gray-300"
      >
        <ControlButton icon={isMuted ? "\ud83d\udd07" : "\ud83c\udfa4"} label={isMuted ? "Unmute" : "Mute"} onClick={onMute} active={isMuted} className="flex-1 min-w-[70px] sm:min-w-[90px]" />
        {/* Hide camera for students */}
        {isInstructor && (
          <ControlButton icon={isCameraOn ? "\ud83d\udcf7" : "\ud83d\udeab"} label={isCameraOn ? "Camera Off" : "Camera On"} onClick={onCamera} active={!isCameraOn} className="flex-1 min-w-[70px] sm:min-w-[90px]" />
        )}
        {/* Hide screen share for students */}
        {isInstructor && (
          <ControlButton icon={isScreenSharing ? "\ud83d\udda5\ufe0f" : "\ud83d\udcfa"} label={isScreenSharing ? "Stop Share" : "Share Screen"} onClick={onScreenShare} active={isScreenSharing} className="flex-1 min-w-[70px] sm:min-w-[90px]" />
        )}
        <ControlButton icon={isHandRaised ? "\u270b" : "\ud83e\udd1a"} label={isHandRaised ? "Lower Hand" : "Raise Hand"} onClick={onRaiseHand} active={isHandRaised} className="flex-1 min-w-[70px] sm:min-w-[90px]" />
        <ControlButton icon={"\ud83d\ude0a"} label="Reactions" onClick={onOpenReactions} className="flex-1 min-w-[70px] sm:min-w-[90px]" />
        <ControlButton icon={"\ud83d\udcdd"} label="Whiteboard" onClick={onOpenWhiteboard} className="flex-1 min-w-[70px] sm:min-w-[90px]" />
        {/* Polls: for students, clicking should redirect to Polls tab */}
        <ControlButton icon={"\ud83d\udcca"} label="Polls" onClick={onOpenPolls} className="flex-1 min-w-[70px] sm:min-w-[90px]" />
        {/* Hide recording for students */}
        {isInstructor && (
          <ControlButton icon={recording ? "\u23f9\ufe0f" : "\u23fa\ufe0f"} label={recording ? "Stop Recording" : "Record"} onClick={onToggleRecording} active={recording} className="flex-1 min-w-[70px] sm:min-w-[90px]" />
        )}
        {isInstructor && hasRecording && !recording && (
          <ControlButton icon={"\u2b07\ufe0f"} label="Download" onClick={onDownloadRecording} className="flex-1 min-w-[70px] sm:min-w-[90px]" />
        )}
        <ControlButton icon={"\ud83d\udeaa"} label="Leave" onClick={onLeave} className="flex-1 min-w-[70px] sm:min-w-[90px]" />
      </div>
    </div>
  );
};

export default BottomBar; 