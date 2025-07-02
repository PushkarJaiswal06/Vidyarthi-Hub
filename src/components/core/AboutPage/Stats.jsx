import React from "react";
import { motion } from "framer-motion";
import { Users, Award, BookOpen, Star } from "lucide-react";

const Stats = [
  { count: "5K", label: "Active Students", icon: Users, color: "text-purple-400" },
  { count: "10+", label: "Mentors", icon: Star, color: "text-blue-400" },
  { count: "200+", label: "Courses", icon: BookOpen, color: "text-pink-400" },
  { count: "50+", label: "Awards", icon: Award, color: "text-yellow-400" },
];

const StatsComponenet = () => {
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
    <div className="relative py-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto"
      >
        {Stats.map((data, index) => {
          const IconComponent = data.icon;
          return (
            <motion.div 
              variants={itemVariants}
              key={index}
              className="glass rounded-2xl p-6 text-center hover:shadow-neon transition-all duration-300"
            >
              <IconComponent className={`w-12 h-12 ${data.color} mx-auto mb-4`} />
              <h1 className="text-4xl font-bold text-white mb-2">
                {data.count}
              </h1>
              <h2 className="font-semibold text-lg text-white/80">
                {data.label}
              </h2>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default StatsComponenet;