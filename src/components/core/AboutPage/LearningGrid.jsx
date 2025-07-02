import React from "react";
import { motion } from "framer-motion";
import { 
  Globe, 
  BookOpen, 
  GraduationCap, 
  Award, 
  Star, 
  Users,
  ArrowRight
} from "lucide-react";
import HighlightText from "../../../components/core/HomePage/HighlightText";

const learningGridArray = [
  {
    order: 0,
    heading: "World-Class Learning for Anyone, Anywhere",
    description:
      "VidyarthiHub partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
    BtnText: "Learn More",
    BtnLink: "/",
    icon: Globe,
    color: "text-purple-400"
  },
  {
    order: 1,
    heading: "Curriculum Based on Industry Needs",
    description:
      "Save time and money! The VidyarthiHub curriculum is made to be easier to understand and in line with industry needs.",
    icon: BookOpen,
    color: "text-blue-400"
  },
  {
    order: 2,
    heading: "Our Learning Methods",
    description:
      "VidyarthiHub partners with more than 275+ leading universities and companies to bring innovative learning methods to you.",
    icon: GraduationCap,
    color: "text-pink-400"
  },
  {
    order: 3,
    heading: "Certification",
    description:
      "VidyarthiHub partners with more than 275+ leading universities and companies to bring recognized certifications to learners.",
    icon: Award,
    color: "text-yellow-400"
  },
  
  {
    order: 4,
    heading: "Ready to Work",
    description:
      "VidyarthiHub partners with more than 275+ leading universities and companies to bring job-ready skills to learners.",
    icon: Users,
    color: "text-orange-400"
  },
];

function highlightVidyarthiHub(text) {
  const parts = text.split(/(VidyarthiHub)/g);
  return parts.map((part, idx) =>
    part === "VidyarthiHub" ? <HighlightText key={idx} text={part} /> : part
  );
}

const LearningGrid = () => {
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {learningGridArray.map((card, i) => {
        const IconComponent = card.icon;
        return (
          <motion.div
            key={i}
            variants={itemVariants}
            className={`glass rounded-3xl p-8 hover:shadow-neon transition-all duration-300 ${
              i === 0 ? "md:col-span-2 lg:col-span-2" : ""
            }`}
          >
            <div className="flex flex-col gap-6 h-full">
              <div className="flex items-center gap-4">
                <IconComponent className={`w-8 h-8 ${card.color}`} />
                <h3 className="text-xl font-bold text-white">{card.heading}</h3>
              </div>
              
              <p className="text-white/80 leading-relaxed flex-grow">
                {highlightVidyarthiHub(card.description)}
              </p>

              {card.BtnText && (
                <motion.a
                  href={card.BtnLink}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-200 font-semibold"
                >
                  {card.BtnText}
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default LearningGrid;