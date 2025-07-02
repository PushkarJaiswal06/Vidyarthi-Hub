import { motion } from "framer-motion";
import { 
  TrendingUp, 
  BarChart3, 
  Calendar,
  Target,
  BookOpen,
  Users,
  Award,
  Star,
  Zap,
  Shield,
  Globe,
  Heart
} from "lucide-react";
import AnimatedHeading from "../../common/AnimatedHeading";

const LearningLanguageSection = () => {
  const learningFeatures = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Track Your Progress",
      description: "Monitor your learning journey with detailed analytics and insights",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Compare Performance",
      description: "See how you stack up against peers and industry benchmarks",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Plan Your Learning",
      description: "Create personalized study schedules that fit your lifestyle",
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
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 40, 0],
            x: [0, -25, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-20 right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"
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
              strokeColor="#3b82f6"
              className="mb-6"
            >
              Smart Learning Analytics
            </AnimatedHeading>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Take control of your learning journey with intelligent insights, 
              personalized recommendations, and data-driven progress tracking.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {learningFeatures.map((feature, index) => (
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

        {/* Additional Features Grid */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass rounded-xl p-6 text-center">
              <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h4 className="font-semibold text-white mb-2">Goal Setting</h4>
              <p className="text-xs text-white/60">Set and achieve learning milestones</p>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h4 className="font-semibold text-white mb-2">Peer Learning</h4>
              <p className="text-xs text-white/60">Learn from and with others</p>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h4 className="font-semibold text-white mb-2">Achievements</h4>
              <p className="text-xs text-white/60">Earn badges and certificates</p>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <Zap className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h4 className="font-semibold text-white mb-2">Quick Actions</h4>
              <p className="text-xs text-white/60">Fast access to key features</p>
            </div>
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
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Learning?</h3>
            <p className="text-white/80 max-w-2xl mx-auto mb-6">
              Join thousands of learners who are already experiencing the future of education 
              with our intelligent learning platform.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              Get Started Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LearningLanguageSection;