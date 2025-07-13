import { useForm } from "react-hook-form";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import ReactDOM from "react-dom";
import IconBtn from "../../../../common/IconBtn";

export default function LiveClassModal({ courseId, setModalOpen, onScheduled }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/liveclass/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course: courseId,
          title: data.title,
          description: data.description,
          scheduledAt: data.scheduledAt,
          duration: data.duration,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Live class scheduled!");
        onScheduled && onScheduled(result.liveClass);
        setModalOpen(false);
        reset();
      } else {
        toast.error(result.message || "Failed to schedule live class");
      }
    } catch (err) {
      toast.error("Error scheduling live class");
    }
    setLoading(false);
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[1000] flex items-start justify-center bg-black/40 backdrop-blur-xl overflow-y-auto">
      <div className="rounded-2xl shadow-2xl border border-cyan-900/30 bg-gradient-to-br from-richblack-800/95 via-cyan-900/90 to-richblack-900/95 backdrop-blur-xl w-full max-w-2xl mx-auto mt-24 mb-10 pt-12 pb-10 text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-2xl px-8 py-6 border-b border-white/10 bg-white/10 backdrop-blur-xl">
          <p className="text-2xl font-bold text-white">Schedule Live Class</p>
          <button onClick={() => setModalOpen(false)} className="text-2xl text-white/80 hover:text-white/100 transition-colors">
            <RxCross2 />
          </button>
        </div>
        {/* Modal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 py-10">
          {/* Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-base font-semibold text-black/80 mb-1" htmlFor="title">
              Title <sup className="text-pink-200">*</sup>
            </label>
            <input
              id="title"
              disabled={loading}
              placeholder="Enter Live Class Title"
              {...register("title", { required: true })}
              className="glass-input w-full text-black/90 placeholder-black/60"
            />
            {errors.title && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">Title is required</span>
            )}
          </div>
          {/* Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-base font-semibold text-black/80 mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              disabled={loading}
              placeholder="Enter Description (optional)"
              {...register("description")}
              className="glass-input resize-none min-h-[80px] w-full text-black/90 placeholder-black/60"
            />
          </div>
          {/* Date/Time */}
          <div className="flex flex-col space-y-2">
            <label className="text-base font-semibold text-black/80 mb-1" htmlFor="scheduledAt">
              Scheduled Date & Time <sup className="text-pink-200">*</sup>
            </label>
            <input
              id="scheduledAt"
              type="datetime-local"
              disabled={loading}
              {...register("scheduledAt", { required: true })}
              className="glass-input w-full text-black/90 placeholder-black/60"
            />
            {errors.scheduledAt && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">Date & Time is required</span>
            )}
          </div>
          {/* Duration */}
          <div className="flex flex-col space-y-2">
            <label className="text-base font-semibold text-black/80 mb-1" htmlFor="duration">
              Duration (minutes) <sup className="text-pink-200">*</sup>
            </label>
            <input
              id="duration"
              type="number"
              min="1"
              disabled={loading}
              placeholder="Enter Duration"
              {...register("duration", { required: true, min: 1 })}
              className="glass-input w-full text-black/90 placeholder-black/60"
            />
            {errors.duration && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">Duration is required</span>
            )}
          </div>
          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <IconBtn
              disabled={loading}
              text={loading ? "Scheduling..." : "Schedule Live Class"}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-neon hover:from-blue-500 hover:to-cyan-400 transition-all"
            />
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
} 