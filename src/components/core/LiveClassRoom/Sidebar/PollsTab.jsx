import React from "react";

const PollsTab = ({ pollHistory = [], activePoll, pollResults, hasVoted, onVote, isInstructor }) => {
  // Only show ended polls in history, and avoid duplicates by question
  const endedPolls = pollHistory.filter(
    (poll) => !activePoll || poll.question !== activePoll.question
  );
  const uniquePolls = [];
  const seenQuestions = new Set();
  for (const poll of endedPolls) {
    if (!seenQuestions.has(poll.question)) {
      uniquePolls.push(poll);
      seenQuestions.add(poll.question);
    }
  }

  return (
    <div className="p-4">
      <div className="font-bold mb-2">Polls & Quizzes</div>
      {activePoll ? (
        <div className="mb-6">
          <div className="mb-2 font-semibold">{activePoll.question}</div>
          <div className="space-y-2">
            {activePoll.options.map((opt, idx) => (
              <button
                key={idx}
                className={`w-full px-3 py-2 rounded ${hasVoted || isInstructor ? 'bg-blue-200' : 'bg-blue-500 hover:bg-blue-600'} text-gray-900 font-semibold flex justify-between items-center`}
                onClick={() => !isInstructor && onVote(idx)}
                disabled={hasVoted || isInstructor}
              >
                <span>{opt}</span>
                {activePoll.votes && (
                  <span className="ml-2 text-xs text-gray-700">{activePoll.votes[idx]} votes</span>
                )}
              </button>
            ))}
          </div>
          {hasVoted && <div className="mt-2 text-green-600 font-semibold">Thank you for voting!</div>}
        </div>
      ) : pollResults ? (
        <div className="mb-6">
          <div className="mb-2 font-semibold">Poll Results</div>
          <div className="mb-2">{pollResults.question}</div>
          <ul>
            {pollResults.options.map((opt, idx) => (
              <li key={idx}>{opt}: <b>{pollResults.votes[idx]}</b> votes</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="font-bold mb-2">Poll History</div>
      {uniquePolls.length === 0 ? (
        <div className="text-gray-400 text-center">No polls have been created yet.</div>
      ) : (
        <ul className="space-y-4">
          {uniquePolls.slice().reverse().map((poll, idx) => (
            <li key={poll.question + idx} className="bg-gray-50 rounded p-3 shadow">
              <div className="font-semibold mb-1">{poll.question}</div>
              <ul>
                {poll.options.map((opt, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{opt}</span>
                    <span className="ml-2 text-xs text-gray-700">{poll.votes ? poll.votes[i] : 0} votes</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PollsTab; 