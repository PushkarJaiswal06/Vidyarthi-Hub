import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Award, 
  Play, 
  Star, 
  ArrowRight,
  Globe,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllCourses } from '../services/operations/courseDetailsAPI';

// Components
import Hero3D from '../components/core/HomePage/Hero3D';
import AnimatedHeading from '../components/common/AnimatedHeading';
import { 
  AnimatedLines, 
  FloatingShapes, 
  AnimatedGrid, 
  AnimatedDots,
  SectionDivider 
} from '../components/common/SVGDecorations';
import CourseCard from '../components/core/Catalog/Course_Card';

// API
import { apiConnector } from '../services/apiconnector';
import { courseEndpoints } from '../services/apis';

const Home = () => {
  const dispatch = useDispatch();
  const { course: courses, loading } = useSelector((state) => state.course);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    instructors: 0,
    satisfaction: 0
  });

  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Helper to get 3 random courses
  function getRandomCourses(arr, n = 3) {
    if (!arr || arr.length <= n) return arr;
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  useEffect(() => {
    if (!loading && courses && courses.length > 0) {
      setFeaturedCourses(getRandomCourses(courses, 3));
      setFetchError(null);
      // Calculate stats from courses data
      const totalStudents = courses.reduce((sum, course) => sum + (course.studentsEnrolled?.length || 0), 0);
      const totalInstructors = new Set(courses.map(course => course.instructor?._id)).size;
      const avgRating = courses.reduce((sum, course) => {
        const ratings = course.ratingAndReviews || [];
        const avg = ratings.length > 0 ? ratings.reduce((rSum, r) => rSum + r.rating, 0) / ratings.length : 0;
        return sum + avg;
      }, 0) / courses.length;
      setStats({
        students: totalStudents,
        courses: courses.length,
        instructors: totalInstructors,
        satisfaction: Math.round(avgRating * 20)
      });
    }
    // Only show error if not loading and no courses
    else if (!loading && (!courses || courses.length === 0)) {
      setFeaturedCourses([]);
      setFetchError('No featured courses available right now.');
      setStats({ students: 0, courses: 0, instructors: 0, satisfaction: 0 });
    }
  }, [loading, courses]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-richblack-900 via-cyan-900 to-richblack-800 relative overflow-hidden">
      {/* Background Decorations */}
      <AnimatedGrid className="opacity-5" />
      <FloatingShapes />
      <AnimatedDots />
      
      {/* Hero Section */}
      <section className="relative pt-20  px-4 lg:px-8">
        <div className=" mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            {/* Left: Hero text/buttons (70%) */}
            <div className="flex-[7] text-center md:text-left mb-8 md:mb-0">
              <motion.div variants={itemVariants} className="mb-8">
                <AnimatedHeading 
                  size="2xl" 
                  strokeColor="#4facfe"
                  className="mb-6"
                >
                  Transform Your Future
                </AnimatedHeading>
                <p className="text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto md:mx-0 leading-relaxed">
                  Empowering learners worldwide with cutting-edge education technology. Transform your future with our comprehensive learning platform.
                </p>
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
                <Link to="/catalog">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-neon flex items-center gap-2 group"
                  >
                    Explore Courses
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <Link to="/about">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20 hover:border-white/40 transition-all"
                  >
                    Learn More
                  </motion.button>
                </Link>
              </motion.div>
            </div>
            {/* Right: 3D Model (30%) */}
            <div className="flex-[3] flex justify-center items-center">
              <Hero3D />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 lg:px-8">
        <SectionDivider color="#4facfe" />
        <div className=" mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <motion.div variants={itemVariants} className="text-center">
              <div className="glass rounded-2xl p-6 hover:shadow-neon transition-all duration-300">
                <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">
                  {loading ? "..." : stats.students.toLocaleString()}+
                </h3>
                <p className="text-white/70">Active Students</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-center">
              <div className="glass rounded-2xl p-6 hover:shadow-neon transition-all duration-300">
                <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">
                  {loading ? "..." : stats.courses}+
                </h3>
                <p className="text-white/70">Premium Courses</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-center">
              <div className="glass rounded-2xl p-6 hover:shadow-neon transition-all duration-300">
                <Award className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">
                  {loading ? "..." : stats.instructors}+
                </h3>
                <p className="text-white/70">Expert Instructors</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-center">
              <div className="glass rounded-2xl p-6 hover:shadow-neon transition-all duration-300">
                <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">
                  {loading ? "..." : stats.satisfaction}%
                </h3>
                <p className="text-white/70">Satisfaction Rate</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="relative py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants}>
              <AnimatedHeading 
                size="xl" 
                strokeColor="#f093fb"
                className="mb-6"
              >
                Featured Courses
              </AnimatedHeading>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Discover our most popular courses handpicked by industry experts
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="spinner" />
              </div>
            ) : !loading && featuredCourses.length === 0 ? (
              <div className="col-span-full text-white/70 text-lg text-center py-12">
                {fetchError}
              </div>
            ) : (
              featuredCourses.map((course, index) => (
                <motion.div
                  key={course._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <CourseCard course={course} />
                </motion.div>
              ))
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/catalog">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-neon-pink flex items-center gap-2 mx-auto group"
              >
                View All Courses
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 lg:px-8">
        <SectionDivider color="#f093fb" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants}>
              <AnimatedHeading 
                size="xl" 
                strokeColor="#2A9D8F"
                className="mb-6"
              >
                Why Choose VidyarthiHub?
              </AnimatedHeading>
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="glass rounded-2xl p-8 hover:shadow-neon transition-all duration-300">
              <Globe className="w-12 h-12 text-blue-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Global Learning</h3>
              <p className="text-white/70 leading-relaxed">
                Access world-class education from anywhere in the world with our comprehensive online platform.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass rounded-2xl p-8 hover:shadow-neon transition-all duration-300">
              <Zap className="w-12 h-12 text-yellow-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Interactive Experience</h3>
              <p className="text-white/70 leading-relaxed">
                Engage with 3D learning environments and interactive content that makes learning fun and effective.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass rounded-2xl p-8 hover:shadow-neon transition-all duration-300">
              <Target className="w-12 h-12 text-pink-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Personalized Learning</h3>
              <p className="text-white/70 leading-relaxed">
                AI-driven recommendations and adaptive learning paths tailored to your individual needs.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass rounded-2xl p-8 hover:shadow-neon transition-all duration-300">
              <TrendingUp className="w-12 h-12 text-green-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Career Growth</h3>
              <p className="text-white/70 leading-relaxed">
                Industry-relevant courses designed to accelerate your career and open new opportunities.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass rounded-2xl p-8 hover:shadow-neon transition-all duration-300">
              <Users className="w-12 h-12 text-purple-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Expert Community</h3>
              <p className="text-white/70 leading-relaxed">
                Connect with industry experts and fellow learners in our vibrant community.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass rounded-2xl p-8 hover:shadow-neon transition-all duration-300">
              <Play className="w-12 h-12 text-red-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Flexible Learning</h3>
              <p className="text-white/70 leading-relaxed">
                Learn at your own pace with 24/7 access to course materials and lifetime updates.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="mb-8">
              <AnimatedHeading 
                size="xl" 
                strokeColor="#FFD70A"
                className="mb-6"
              >
                Ready to Start Your Journey?
              </AnimatedHeading>
              <p className="text-xl text-white/80 mb-8">
                Join thousands of learners who have transformed their careers with VidyarthiHub
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-richblack-900 px-8 py-4 rounded-full font-bold text-lg shadow-neon flex items-center gap-2 group"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20 hover:border-white/40 transition-all"
                >
                  Contact Us
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;