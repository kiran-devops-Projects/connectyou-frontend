import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Search,
  Calendar,
  Bookmark,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import Navbar from '../../components/shared/Navbar';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Native Button Component with animation
const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick, 
  size = 'default',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700',
    secondary: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-100',
    ghost: 'hover:bg-gray-100 text-gray-600',
    outline: 'border border-gray-200 hover:bg-gray-100'
  };

  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10'
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Native Input Component
const Input = ({ className = '', ...props }) => (
  <motion.input
    className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    whileFocus={{ scale: 1.01 }}
    {...props}
  />
);

// Native Select Component
const Select = ({ children, value, onChange, className = '' }) => (
  <motion.select
    value={value}
    onChange={onChange}
    className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    whileHover={{ scale: 1.01 }}
  >
    {children}
  </motion.select>
);

// Native Badge Component with animation
const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-purple-100 text-purple-800',
    outline: 'border border-gray-200 text-gray-800',
    secondary: 'bg-gray-100 text-gray-800'
  };

  return (
    <motion.span 
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 ${variants[variant]} ${className}`}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500 }}
    >
      {children}
    </motion.span>
  );
};

// Animated Course Card Component
const CourseCard = ({ course, onEnroll, recommended = false, index }) => {
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleEnrollClick = (e) => {
    e.stopPropagation();
    setShowEnrollDialog(true);
  };

  const handleConfirmEnroll = async () => {
    await onEnroll(course.id);
    setShowEnrollDialog(false);
  };

  return (
    <motion.div
      ref={ref}
      className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all"
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <div className="relative">
        <motion.img 
          src={`${process.env.REACT_APP_BACKEND_URL}/${course.thumbnail}`}
          alt={course.title} 
          className="w-full h-48 object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        {recommended && (
          <Badge className="absolute top-4 left-4 bg-purple-600 text-white">
            Recommended
          </Badge>
        )}
        <Badge className="absolute top-4 right-4 bg-white text-purple-600">
          {course.level}
        </Badge>
        
        {/* Play button overlay */}
        {isHovered && (
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-full p-3"
              whileHover={{ scale: 1.1 }}
            >
              <Play className="w-6 h-6 text-purple-600 fill-purple-600" />
            </motion.div>
          </motion.div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">{course.category}</Badge>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {course.duration}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <motion.img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-6 h-6 rounded-full mr-2"
              whileHover={{ scale: 1.2 }}
            />
            <span className="text-sm text-gray-700">
              {course.instructor.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Users className="w-4 h-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-500">
                {course.enrolledCount}
              </span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">
                {course.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            className="flex-1"
            onClick={handleEnrollClick}
          >
            <Play className="w-4 h-4 mr-2" />
            {course.isEnrolled ? 'Continue' : 'Enroll Now'}
          </Button>
          <Button variant="outline" size="icon">
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showEnrollDialog && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg max-w-md w-full p-6"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h2 className="text-xl font-semibold mb-4">Enroll in {course.title}</h2>
              <p className="text-gray-600 mb-6">
                This course will take approximately {course.duration} to complete. 
                You'll have lifetime access to the course content.
              </p>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowEnrollDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleConfirmEnroll}>
                  Enroll Now
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Animated Section Heading
const SectionHeading = ({ title, subtitle, buttonText, onButtonClick }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      className="flex items-center justify-between mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {buttonText && (
        <Button 
          variant="ghost" 
          className="text-purple-600"
          onClick={onButtonClick}
        >
          {buttonText}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      )}
    </motion.div>
  );
};

// Animated Hero Section
const HeroSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          ref={ref}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.div 
            className="flex-1"
            variants={textVariants}
          >
            <motion.h1 
              className="text-4xl font-bold mb-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Expand Your Knowledge
            </motion.h1>
            <motion.p 
              className="text-purple-100 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Learn from industry experts and advance your career
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-4"
            variants={textVariants}
          >
            <Button variant="secondary">
              <Calendar className="w-5 h-5 mr-2" />
              Learning Plan
            </Button>
            <Button variant="secondary">
              <Bookmark className="w-5 h-5 mr-2" />
              Saved Courses
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// Animated Filter Section
const FilterSection = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  selectedLevel, 
  setSelectedLevel,
  categories,
  levels
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      className="bg-white border-b sticky top-0 z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-[180px]"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </Select>
            
            <Select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-[180px]"
            >
              {levels.map(level => (
                <option key={level.id} value={level.id}>
                  {level.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Course Carousel Component
const CourseCarousel = ({ courses, title, onEnroll, recommended = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % Math.ceil(courses.length / 3));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + Math.ceil(courses.length / 3)) % Math.ceil(courses.length / 3));
  };

  const visibleCourses = courses.slice(currentIndex * 3, currentIndex * 3 + 3);

  return (
    <motion.div 
      ref={ref}
      className="mb-12"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      <SectionHeading 
        title={title}
        buttonText={courses.length > 3 ? "View All" : null}
      />
      
      <div className="relative">
        {courses.length > 3 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 bg-white rounded-full p-2 shadow-md z-10"
            >
              <ChevronLeft className="w-5 h-5 text-purple-600" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 bg-white rounded-full p-2 shadow-md z-10"
            >
              <ChevronRight className="w-5 h-5 text-purple-600" />
            </button>
          </>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {visibleCourses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={onEnroll}
                recommended={recommended}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const ELearningPage = () => {
  const [courses, setCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All Courses' },
    { id: 'development', label: 'Development' },
    { id: 'design', label: 'Design' },
    { id: 'business', label: 'Business' }
  ];

  const levels = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        // Fetching courses
        const coursesResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/courses`);
        if (!coursesResponse.ok) {
          throw new Error('Failed to fetch courses');
        }
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);
  
        // Fetching course recommendations
        const recommendationsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/courses/recommended`);
        if (!recommendationsResponse.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const recommendationsData = await recommendationsResponse.json();
        setRecommendedCourses(recommendationsData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [selectedCategory, selectedLevel, searchTerm]);
  
  const handleEnroll = async (courseId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (!response.ok) throw new Error('Failed to enroll');
  
      const updatedCourse = await response.json();
      
      // Update the course in both courses and recommendedCourses arrays
      setCourses(prev => prev.map(c => 
        c.id === updatedCourse.id ? updatedCourse : c
      ));
      setRecommendedCourses(prev => prev.map(c => 
        c.id === updatedCourse.id ? updatedCourse : c
      ));
      
      setSelectedCourse(updatedCourse);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  // Scroll animations
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.98]);

  return (
    <motion.div 
      className="flex min-h-screen"
      style={{ opacity, scale }}
    >
      <div className="flex-none">
        <Navbar type="student" />
      </div>
      <div className="flex-1 ml-64">
        <HeroSection />
        
        <FilterSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          categories={categories}
          levels={levels}
        />
    
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <motion.div 
              className="flex justify-center items-center h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="rounded-full h-12 w-12 border-b-2 border-purple-600"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </motion.div>
          ) : (
            <>
              {recommendedCourses.length > 0 && (
                <CourseCarousel 
                  courses={recommendedCourses} 
                  title="Recommended for You"
                  onEnroll={handleEnroll}
                  recommended
                />
              )}
              
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <SectionHeading title="All Courses" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course, index) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onEnroll={handleEnroll}
                      index={index}
                    />
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </main>
      </div>
    </motion.div>
  );
};

export default ELearningPage;