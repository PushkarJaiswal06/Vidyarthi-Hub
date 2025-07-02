import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Star, 
  Users, 
  Clock, 
  ArrowRight,
  Filter,
  Search,
  TrendingUp,
  Sparkles,
  Target,
  Zap,
  Cpu,
  Code,
  Database,
  Network,
  Circuit,
  Binary,
  Terminal,
  Wifi,
  Satellite,
  ChevronDown,
  Grid3X3,
  List,
  HardDrive,
  Server,
  Globe,
  Award,
  Heart,
  Shield
} from 'lucide-react'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import { useSelector, useDispatch } from "react-redux"
import Error from "./Error"
import AnimatedHeading from '../components/common/AnimatedHeading';
import { getAllCourses } from "../services/operations/courseDetailsAPI";
import Navbar from '../components/common/Navbar';
import { fetchAndStoreEnrolledCourses } from '../services/operations/profileAPI';

// Tech-themed floating elements
const DigitalParticle = ({ position, delay = 0 }) => (
  <motion.div
    className="absolute w-1 h-1 bg-cyan-400 rounded-full"
    style={{
      left: position.x,
      top: position.y,
    }}
    animate={{
      y: [0, -100, 0],
      x: [0, Math.random() * 20 - 10, 0],
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
    }}
    transition={{
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
);

const CircuitLine = ({ startX, startY, endX, endY, delay = 0 }) => {
  const isValid = [startX, startY, endX, endY].every(
    (v) => typeof v === "number" && !isNaN(v)
  );
  if (!isValid) return null;
  return (
    <motion.div
      className="absolute"
      style={{
        left: startX,
        top: startY,
      }}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.3 }}
      transition={{
        duration: 2,
        delay,
      }}
    >
      <svg
        width={Math.abs(endX - startX)}
        height={Math.abs(endY - startY)}
        className="text-cyan-400/30"
      >
        <motion.path
          d={`M 0 0 L ${endX - startX} ${endY - startY}`}
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            delay,
          }}
        />
      </svg>
    </motion.div>
  );
};

const BinaryRain = ({ position, delay = 0 }) => (
  <motion.div
    className="absolute text-green-400/40 font-mono text-xs"
    style={{
      left: position.x,
      top: position.y,
    }}
    animate={{
      y: [0, 200],
      opacity: [1, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "linear",
      delay,
    }}
  >
    {Math.random() > 0.5 ? "1" : "0"}
  </motion.div>
);

const FloatingChip = ({ position, delay = 0 }) => (
  <motion.div
    className="absolute text-purple-400/30"
    style={{
      left: position.x,
      top: position.y,
    }}
    animate={{
      y: [0, -20, 0],
      x: [0, 10, 0],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  >
    <HardDrive className="w-8 h-8" />
  </motion.div>
);

const FloatingServer = ({ position, delay = 0 }) => (
  <motion.div
    className="absolute text-blue-400/30"
    style={{
      left: position.x,
      top: position.y,
    }}
    animate={{
      y: [0, -15, 0],
      x: [0, -5, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  >
    <Server className="w-6 h-6" />
  </motion.div>
);

const Catalog = () => {
  const dispatch = useDispatch();
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()

  // Debug log to check course data
  console.log('Courses in Redux:', course);

  // State for all categories (for /catalog)
  const [allCategories, setAllCategories] = useState([])
  const [fetchError, setFetchError] = useState(null)

  // State for category-specific page (for /catalog/:catalogName)
  const [active, setActive] = useState(1)
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

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

  // Fetch all categories for /catalog
  useEffect(() => {
    if (!catalogName) {
      const fetchCategoriesWithCourses = async () => {
        try {
          const res = await apiConnector("GET", categories.CATEGORIES_API)
          setAllCategories(res.data.data)
        } catch (error) {
          setFetchError(error)
        }
      }
      fetchCategoriesWithCourses()
    }
  }, [catalogName])

  // Fetch category-specific data for /catalog/:catalogName
  useEffect(()=> {
    if (catalogName) {
      const getCategories = async() => {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        const category_id = 
          res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]?._id;
        setCategoryId(category_id);
      }
      getCategories();
    }
  },[catalogName]);

  useEffect(() => {
    if (catalogName && categoryId) {
      const getCategoryDetails = async() => {
        try{
          const res = await getCatalogaPageData(categoryId);
          setCatalogPageData(res);
        }
        catch(error) {
          setFetchError(error)
        }
      }
      getCategoryDetails();
    }
  },[catalogName, categoryId]);

  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchAndStoreEnrolledCourses(token));
    }
  }, [dispatch, token]);

  const categories = [
    "All Categories",
    "Development",
    "Business",
    "Computer Science",
    "Design",
    "Marketing",
  ];

  const sortOptions = [
    "Most Popular",
    "Newest",
    "Price: Low to High",
    "Price: High to Low",
    "Rating: High to Low",
  ];

  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [viewMode, setViewMode] = useState("grid");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        <Navbar />
        {/* Tech background elements */}
        {/* Circuit lines */}
        <CircuitLine startX="10%" startY="20%" endX="30%" endY="40%" delay={0} />
        <CircuitLine startX="70%" startY="10%" endX="90%" endY="30%" delay={1} />
        <CircuitLine startX="20%" startY="80%" endX="40%" endY="60%" delay={2} />
        <CircuitLine startX="80%" startY="70%" endX="60%" endY="90%" delay={3} />
        
        {/* Digital particles */}
        {[...Array(30)].map((_, i) => (
          <DigitalParticle
            key={i}
            position={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            delay={Math.random() * 3}
          />
        ))}
        
        {/* Binary rain */}
        {[...Array(20)].map((_, i) => (
          <BinaryRain
            key={i}
            position={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            delay={Math.random() * 4}
          />
        ))}
        
        {/* Floating chips */}
        {[...Array(6)].map((_, i) => (
          <FloatingChip
            key={i}
            position={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            delay={Math.random() * 2}
          />
        ))}

        {/* Floating servers */}
        {[...Array(4)].map((_, i) => (
          <FloatingServer
            key={i}
            position={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            delay={Math.random() * 3}
          />
        ))}

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ 
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              y: [0, 40, 0],
              x: [0, -25, 0],
              rotate: [0, -180, -360]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            className="absolute bottom-20 right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <Navbar />
      {/* Tech background elements */}
      {/* Circuit lines */}
      <CircuitLine startX="10%" startY="20%" endX="30%" endY="40%" delay={0} />
      <CircuitLine startX="70%" startY="10%" endX="90%" endY="30%" delay={1} />
      <CircuitLine startX="20%" startY="80%" endX="40%" endY="60%" delay={2} />
      <CircuitLine startX="80%" startY="70%" endX="60%" endY="90%" delay={3} />
      
      {/* Digital particles */}
      {[...Array(30)].map((_, i) => (
        <DigitalParticle
          key={i}
          position={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
          }}
          delay={Math.random() * 3}
        />
      ))}
      
      {/* Binary rain */}
      {[...Array(20)].map((_, i) => (
        <BinaryRain
          key={i}
          position={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
          }}
          delay={Math.random() * 4}
        />
      ))}
      
      {/* Floating chips */}
      {[...Array(6)].map((_, i) => (
        <FloatingChip
          key={i}
          position={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
          }}
          delay={Math.random() * 2}
        />
      ))}

      {/* Floating servers */}
      {[...Array(4)].map((_, i) => (
        <FloatingServer
          key={i}
          position={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
          }}
          delay={Math.random() * 3}
        />
      ))}

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 40, 0],
            x: [0, -25, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute bottom-20 right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-12"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center justify-center mb-6">
                <Cpu className="w-16 h-16 text-cyan-400 mr-4" />
                <AnimatedHeading 
                  size="2xl" 
                  strokeColor="#06b6d4"
                  className="mb-6"
                >
                  Explore Our Digital Universe
                </AnimatedHeading>
              </div>
              <p className="text-xl lg:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                Discover cutting-edge courses designed to accelerate your career in the digital age. 
                From coding to design, business to AI - master the skills that matter.
              </p>
            </motion.div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="glass rounded-3xl p-8 mb-12 shadow-neon"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Search Bar */}
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for courses..."
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-all duration-300 appearance-none"
                >
                  {categories.map((category) => (
                    <option key={category} value={category} className="bg-slate-800">
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5 pointer-events-none" />
              </div>

              {/* Sort By */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-all duration-300 appearance-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option} className="bg-slate-800">
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center space-x-4">
                <span className="text-white/60">View:</span>
                <div className="flex bg-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all duration-300 ${
                      viewMode === "grid" 
                        ? "bg-cyan-500 text-white" 
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all duration-300 ${
                      viewMode === "list" 
                        ? "bg-cyan-500 text-white" 
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="text-white/60">
                {course?.length || 0} courses found
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Courses Section */}
      <section className="relative py-16 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-center mb-6">
                <Code className="w-12 h-12 text-purple-400 mr-4" />
                <AnimatedHeading 
                  size="xl" 
                  strokeColor="#a855f7"
                  className="mb-6"
                >
                  All Courses
                </AnimatedHeading>
              </div>
            </motion.div>
          </motion.div>

          {/* Course Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`grid gap-8 items-stretch ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            }`}
          >
            {course?.map((course, index) => (
              <motion.div
                key={course._id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Course_Card course={course} />
              </motion.div>
            ))}
          </motion.div>

          {/* Load More Button */}
          {course?.length > 8 && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <button className="glass rounded-xl px-8 py-4 text-white hover:shadow-neon transition-all duration-300 flex items-center space-x-2 mx-auto">
                <span>Load More Courses</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 text-center hover:shadow-neon transition-all duration-300">
              <Database className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">{course?.length || 0}+</h3>
              <p className="text-white/70">Courses Available</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 text-center hover:shadow-neon transition-all duration-300">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">50K+</h3>
              <p className="text-white/70">Active Learners</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 text-center hover:shadow-neon transition-all duration-300">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">4.8</h3>
              <p className="text-white/70">Average Rating</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 text-center hover:shadow-neon transition-all duration-300">
              <Network className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">150+</h3>
              <p className="text-white/70">Expert Instructors</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Catalog