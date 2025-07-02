import React from 'react';
import { motion } from 'framer-motion';

const AnimatedHeading = ({ 
  children, 
  className = "", 
  size = "lg",
  withStroke = true,
  strokeColor = "#4facfe",
  textColor = "white"
}) => {
  const sizes = {
    sm: "text-2xl lg:text-3xl",
    md: "text-3xl lg:text-4xl",
    lg: "text-4xl lg:text-6xl",
    xl: "text-5xl lg:text-7xl",
    "2xl": "text-6xl lg:text-8xl"
  };

  const strokeVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 2, 
        ease: "easeInOut",
        delay: 0.5
      }
    }
  };

  const textVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.h1
        variants={textVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={`font-display font-bold ${sizes[size]} text-${textColor} relative z-10`}
      >
        {children}
      </motion.h1>
      
      {withStroke && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M 10 50 Q 100 10 200 50 T 390 50"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
            variants={strokeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          />
          <motion.path
            d="M 10 60 Q 100 20 200 60 T 390 60"
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
            variants={strokeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          />
        </svg>
      )}
    </div>
  );
};

export default AnimatedHeading; 