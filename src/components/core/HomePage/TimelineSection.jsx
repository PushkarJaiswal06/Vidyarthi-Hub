import { motion } from "framer-motion";
import { 
  Rocket, 
  Zap, 
  Target, 
  Star, 
  Award,
  TrendingUp,
  Users,
  Globe,
  BookOpen,
  Lightbulb,
  Code,
  Palette
} from "lucide-react";
import AnimatedHeading from "../../common/AnimatedHeading";

const TimelineSection = () => {
  const timelineData = [
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Platform Launch",
      description: "VidyarthiHub officially launched with cutting-edge 3D learning environments",
      year: "2023",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Growth",
      description: "Reached 10,000+ active learners and 500+ expert instructors",
      year: "2024",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Industry Recognition",
      description: "Awarded 'Best Innovation in EdTech' at Global Education Summit",
      year: "2024",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Expansion",
      description: "Expanded to 50+ countries with localized learning experiences",
      year: "2025",
      color: "from-green-500 to-teal-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
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
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 40, 0],
            x: [0, -25, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
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
              Our Journey of Innovation
            </AnimatedHeading>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
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
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500/50 to-blue-500/50 rounded-full"></div>

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
                    <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-4 ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
                      <div className="text-white">
                        {item.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/70 mb-3">{item.description}</p>
                    <span className="text-sm font-semibold text-purple-400">{item.year}</span>
                  </motion.div>
                </div>

                {/* Timeline Dot */}
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-full border-4 border-richblack-900 shadow-neon`}
                  />
                </div>

                {/* Empty space for alignment */}
                <div className="w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Future Vision */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="glass rounded-3xl p-8 shadow-neon">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">The Future Awaits</h3>
            <p className="text-white/80 max-w-2xl mx-auto">
              We're just getting started. Our vision extends beyond traditional education, 
              creating immersive learning experiences that prepare learners for the challenges of tomorrow.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TimelineSection;