import { motion } from "framer-motion";
import { 
  ChalkboardTeacher, 
  Users, 
  Award, 
  Star, 
  BookOpen,
  Globe,
  Zap,
  Heart,
  Target,
  TrendingUp,
  Shield,
  Sparkles
} from "lucide-react";
import AnimatedHeading from "../../common/AnimatedHeading";

const InstructorSection = () => {
  const instructorStats = [
    {
      icon: <Users className="w-6 h-6" />,
      number: "500+",
      label: "Expert Instructors",
      color: "text-blue-400"
    },
    {
      icon: <Award className="w-6 h-6" />,
      number: "1000+",
      label: "Courses Created",
      color: "text-yellow-400"
    },
    {
      icon: <Star className="w-6 h-6" />,
      number: "4.9",
      label: "Average Rating",
      color: "text-purple-400"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      number: "50+",
      label: "Countries",
      color: "text-green-400"
    }
  ];

  const instructorFeatures = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Create Engaging Content",
      description: "Build interactive courses with multimedia, quizzes, and real-world projects",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Reach Global Students",
      description: "Connect with learners from around the world and share your expertise",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Track Student Progress",
      description: "Monitor learning outcomes and provide personalized feedback",
      color: "from-green-500 to-teal-500"
    }
  ];

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
    <section className="relative py-20 px-4 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 40, 0],
            x: [0, -25, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-20 right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <AnimatedHeading 
              size="xl" 
              strokeColor="#8b5cf6"
              className="mb-6"
            >
              Become an Instructor
            </AnimatedHeading>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Share your knowledge with the world and inspire the next generation of learners. 
              Join our community of expert instructors and make a difference.
            </p>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {instructorStats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="glass rounded-xl p-6 text-center"
            >
              <div className={`${stat.color} mb-3`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
        >
          {instructorFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -10 }}
              className="glass rounded-2xl p-8 shadow-neon"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Instructor Illustration */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-neon">
                <ChalkboardTeacher className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Why Teach with Us?</h3>
                <p className="text-purple-400">Join the future of education</p>
              </div>
            </div>
            
            <div className="space-y-4 text-white/80">
              <div className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-pink-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Passionate Community</h4>
                  <p className="text-sm">Connect with like-minded educators and learners</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Flexible Teaching</h4>
                  <p className="text-sm">Teach at your own pace and schedule</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Advanced Tools</h4>
                  <p className="text-sm">Access cutting-edge teaching technologies</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Secure Platform</h4>
                  <p className="text-sm">Your content and earnings are protected</p>
                </div>
              </div>
            </div>
          </div>

          {/* Animated Illustration */}
          <div className="relative h-96 flex items-center justify-center">
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10"
            >
              <div className="w-48 h-48 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <div className="text-center">
                  <ChalkboardTeacher className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                  <div className="text-white font-semibold">Share Your Knowledge</div>
                </div>
              </div>
            </motion.div>

            {/* Orbiting Elements */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                animate={{
                  x: [0, Math.cos((i * 60) * Math.PI / 180) * 120],
                  y: [0, Math.sin((i * 60) * Math.PI / 180) * 120],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 2,
                }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                  {i % 3 === 0 ? (
                    <BookOpen className="w-4 h-4 text-blue-400" />
                  ) : i % 3 === 1 ? (
                    <Users className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Award className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="glass rounded-3xl p-8 shadow-neon">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Inspire?</h3>
            <p className="text-white/80 max-w-2xl mx-auto mb-6">
              Start your teaching journey today and help shape the future of education. 
              Join our community of passionate instructors.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
            >
              Become an Instructor
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InstructorSection;