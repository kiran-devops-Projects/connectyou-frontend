import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import Navbar from '../../components/shared/Navbar';
import axios from 'axios';
import { 
  FolderOpen, 
  Plus, 
  Clock, 
  X, 
  Star, 
  Users, 
  GitBranch, 
  Filter,
  Search,
  ChevronDown
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Break down into subcomponents
const ProjectCard = ({ project, variants }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <motion.div
      variants={variants}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden flex flex-col h-full border border-gray-200 dark:border-gray-700"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
    >
      <motion.div 
        className="h-1.5 bg-gradient-to-r from-blue-500 to-purple-600"
        animate={{ 
          background: isHovered 
            ? 'linear-gradient(to right, #3b82f6, #8b5cf6)' 
            : 'linear-gradient(to right, #3b82f6, #6366f1)'
        }}
      />
      
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-2">
            {project.title}
          </h3>
          <motion.div
            animate={{ rotate: isHovered ? 5 : 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <FolderOpen className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          </motion.div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {project.description}
        </p>
        
        {project.tech && project.tech.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.slice(0, 3).map((tech, index) => (
              <motion.span 
                key={index}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs rounded-full"
              >
                {tech}
              </motion.span>
            ))}
            {project.tech.length > 3 && (
              <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs rounded-full">
                +{project.tech.length - 3}
              </span>
            )}
          </div>
        )}
        
        {project.difficulty && (
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${getDifficultyColor(project.difficulty)}`}
          >
            {project.difficulty}
          </motion.span>
        )}
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <FolderOpen className="w-4 h-4" /> 
          <span>{project.category || 'General'}</span>
        </div>
        
        <div className="flex items-center gap-3">
          {project.contributors && (
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
              <Users className="w-3.5 h-3.5" /> 
              <span>{project.contributors}</span>
            </div>
          )}
          
          {project.stars && (
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
              <Star className="w-3.5 h-3.5 text-yellow-500" /> 
              <span>{project.stars}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
            <Clock className="w-3.5 h-3.5" /> 
            <span>
              {new Date(project.lastActive || project.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectFormModal = ({ showForm, setShowForm, formData, handleFormChange, handleFormSubmit }) => {
  return (
    <AnimatePresence>
      {showForm && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        >
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Add New Project</h2>
              <button 
                onClick={() => setShowForm(false)} 
                className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Title</label>
                <input 
                  name="title" 
                  placeholder="E.g., Alumni Network Platform" 
                  value={formData.title} 
                  onChange={handleFormChange} 
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea 
                  name="description" 
                  placeholder="A brief description of your project..." 
                  value={formData.description} 
                  onChange={handleFormChange} 
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleFormChange} 
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Blockchain">Blockchain</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                  <select 
                    name="difficulty" 
                    value={formData.difficulty} 
                    onChange={handleFormChange} 
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    <option value="">Select Difficulty</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Technologies (comma separated)</label>
                <input 
                  name="tech" 
                  placeholder="E.g., React, Node.js, MongoDB" 
                  value={formData.tech} 
                  onChange={handleFormChange} 
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contributors</label>
                  <input 
                    type="number" 
                    name="contributors" 
                    placeholder="E.g., 3" 
                    value={formData.contributors} 
                    onChange={handleFormChange} 
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stars</label>
                  <input 
                    type="number" 
                    name="stars" 
                    placeholder="E.g., 42" 
                    value={formData.stars} 
                    onChange={handleFormChange} 
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Active Date</label>
                <input 
                  type="date" 
                  name="lastActive" 
                  value={formData.lastActive} 
                  onChange={handleFormChange} 
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <motion.button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </motion.button>
                <motion.button 
                  type="submit" 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md"
                >
                  Add Project
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FilterSection = ({ showFilters, category, setCategory, search, setSearch, setShowFilters }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1 min-w-[160px]">
            <select
              className="appearance-none w-full px-4 py-3 pr-8 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Data Science">Data Science</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <button 
            onClick={() => setShowFilters(prev => !prev)}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition"
          >
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                <select className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                  <option value="">Any Difficulty</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                <select className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="stars">Most Stars</option>
                  <option value="contributors">Most Contributors</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tech Stack</label>
                <select className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                  <option value="">Any Technology</option>
                  <option value="react">React</option>
                  <option value="python">Python</option>
                  <option value="node">Node.js</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FeaturedProjectsCarousel = ({ projects }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  if (!projects || projects.length === 0) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Featured Projects</h3>
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={20}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 }
        }}
        autoplay={{ delay: 3000 }}
        navigation
        className="pb-8"
      >
        {projects.slice(0, 6).map((project) => (
          <SwiperSlide key={project._id}>
            <ProjectCard project={project} variants={{}} />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
};

const AlumniProjects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form modal states
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tech: '',
    difficulty: '',
    contributors: '',
    stars: '',
    lastActive: '',
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { category, search }
      });
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/projects`,
        {
          ...formData,
          tech: formData.tech.split(',').map(t => t.trim()),
          contributors: Number(formData.contributors),
          stars: Number(formData.stars),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        tech: '',
        difficulty: '',
        contributors: '',
        stars: '',
        lastActive: '',
      });
      fetchProjects();
    } catch (err) {
      console.error('Error adding project:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search, category]);

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar type="alumni" />

      <div className="w-full md:ml-64 p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Alumni Projects
              </span>
            </motion.h1>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-md"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-4 h-4" /> Add Project
            </motion.button>
          </div>

          <FilterSection 
            showFilters={showFilters} 
            setShowFilters={setShowFilters}
            category={category}
            setCategory={setCategory}
            search={search}
            setSearch={setSearch}
          />

          {projects.length > 3 && (
            <FeaturedProjectsCarousel projects={projects} />
          )}

          {/* Projects Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {projects.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center border border-gray-200 dark:border-gray-700"
                >
                  <div className="mx-auto mb-4 w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <FolderOpen className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No projects found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search or filters, or add a new project!</p>
                  <motion.button
                    onClick={() => setShowForm(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2 shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Add Your First Project
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  ref={ref}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  variants={{ 
                    visible: { 
                      transition: { staggerChildren: 0.1 } 
                    } 
                  }}
                >
                  {projects.map((project) => (
                    <ProjectCard 
                      key={project._id} 
                      project={project} 
                      variants={cardVariants}
                    />
                  ))}
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>

      <ProjectFormModal 
        showForm={showForm}
        setShowForm={setShowForm}
        formData={formData}
        handleFormChange={handleFormChange}
        handleFormSubmit={handleFormSubmit}
      />

      {/* Floating action button for mobile */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 md:hidden bg-blue-600 text-white p-4 rounded-full shadow-lg z-40"
        onClick={() => setShowForm(true)}
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default AlumniProjects;