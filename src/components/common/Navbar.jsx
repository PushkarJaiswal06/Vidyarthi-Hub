import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Menu, 
  X, 
  Search, 
  User, 
  BookOpen, 
  Home, 
  Info, 
  Phone, 
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';

// Components
import ProfileDropDown from '../core/Auth/ProfileDropDown';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    {
      title: "Home",
      path: "/",
      icon: Home
    },
    {
      title: "Courses",
      path: "/catalog",
      icon: BookOpen
    },
    {
      title: "About",
      path: "/about",
      icon: Info
    },
    {
      title: "Contact",
      path: "/contact",
      icon: Phone
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  // Map routes to their background classes
  const routeBgMap = {
    '/': 'bg-gradient-to-br from-richblack-900 via-cyan-900 to-richblack-800',
    '/about': 'bg-gradient-to-br from-emerald-900 via-teal-700 to-green-900',
    '/catalog': 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900',
    '/contact': 'bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-800',
    '/login': 'bg-gradient-to-br from-richblack-900 via-purple-900 to-richblack-800',
    '/signup': 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900',
    '/dashboard/my-profile': 'bg-gradient-to-br from-richblack-800 via-cyan-800 to-richblack-900',
    '/dashboard/enrolled-courses': 'bg-gradient-to-br from-richblack-800 via-cyan-800 to-richblack-900',
    '/dashboard/cart': 'bg-gradient-to-br from-richblack-800 via-cyan-800 to-richblack-900',
    '/forgot-password': 'bg-gradient-to-br from-richblack-800 via-cyan-800 to-richblack-900',
    '/update-password': 'bg-gradient-to-br from-richblack-800 via-cyan-800 to-richblack-900',
    // Add more routes as needed
  };
  const currentBg = routeBgMap[location.pathname] || 'bg-gradient-to-br from-richblack-900 via-cyan-900 to-richblack-800';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass backdrop-blur-md border-b border-white/10'
          : currentBg
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-display font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  VidyarthiHub
                </h1>
                <p className="text-xs text-white/60 -mt-1">Learn • Grow • Succeed</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link, index) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              
              return (
                <Link
                  key={link.title}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 group relative ${
                    isActive 
                      ? 'text-white bg-white/10' 
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{link.title}</span>
                  {isActive && (
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-white/20"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-4">
            {showSearch && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-all"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              </div>
            )}
            
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Auth Buttons / Profile */}
          <div className="flex items-center space-x-4">
            {token === null ? (
              <>
                <Link to="/login">
                  <button
                    className="hidden sm:block px-6 py-2 text-white/80 hover:text-white transition-colors"
                  >
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-neon transition-all duration-300"
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard/instructor">
                  <button
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-white">Dashboard</span>
                  </button>
                </Link>
                <ProfileDropDown />
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setToggle(!toggle)}
              className="lg:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
            >
              {toggle ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {toggle && (
          <div className="lg:hidden glass rounded-2xl mt-4 mb-4 overflow-hidden">
            <div className="p-6 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  
                  return (
                    <Link
                      key={link.title}
                      to={link.path}
                      onClick={() => setToggle(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-white/10 text-white' 
                          : 'text-white/80 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{link.title}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Auth Buttons */}
              {token === null ? (
                <div className="pt-4 space-y-3">
                  <Link to="/login" onClick={() => setToggle(false)}>
                    <button className="w-full px-4 py-3 text-white/80 hover:text-white transition-colors text-left">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup" onClick={() => setToggle(false)}>
                    <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-neon transition-all duration-300">
                      Sign Up
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="pt-4 space-y-3">
                  <Link to="/dashboard/my-profile" onClick={() => setToggle(false)}>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300">
                      <User className="w-5 h-5" />
                      <span className="text-white">Dashboard</span>
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;