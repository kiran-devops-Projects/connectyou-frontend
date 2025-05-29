import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Users, Briefcase, MessageSquare, Calendar,
  BookOpen, HelpCircle, User, LogOut, Award,
  ChevronLeft, ChevronRight, Menu, GraduationCap, Lightbulb, X
} from 'lucide-react';

const Navbar = ({ type = 'student' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = type === 'student' ? [
    { name: "Dashboard", icon: <LineChart />, path: "/dashboard" },
    { name: "E-Learning", icon: <GraduationCap />, path: "/dashboard/e-learning" },
    { name: "Mentorship", icon: <Users />, path: "/dashboard/mentorship" },
    { name: "Jobs & Internships", icon: <Briefcase />, path: "/dashboard/jobs" },
    { name: "Messages", icon: <MessageSquare />, path: "/dashboard/messages", badge: 2 },
    { name: "Events", icon: <Calendar />, path: "/dashboard/events" },
    { name: "Projects", icon: <BookOpen />, path: "/dashboard/projects" },
    { name: "AI Assistant", icon: <HelpCircle />, path: "/dashboard/ai-assistant" },
    { name: "Workshops", icon: <Users />, path: "/dashboard/workshops" },
    { name: "Profile", icon: <User />, path: "/dashboard/profile" }
  ] : [
    { name: "Dashboard", icon: <LineChart />, path: "/alumni" },
    { name: "E-Learning", icon: <GraduationCap />, path: "/alumni/e-learning" },
    { name: "Mentorship", icon: <Users />, path: "/alumni/mentorship" },
    { name: "Job Postings", icon: <Briefcase />, path: "/alumni/job-postings" },
    { name: "Messages", icon: <MessageSquare />, path: "/alumni/messages", badge: 3 },
    { name: "Events", icon: <Calendar />, path: "/alumni/events" },
    { name: "Knowledge Hub", icon: <Lightbulb />, path: "/alumni/knowledge" },
    { name: "AI Assistant", icon: <HelpCircle />, path: "/alumni/ai-assistant" },
    { name: "Projects", icon: <BookOpen />, path: "/alumni/projects" },
    { name: "Profile", icon: <User />, path: "/alumni/profile" }
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (isMobileView) {
        setIsCollapsed(true);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    if (isMobile && mobileOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMobile, mobileOpen]);

  const colors = {
    student: {
      primary: 'from-purple-800 to-purple-900',
      accent: 'purple-800',
      hover: 'rgba(126, 34, 206, 0.1)',
      active: '#7e22ce',
      textAccent: 'text-purple-800',
      bgAccent: 'bg-purple-800',
      borderAccent: 'border-purple-800'
    },
    alumni: {
      primary: 'from-blue-800 to-blue-900',
      accent: 'blue-800',
      hover: 'rgba(30, 58, 138, 0.1)',
      active: '#1e40af',
      textAccent: 'text-blue-800',
      bgAccent: 'bg-blue-800',
      borderAccent: 'border-blue-800'
    }
  };

  const currentColors = colors[type];

  const sidebarVariants = {
    open: { 
      width: "240px", 
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    collapsed: { 
      width: "72px", 
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    mobileOpen: { 
      x: 0, 
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    mobileClosed: { 
      x: "-100%", 
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <motion.button
          className={`fixed top-4 left-4 z-50 ${mobileOpen ? 'bg-white' : currentColors.bgAccent} text-${mobileOpen ? currentColors.textAccent : 'white'} p-2 rounded-full shadow-lg`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      )}

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar - only one instance */}
      <motion.div
        className={`h-screen bg-white shadow-xl fixed top-0 left-0 flex flex-col overflow-hidden z-40 border-r border-gray-200`}
        initial={isMobile ? { x: "-100%" } : { width: isCollapsed ? "72px" : "240px" }}
        animate={
          isMobile 
            ? mobileOpen ? "mobileOpen" : "mobileClosed"
            : isCollapsed ? "collapsed" : "open"
        }
        variants={sidebarVariants}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-5 bg-gradient-to-r ${currentColors.primary}`}>
          <div className="flex items-center">
            {type === 'student' ? (
              <GraduationCap className="text-white h-6 w-6 mr-2" />
            ) : (
              <Award className="text-yellow-400 h-6 w-6 mr-2" />
            )}
            <AnimatePresence>
              {(!isCollapsed || (isMobile && mobileOpen)) && (
                <motion.span 
                  className="font-bold text-white text-lg"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {type === 'student' ? 'Student Portal' : 'Alumni Portal'}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {!isMobile && (
            <motion.button
              className={`p-1 rounded-full ${currentColors.bgAccent} text-white hover:opacity-80`}
              onClick={() => setIsCollapsed(!isCollapsed)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </motion.button>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.li key={item.path}>
                  <motion.button
                    onClick={() => {
                      navigate(item.path);
                      if (isMobile) setMobileOpen(false);
                    }}
                    className={`w-full flex items-center rounded-lg p-3 relative ${isCollapsed && !isMobile ? "justify-center" : "justify-start"}`}
                    whileHover={{
                      backgroundColor: currentColors.hover,
                      scale: 1.02
                    }}
                    animate={{
                      backgroundColor: isActive ? currentColors.active : "transparent",
                      color: isActive ? "#ffffff" : "#4b5563"
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className={isActive ? "text-white" : currentColors.textAccent}>
                      {item.icon}
                    </span>
                    
                    <AnimatePresence>
                      {(!isCollapsed || (isMobile && mobileOpen)) && (
                        <motion.span 
                          className="ml-3 font-medium text-sm"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    
                    {item.badge && (!isCollapsed || (isMobile && mobileOpen)) && (
                      <motion.span 
                        className={`absolute right-2 ${currentColors.bgAccent} text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold`}
                        initial={fadeIn.hidden}
                        animate={fadeIn.visible}
                        exit={fadeIn.hidden}
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </motion.button>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-200">
          <motion.button 
            className={`w-full bg-white ${currentColors.textAccent} ${currentColors.borderAccent} border p-3 rounded-lg flex items-center ${isCollapsed && !isMobile ? "justify-center" : "justify-center gap-2"} hover:bg-gray-50`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
          >
            <LogOut size={18} />
            <AnimatePresence>
              {(!isCollapsed || (isMobile && mobileOpen)) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      {/* Main content spacer */}
      <div 
        className={`transition-all duration-300 ease-in-out`}
        style={{
          marginLeft: isMobile ? 0 : (isCollapsed ? '72px' : '240px')
        }}
      />
    </>
  );
};

export default Navbar;