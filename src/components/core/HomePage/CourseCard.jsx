import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaUsers, FaClock, FaPlay } from "react-icons/fa";

const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  // Handle the cardData structure from ExploreMore component
  const {
    heading,
    description,
    level,
    lessionNumber,
    courseId,
    thumbnail,
    price,
    instructor
  } = cardData || {};

  // Function to truncate description to max 15 words
  const truncateDescription = (description) => {
    if (!description) return "";
    const words = description.split(" ");
    if (words.length <= 15) return description;
    return words.slice(0, 15).join(" ") + "...";
  };

  return (
    <div className="relative group">
      <div 
        className={`card-modern h-full overflow-hidden transform transition-all duration-500 hover:scale-105 cursor-pointer ${
          currentCard === heading ? "ring-2 ring-primary-500 shadow-glow" : ""
        }`}
        onClick={() => setCurrentCard(heading)}
      >
        {/* Course Thumbnail */}
        <div className="relative overflow-hidden">
          <img
            src={thumbnail || "https://via.placeholder.com/300x200?text=Course+Image"}
            alt={heading}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full">
                <FaPlay className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Price Badge */}
          <div className="absolute top-4 right-4">
            <div className="badge-modern">
              ₹{price || "Free"}
            </div>
          </div>

          {/* Level Badge */}
          <div className="absolute top-4 left-4">
            <div className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg">
              <span className="text-xs font-semibold text-neutral-800">
                {level}
              </span>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="p-6">
          {/* Course Title */}
          <h3 className="text-xl font-bold text-neutral-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {heading}
          </h3>

          {/* Course Description */}
          <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
            {truncateDescription(description)}
          </p>

          {/* Instructor */}
          {instructor && (
            <div className="flex items-center space-x-3 mb-4">
              <div className="avatar-modern w-8 h-8 text-sm">
                {instructor?.firstName?.charAt(0) || "I"}
              </div>
              <div>
                <div className="text-sm font-medium text-neutral-900">
                  {instructor?.firstName} {instructor?.lastName}
                </div>
                <div className="text-xs text-neutral-500">Instructor</div>
              </div>
            </div>
          )}

          {/* Course Stats */}
          <div className="flex items-center justify-between text-sm text-neutral-500">
            <div className="flex items-center space-x-1">
              <FaClock className="w-4 h-4" />
              <span>{lessionNumber || 0} lessons</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaUsers className="w-4 h-4" />
              <span>All Levels</span>
            </div>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 border-2 border-transparent rounded-2xl group-hover:border-primary-500/20 transition-all duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default CourseCard;