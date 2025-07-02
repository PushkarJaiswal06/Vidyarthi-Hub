import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, Play } from 'lucide-react';
import { useSelector } from 'react-redux';

const CourseCard = ({ course }) => {
  // Always call hooks at the top
  const enrolledCourses = useSelector(state => state.profile.enrolledCourses || []);

  if (!course) return null;

  const {
    _id,
    courseName,
    courseDescription,
    thumbnail,
    instructor,
    price,
    ratingAndReviews = [],
    studentsEnrolled = [],
    tag = [],
    category
  } = course;

  const isEnrolled = enrolledCourses.some(c => c._id === _id);

  // Calculate average rating
  const averageRating = ratingAndReviews.length > 0 
    ? (ratingAndReviews.reduce((sum, review) => sum + review.rating, 0) / ratingAndReviews.length).toFixed(1)
    : 0;

  // Get instructor name
  const instructorName = instructor?.firstName && instructor?.lastName 
    ? `${instructor.firstName} ${instructor.lastName}`
    : instructor?.firstName || 'Unknown Instructor';

  // Get category name
  const categoryName = category?.name || 'General';

  // Format price
  const formattedPrice = price ? `₹${price}` : 'Free';

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    hover: {
      y: -10,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
      className="group relative"
    >
      <Link to={`/courses/${_id}`}>
        <div className="glass rounded-2xl overflow-hidden hover:shadow-neon transition-all duration-300 border border-white/10 hover:border-white/20">
          {/* Course Thumbnail */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={thumbnail}
              alt={courseName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
            </div>

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-purple-500/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                {categoryName}
              </span>
            </div>

            {/* Price Badge */}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-yellow-500/90 backdrop-blur-sm text-richblack-900 text-sm font-bold rounded-full">
                {formattedPrice}
              </span>
            </div>
          </div>

          {/* Course Content */}
          <div className="p-6">
            {/* Course Title */}
            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors">
              {courseName}
            </h3>

            {/* Course Description */}
            <p className="text-white/70 text-sm mb-4 line-clamp-2">
              {courseDescription}
            </p>

            {/* Instructor */}
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xs font-bold">
                  {instructorName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-white/80 text-sm">{instructorName}</span>
            </div>

            {/* Course Stats */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white/80 text-sm">{averageRating}</span>
                </div>

                {/* Students */}
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-white/80 text-sm">{studentsEnrolled.length}</span>
                </div>
              </div>

              {/* Reviews Count */}
              <span className="text-white/60 text-xs">
                ({ratingAndReviews.length} reviews)
              </span>
            </div>

            {/* Tags */}
            {tag.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tag.slice(0, 3).map((tagItem, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full"
                  >
                    {tagItem}
                  </span>
                ))}
                {tag.length > 3 && (
                  <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                    +{tag.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Progress Bar (if enrolled) */}
            {studentsEnrolled.length > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>Progress</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            )}

            {/* Enroll/Go to Course Button */}
            <div className="flex items-center justify-between">
              {isEnrolled ? (
                <Link to={`/view-course/${_id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-green-500 to-cyan-500 text-white px-6 py-2 rounded-full font-semibold text-sm hover:shadow-neon transition-all duration-300 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Go to Course
                  </motion.button>
                </Link>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full font-semibold text-sm hover:shadow-neon transition-all duration-300 flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Enroll Now
                </motion.button>
              )}

              <div className="text-right">
                <div className="text-2xl font-bold text-white">{formattedPrice}</div>
                {price > 0 && (
                  <div className="text-white/60 text-xs line-through">₹{price * 1.5}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
