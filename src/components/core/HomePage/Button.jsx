import React from "react";
import { Link } from "react-router-dom";

const Button = ({ children, active, linkto, variant = "primary", size = "md", className = "" }) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: active 
      ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow hover:shadow-glow-lg focus:ring-primary-500" 
      : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 focus:ring-white/50",
    secondary: "bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-800 shadow-soft hover:shadow-medium focus:ring-neutral-500",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-glow hover:shadow-glow-lg focus:ring-accent-500",
    outline: "bg-transparent border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white focus:ring-primary-500",
    ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <Link to={linkto} className="group">
      <button className={`${buttonClasses} relative overflow-hidden`}>
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
        
        {/* Content */}
        <span className="relative z-10 flex items-center space-x-2">
          {children}
        </span>
        
        {/* Ripple effect on click */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-20 group-active:animate-ping bg-white"></div>
      </button>
    </Link>
  );
};

export default Button;