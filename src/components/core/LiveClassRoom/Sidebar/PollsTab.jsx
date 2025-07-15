import React from "react";

const PollsTab = ({ poll, pollResults, hasVoted, onVote, isInstructor }) => (
  <div className="p-4">
    <div className="font-bold mb-2">Polls & Quizzes</div>
    {poll ? (
      <div>
        <div className="mb-2 font-semibold">{poll.question}</div>
        <div className="space-y-2">
          {poll.options.map((opt, idx) => (
            <button
              key={idx}
              className={`w-full px-3 py-2 rounded ${hasVoted || isInstructor ? 'bg-blue-200' : 'bg-blue-500 hover:bg-blue-600'} text-gray-900 font-semibold flex justify-between items-center`}
              onClick={() => !isInstructor && onVote(idx)}
              disabled={hasVoted || isInstructor}
            >
              <span>{opt}</span>
              {poll.votes && (
                <span className="ml-2 text-xs text-gray-700">{poll.votes[idx]} votes</span>
              )}
            </button>
          ))}
        </div>
      </div>
    ) : pollResults ? (
      <div>
        <div className="mb-2 font-semibold">Poll Results</div>
        <div className="mb-2">{pollResults.question}</div>
        <ul>
          {pollResults.options.map((opt, idx) => (
            <li key={idx}>{opt}: <b>{pollResults.votes[idx]}</b> votes</li>
          ))}
        </ul>
      </div>
    ) : (
      <div className="text-gray-400 text-center">No active poll.</div>
    )}
  </div>
);

export default PollsTab; 