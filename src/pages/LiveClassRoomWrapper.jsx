import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import LiveClassRoom from "../components/core/LiveClassRoom/LiveClassRoom";

export default function LiveClassRoomWrapper() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();
  const [liveClass, setLiveClass] = useState(location.state?.liveClass || null);
  const [loading, setLoading] = useState(!user || !liveClass);

  useEffect(() => {
    if (!user) return;
    if (!liveClass) {
      setLoading(true);
      const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000/api/v1";
      fetch(`${BASE_URL}/liveclass/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setLiveClass(data.liveClass);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, user, liveClass]);

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-cyan-300 text-xl font-semibold animate-pulse">Loading Live Class...</div>
      </div>
    );
  }

  return (
    <LiveClassRoom classId={id} />
  );
} 