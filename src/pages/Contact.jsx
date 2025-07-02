import React from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  Users,
  Star,
  ArrowRight,
  Globe,
  Zap,
  Waves,
  Fish,
  Anchor,
  Ship
} from "lucide-react";

import ContactDetails from "../components/ContactPage/ContactDetails";
import ContactForm from "../components/ContactPage/ContactForm";
import ReviewSlider from "../components/common/ReviewSlider";
import AnimatedHeading from "../components/common/AnimatedHeading";
import { 
  AnimatedLines, 
  FloatingShapes, 
  AnimatedGrid, 
  AnimatedDots,
  SectionDivider 
} from "../components/common/SVGDecorations";
import Navbar from '../components/common/Navbar';

// Ocean-themed floating elements
const FloatingBubble = ({ position, size, delay = 0 }) => (
  <motion.div
    className="absolute bg-white/10 rounded-full backdrop-blur-sm border border-white/20"
    style={{
      left: position.x,
      top: position.y,
      width: size,
      height: size,
    }}
    animate={{
      y: [0, -100, 0],
      x: [0, Math.random() * 20 - 10, 0],
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
    }}
    transition={{
      duration: 4 + Math.random() * 2,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
);

const WaveAnimation = ({ delay = 0, color = "#4facfe" }) => (
  <motion.div
    className="absolute bottom-0 left-0 w-full h-32"
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 0.3 }}
    transition={{ duration: 2, delay }}
  >
    <svg
      className="w-full h-full"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M 0 60 Q 300 20 600 60 T 1200 60 L 1200 120 L 0 120 Z"
        fill={color}
        animate={{
          d: [
            "M 0 60 Q 300 20 600 60 T 1200 60 L 1200 120 L 0 120 Z",
            "M 0 60 Q 300 40 600 60 T 1200 60 L 1200 120 L 0 120 Z",
            "M 0 60 Q 300 20 600 60 T 1200 60 L 1200 120 L 0 120 Z",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
      />
    </svg>
  </motion.div>
);

const FloatingFish = ({ position, delay = 0 }) => (
  <motion.div
    className="absolute text-blue-400/60"
    style={{
      left: position.x,
      top: position.y,
    }}
    animate={{
      x: [0, 100, 0],
      y: [0, -20, 0],
      rotate: [0, 5, 0],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  >
    <Fish className="w-6 h-6" />
  </motion.div>
);

const Contact = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-800 relative overflow-hidden">
      <Navbar />
      {/* Ocean waves */}
      <WaveAnimation delay={0} color="#4facfe" />
      <WaveAnimation delay={1} color="#06b6d4" />
      <WaveAnimation delay={2} color="#0891b2" />
      
      {/* Floating bubbles */}
      {[...Array(20)].map((_, i) => (
        <FloatingBubble
          key={i}
          position={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
          }}
          size={Math.random() * 20 + 10}
          delay={Math.random() * 3}
        />
      ))}
      
      {/* Floating fish */}
      {[...Array(8)].map((_, i) => (
        <FloatingFish
          key={i}
          position={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
          }}
          delay={Math.random() * 5}
        />
      ))}
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center justify-center mb-6">
                <Waves className="w-16 h-16 text-cyan-400 mr-4" />
                <AnimatedHeading 
                  size="2xl" 
                  strokeColor="#06b6d4"
                  className="mb-6"
                >
                  Dive Into Conversation
                </AnimatedHeading>
              </div>
              <p className="text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 text-center hover:shadow-neon transition-all duration-300">
              <MessageCircle className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">24/7 Support</h3>
              <p className="text-white/70">Round the clock assistance</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 text-center hover:shadow-neon transition-all duration-300">
              <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Quick Response</h3>
              <p className="text-white/70">Within 2 hours guaranteed</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 text-center hover:shadow-neon transition-all duration-300">
              <Globe className="w-12 h-12 text-teal-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Global Reach</h3>
              <p className="text-white/70">Available worldwide</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="relative py-20 px-4 lg:px-8">
        <SectionDivider color="#4facfe" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16"
          >
            {/* Contact Details */}
            <motion.div variants={itemVariants}>
              <div className="glass rounded-3xl p-8 h-fit">
                <ContactDetails />
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <div className="glass rounded-3xl p-8">
                <ContactForm />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Additional Contact Info */}
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
              <div className="flex items-center justify-center mb-6">
                <Anchor className="w-12 h-12 text-cyan-400 mr-4" />
                <AnimatedHeading 
                  size="xl" 
                  strokeColor="#06b6d4"
                  className="mb-6"
                >
                  Multiple Ways to Connect
                </AnimatedHeading>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 text-center hover:shadow-neon transition-all duration-300">
              <Mail className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Email Us</h3>
              <p className="text-white/70 mb-4">support@vidyarthihub.com</p>
              <p className="text-white/60 text-sm">We'll respond within 2 hours</p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 text-center hover:shadow-neon transition-all duration-300">
              <Phone className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Call Us</h3>
              <p className="text-white/70 mb-4">+1 (555) 123-4567</p>
              <p className="text-white/60 text-sm">Mon-Fri 9AM-6PM EST</p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 text-center hover:shadow-neon transition-all duration-300">
              <MapPin className="w-12 h-12 text-teal-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Visit Us</h3>
              <p className="text-white/70 mb-4">123 Learning Street</p>
              <p className="text-white/60 text-sm">Education City, EC 12345</p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 text-center hover:shadow-neon transition-all duration-300">
              <Clock className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Live Chat</h3>
              <p className="text-white/70 mb-4">Available 24/7</p>
              <p className="text-white/60 text-sm">Instant responses</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
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
                <Ship className="w-12 h-12 text-cyan-400 mr-4" />
                <AnimatedHeading 
                  size="xl" 
                  strokeColor="#06b6d4"
                  className="mb-6"
                >
                  What Our Learners Say
                </AnimatedHeading>
              </div>
            </motion.div>
            <ReviewSlider />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;