import React from "react";

// Importing React Icons
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";
import { FaUser, FaRupeeSign } from "react-icons/fa";

const CourseCard = ({cardData, currentCard, setCurrentCard}) => {
  // Function to truncate description to max 15 words
  const truncateDescription = (description) => {
    if (!description) return "";
    const words = description.split(' ');
    if (words.length <= 15) return description;
    return words.slice(0, 15).join(' ') + '...';
  };

  return (
    <div
      className={`w-[360px] lg:w-[30%] h-[300px] box-border cursor-pointer relative overflow-hidden ${
        currentCard === cardData?.heading
          ? "ring-2 ring-yellow-50 ring-offset-2 ring-offset-richblack-800"
          : ""
      }`}
      onClick={() => setCurrentCard(cardData?.heading)}
    >
      {/* Background Image */}
      {cardData?.thumbnail && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${cardData.thumbnail})` }}
        />
      )}
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      
      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="border-b-[2px] border-white border-opacity-30 border-dashed h-[70%] p-6 flex flex-col gap-3">
          <div className="font-semibold text-[20px] line-clamp-2 text-white">
            {cardData?.heading}
          </div>

          <div className="text-white text-sm line-clamp-3 opacity-90">
            {truncateDescription(cardData?.description)}
          </div>
        </div>

        <div className="flex justify-between items-center text-white px-6 py-3 font-medium text-sm">
          {/* Instructor */}
          <div className="flex items-center gap-2">
            <FaUser className="text-xs" />
            <p className="truncate max-w-[120px]">
              {cardData?.instructor?.firstName} {cardData?.instructor?.lastName}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-center gap-1">
            <FaRupeeSign className="text-xs" />
            <p>{cardData?.price || 0}</p>
          </div>
        </div>

        {/* Bottom section with level and lessons */}
        <div className="flex justify-between text-white px-6 py-2 font-medium text-xs border-t border-white border-opacity-30">
          {/* Level */}
          <div className="flex items-center gap-2">
            <HiUsers />
            <p>{cardData?.level}</p>
          </div>

          {/* Flow Chart */}
          <div className="flex items-center gap-2">
            <ImTree />
            <p>{cardData?.lessionNumber} Lessons</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;