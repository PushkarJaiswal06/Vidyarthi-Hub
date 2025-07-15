import React, { useState } from "react";

const PollsModal = ({ onClose, isInstructor, onLaunchPoll, onVote, poll, pollResults, hasVoted, setPollQuestion, setPollOptions, pollQuestion, pollOptions }) => {
  const [localOptions, setLocalOptions] = useState(pollOptions || ["", ""]);

  const handleOptionChange = (idx, value) => {
    setLocalOptions(localOptions.map((o, i) => (i === idx ? value : o)));
    setPollOptions(localOptions.map((o, i) => (i === idx ? value : o)));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose} aria-label="Close">✖️</button>
        <div className="font-bold mb-2">Polls & Quizzes</div>
        {isInstructor ? (
          <div>
            <input
              className="w-full mb-2 px-3 py-2 rounded border"
              placeholder="Question"
              value={pollQuestion}
              onChange={e => setPollQuestion(e.target.value)}
            />
            {localOptions.map((opt, idx) => (
              <input
                key={idx}
                className="w-full mb-2 px-3 py-2 rounded border"
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={e => handleOptionChange(idx, e.target.value)}
              />
            ))}
            <button
              className="text-blue-500 underline text-sm mb-2"
              onClick={() => {
                setLocalOptions([...localOptions, ""]);
                setPollOptions([...localOptions, ""]);
              }}
              disabled={localOptions.length >= 6}
            >
              + Add Option
            </button>
            <div className="flex gap-2 mt-4">
              <button className="bg-blue-500 px-4 py-2 rounded text-white" onClick={() => onLaunchPoll(pollQuestion, localOptions)}>Launch</button>
              <button className="bg-gray-500 px-4 py-2 rounded text-white" onClick={onClose}>Cancel</button>
            </div>
          </div>
        ) : poll ? (
          <div>
            <div className="font-bold mb-2">{poll.question}</div>
            <div className="space-y-2">
              {poll.options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`w-full px-4 py-2 rounded ${hasVoted ? 'bg-blue-200' : 'bg-blue-500 hover:bg-blue-600'} text-gray-900 font-semibold`}
                  onClick={() => onVote(idx)}
                  disabled={hasVoted}
                >
                  {opt} {poll.votes && hasVoted ? `(${poll.votes[idx]} votes)` : ""}
                </button>
              ))}
            </div>
          </div>
        ) : pollResults ? (
          <div>
            <div className="font-bold mb-2">Poll Results</div>
            <div className="mb-2">{pollResults.question}</div>
            <ul>
              {pollResults.options.map((opt, idx) => (
                <li key={idx}>{opt}: <b>{pollResults.votes[idx]}</b> votes</li>
              ))}
            </ul>
            <button className="mt-2 bg-gray-500 px-4 py-2 rounded text-white" onClick={onClose}>Close</button>
          </div>
        ) : (
          <div className="text-gray-400 text-center">No active poll.</div>
        )}
      </div>
    </div>
  );
};

export default PollsModal; 