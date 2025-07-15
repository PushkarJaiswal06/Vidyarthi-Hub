import React, { useState } from "react";
import ChatTab from "./ChatTab";
import ParticipantsTab from "./ParticipantsTab";
import WhiteboardTab from "./WhiteboardTab";
import PollsTab from "./PollsTab";

const tabs = [
  { name: "Chat", component: ChatTab },
  { name: "Participants", component: ParticipantsTab },
  { name: "Whiteboard", component: WhiteboardTab },
  { name: "Polls", component: PollsTab },
];

const Sidebar = ({
  chatMessages,
  participants,
  onOpenWhiteboard,
  onOpenPolls,
  onSendMessage,
  userId,
  isInstructor,
  onMuteUser,
  onUnmuteUser,
  onLowerHand,
  poll,
  pollResults,
  hasVoted,
  onVote
}) => {
  const [activeTab, setActiveTab] = useState("Chat");
  let ActiveComponent = tabs.find(t => t.name === activeTab)?.component || ChatTab;

  // Render the correct tab with all required props
  let tabProps = {};
  if (ActiveComponent === ChatTab) {
    tabProps = { chatMessages, onSendMessage, userId };
  } else if (ActiveComponent === ParticipantsTab) {
    tabProps = { participants, userId, isInstructor, onMuteUser, onUnmuteUser, onLowerHand };
  } else if (ActiveComponent === WhiteboardTab) {
    tabProps = { onOpenWhiteboard };
  } else if (ActiveComponent === PollsTab) {
    tabProps = { onOpenPolls, poll, pollResults, hasVoted, onVote, isInstructor };
  }

  return (
    <div className="w-80 bg-white border-l flex flex-col h-full shadow-lg">
      <div className="flex border-b">
        {tabs.map(tab => (
          <button
            key={tab.name}
            className={`flex-1 py-2 text-center font-semibold ${activeTab === tab.name ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}
            onClick={() => setActiveTab(tab.name)}
            aria-label={tab.name}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        <ActiveComponent {...tabProps} />
      </div>
    </div>
  );
};

export default Sidebar; 