import React from "react";
import { motion } from "framer-motion";
import { 
  FaGithub, 
  FaLinkedin, 
  FaInstagram
} from "react-icons/fa";
import { 
  Users,
  BookOpen,
  Award,
  Globe,
  Target,
  Heart,
  Sparkles,
  Rocket,
  Star,
  ArrowRight,
  Quote as QuoteIcon,
  CheckCircle,
  Lightbulb,
  Zap,
  Leaf,
  Flower2,
  Mountain,
  Sun,
  Cloud,
  TreePine,
  Sprout,
  Droplets,
  Shield,
  Clock,
  MapPin
} from "lucide-react";

// import Footer from "../components/common/Footer"
import LearningGrid from "../components/core/AboutPage/LearningGrid"
import QuoteComponent from "../components/core/AboutPage/Quote"
import Stats from "../components/core/AboutPage/Stats"
import HighlightText from "../components/core/HomePage/HighlightText"
import ReviewSlider from "../components/common/ReviewSlider"
import Footer from "../components/common/Footer"
import AnimatedHeading from "../components/common/AnimatedHeading";
import { 
  AnimatedLines, 
  FloatingShapes, 
  AnimatedGrid, 
  AnimatedDots,
  SectionDivider 
} from "../components/common/SVGDecorations";
import Navbar from '../components/common/Navbar';

// Nature-themed animated elements for About page
const FloatingLeaf = ({ position, delay = 0, size = "w-6 h-6" }) => (
  <motion.div
    className={`absolute ${size} text-green-400/40`}
    style={{
      left: position.x,
      top: position.y,
    }}
    animate={{
      y: [0, -30, 0],
      x: [0, 20, 0],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  >
    <Leaf />
  </motion.div>
);

const FloatingFlower = ({ position, delay = 0 }) => (
  <motion.div
    className="absolute w-4 h-4 text-pink-400/40"
    style={{
      left: position.x,
      top: position.y,
    }}
    animate={{
      y: [0, -20, 0],
      opacity: [0.3, 1, 0.3],
      scale: [0.5, 1.5, 0.5],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  >
    <Flower2 />
  </motion.div>
);

const FloatingTree = ({ position, delay = 0 }) => (
  <motion.div
    className="absolute w-8 h-8 text-green-500/30"
    style={{
      left: position.x,
      top: position.y,
    }}
    animate={{
      y: [0, -15, 0],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  >
    <TreePine />
  </motion.div>
);

const About = () => {
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

  const missionValues = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Passion for Learning",
      description: "We believe education should ignite curiosity and inspire lifelong learning",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Clear Purpose",
      description: "Every course is designed with specific learning outcomes and real-world applications",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community First",
      description: "Learning happens best when we connect, collaborate, and grow together",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description: "We maintain the highest standards in content quality and learning experience",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const timelineData = [
    {
      year: "2023",
      title: "The Beginning",
      description: "VidyarthiHub was founded with a vision to democratize quality education",
      icon: <Sprout className="w-6 h-6" />
    },
    {
      year: "2024",
      title: "Rapid Growth",
      description: "Reached 10,000+ learners and launched innovative 3D learning environments",
      icon: <Rocket className="w-6 h-6" />
    },
    {
      year: "2025",
      title: "Global Expansion",
      description: "Expanded to 50+ countries with localized learning experiences",
      icon: <Globe className="w-6 h-6" />
    }
  ];

  const teamMembers = [
    {
      name: "Pushkar Jaiswal",
      role: "Founder & CEO",
      description: "Full Stack Developer passionate about creating innovative learning experiences",
      expertise: ["React", "Node.js", "MongoDB", "AWS"],
      social: {
        linkedin: "https://www.linkedin.com/in/pushkar-jaiswal06/",
        github: "https://github.com/PushkarJaiswal06",
        instagram: "https://www.instagram.com/pushkar_j.06"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 relative overflow-hidden">
      <Navbar />
      {/* Nature-themed background elements */}
      {/* Floating Leaves */}
      {[...Array(8)].map((_, i) => (
        <FloatingLeaf
          key={i}
          position={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
          }}
          delay={Math.random() * 3}
          size={i % 2 === 0 ? "w-6 h-6" : "w-4 h-4"}
        />
      ))}

      {/* Floating Flowers */}
      {[...Array(12)].map((_, i) => (
        <FloatingFlower
          key={i}
          position={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
          }}
          delay={Math.random() * 2}
        />
      ))}

      {/* Floating Trees */}
      {[...Array(6)].map((_, i) => (
        <FloatingTree
          key={i}
          position={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
          }}
          delay={Math.random() * 4}
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
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 40, 0],
            x: [0, -25, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-20 right-20 w-60 h-60 bg-teal-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            x: [0, 15, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 gap-12 items-center">
            <div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-center lg:text-left mb-16"
              >
                <motion.div variants={itemVariants} className="mb-8">
                  <div className="flex items-center justify-center lg:justify-start mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-neon mr-4">
                      <Sprout className="text-white w-8 h-8" />
                    </div>
                    <AnimatedHeading 
                      size="2xl" 
                      strokeColor="#10b981"
                      className="mb-6"
                    >
                      About VidyarthiHub
                    </AnimatedHeading>
                  </div>
                  <p className="text-xl lg:text-2xl text-white/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    We're on a mission to revolutionize education through innovative technology, 
                    creating a learning ecosystem that grows and adapts like nature itself.
                  </p>
                </motion.div>
              </motion.div>
              {/* Mission Values Grid (horizontal, full width) */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
              >
                {missionValues.map((value, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -8 }}
                    className="glass rounded-2xl p-8 text-center shadow-neon w-full"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                      <div className="text-white">
                        {value.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
                    <p className="text-white/70 text-lg leading-relaxed max-w-xs mx-auto">{value.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="relative py-16 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <motion.div variants={itemVariants}>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                    Our Story
                  </h2>
                  <p className="text-lg text-white/80 leading-relaxed mb-6">
                    VidyarthiHub was born from a simple yet powerful vision: to make quality education 
                    accessible to everyone, everywhere. Like a seed that grows into a mighty tree, 
                    we started small but dreamed big.
                  </p>
                  <p className="text-lg text-white/80 leading-relaxed mb-6">
                    Our platform combines cutting-edge technology with time-tested educational principles, 
                    creating an environment where learning flourishes naturally. We believe that education 
                    should be as organic and nurturing as nature itself.
                  </p>
                  <p className="text-lg text-white/80 leading-relaxed">
                    Today, we're proud to serve thousands of learners and instructors worldwide, 
                    helping them grow, learn, and achieve their dreams in our digital learning ecosystem.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="relative py-16 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <motion.div variants={itemVariants}>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                    Our Journey
                  </h2>
                  <p className="text-lg text-white/80 max-w-2xl mx-auto">
                    From humble beginnings to global impact, discover the milestones that shaped 
                    VidyarthiHub into the revolutionary learning platform it is today.
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative"
              >
                {/* Timeline Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-500/50 to-teal-500/50 rounded-full"></div>

                {/* Timeline Items */}
                <div className="space-y-16">
                  {timelineData.map((item, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                      {/* Content */}
                      <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="glass rounded-2xl p-6 shadow-neon"
                        >
                          <div className={`w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
                            <div className="text-white">
                              {item.icon}
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                          <p className="text-white/70 mb-3">{item.description}</p>
                          <span className="text-sm font-semibold text-green-400">{item.year}</span>
                        </motion.div>
                      </div>

                      {/* Timeline Dot */}
                      <div className="relative z-10">
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full border-4 border-richblack-900 shadow-neon"
                        />
                      </div>

                      {/* Empty space for alignment */}
                      <div className="w-1/2"></div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="relative py-16 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <motion.div variants={itemVariants}>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                    Meet Our Team
                  </h2>
                  <p className="text-lg text-white/80 max-w-2xl mx-auto">
                    The passionate minds behind VidyarthiHub, dedicated to transforming education 
                    through innovation and technology.
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-1 gap-8"
              >
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="glass rounded-3xl p-8 shadow-neon"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                      {/* Profile Image */}
                      <div className="text-center lg:text-left">
                        <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                          <BookOpen className="w-16 h-16 text-white" />
                        </div>
                      </div>

                      {/* Member Info */}
                      <div className="lg:col-span-2 space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                          <p className="text-green-400 text-lg mb-4">{member.role}</p>
                          <p className="text-white/80 leading-relaxed">{member.description}</p>
                        </div>

                        {/* Expertise */}
                        <div>
                          <h4 className="text-white font-semibold mb-3">Expertise</h4>
                          <div className="flex flex-wrap gap-2">
                            {member.expertise.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex space-x-4">
                          <a
                            href={member.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 hover:bg-blue-500/30 transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                          <a
                            href={member.social.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-gray-500/20 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-500/30 transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </a>
                          <a
                            href={member.social.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center text-pink-400 hover:bg-pink-500/30 transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.875-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            {/* Large Team Illustration Placeholder */}
            <div className="flex justify-center lg:justify-end">
              <img src={require("../assets/Images/pj4.webp")} alt="Team member - Pushkar Jaiswal" className="w-full max-w-lg  rounded-2xl shadow-large " />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <motion.div variants={itemVariants}>
          <Stats />
        </motion.div>

        {/* Learning Grid Section */}
        <motion.div variants={itemVariants} className="mt-20">
          <LearningGrid />
        </motion.div>
      </div>

      {/* Reviews Section */}
      <section className="relative py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 text-center"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center justify-center mb-6">
                <Sun className="w-12 h-12 text-yellow-400 mr-4" />
                <AnimatedHeading 
                  size="xl" 
                  strokeColor="#eab308"
                  className="mb-6"
                >
                  Reviews from Our Learners
                </AnimatedHeading>
              </div>
            </motion.div>
            <ReviewSlider />
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About