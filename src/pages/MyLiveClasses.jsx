import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

function categorizeLiveClasses(liveClasses) {
  const now = new Date();
  const today = [];
  const upcoming = [];
  const past = [];
  liveClasses.forEach(lc => {
    const scheduled = new Date(lc.scheduledAt);
    if (scheduled.toDateString() === now.toDateString()) {
      today.push(lc);
    } else if (scheduled > now) {
      upcoming.push(lc);
    } else {
      past.push(lc);
    }
  });
  return { today, upcoming, past };
}

export default function MyLiveClasses() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveClasses = async () => {
      setLoading(true);
      const BASE_URL = process.env.REACT_APP_BASE_URL;
      let url = '';
      if (user?.accountType === 'Instructor') {
        url = `${BASE_URL}/liveclass/instructor`;
      } else {
        url = `${BASE_URL}/liveclass/student`;
      }
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setLiveClasses(data.data);
      setLoading(false);
    };
    if (token && user) fetchLiveClasses();
  }, [token, user]);

  const { today, upcoming, past } = categorizeLiveClasses(liveClasses);

  const handleJoinOrStart = (lc) => {
    navigate(`/live-class-room/${lc._id}`, { state: { liveClass: lc } });
  };

  const isWithinScheduledWindow = (lc) => {
    const now = new Date();
    const start = new Date(lc.scheduledAt);
    const end = new Date(start.getTime() + (lc.duration || 0) * 60000);
    // Instructors: 10 min early, Students: 5 min early
    if (user?.accountType === 'Instructor') {
      return now >= new Date(start.getTime() - 10 * 60000) && now <= end;
    }
    // Students can join 5 min early
    return now >= new Date(start.getTime() - 5 * 60000) && now <= end;
  };

  const renderSection = (title, classes, actionLabel) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-cyan-300 mb-4">{title}</h2>
      {classes.length === 0 ? (
        <div className="text-cyan-200">No {title.toLowerCase()}.</div>
      ) : (
        <ul className="space-y-4">
          {classes.map(lc => (
            <li key={lc._id} className="bg-white/10 border border-cyan-900/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div className="font-semibold text-white text-lg">{lc.title}</div>
                <div className="text-cyan-100 text-sm mb-1">{lc.description}</div>
                <div className="text-cyan-300 text-xs mb-1">Scheduled: {new Date(lc.scheduledAt).toLocaleString()} | Duration: {lc.duration} min</div>
                <div className="text-cyan-200 text-xs">
                  Course: {lc.course?._id ? (
                    <Link to={`/view-course/${lc.course._id}`} className="underline hover:text-cyan-400">{lc.course.courseName}</Link>
                  ) : (
                    lc.courseName || lc.course?.courseName
                  )}
                </div>
              </div>
              <div>
                {actionLabel && (
                  <button
                    className={`bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-full font-semibold shadow transition-all ${user?.accountType === 'Instructor' && !isWithinScheduledWindow(lc) ? 'opacity-60 cursor-not-allowed' : ''}`}
                    onClick={() => handleJoinOrStart(lc)}
                    disabled={user?.accountType === 'Instructor' && !isWithinScheduledWindow(lc)}
                  >
                    {actionLabel}
                  </button>
                )}
                {lc.status === 'completed' && (
                  <span className="text-green-400 font-semibold">Completed</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-white mb-8">My Live Classes</h1>
      {loading ? (
        <div className="text-cyan-200">Loading...</div>
      ) : (
        <>
          {renderSection("Today's Live Classes", today, user?.accountType === 'Instructor' ? 'Start Class' : 'Join Class')}
          {renderSection("Upcoming Live Classes", upcoming, user?.accountType === 'Instructor' ? 'Start Class' : 'Join Class')}
          {renderSection("Past Live Classes", past, null)}
        </>
      )}
    </div>
  );
} 