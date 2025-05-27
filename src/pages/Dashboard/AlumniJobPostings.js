import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Navbar from '../../components/shared/Navbar';
import { Briefcase, Building2, MapPin, Clock, X, Edit2, Trash2, ArrowUp, BarChart2, Users, Calendar, CheckCircle } from 'lucide-react';
import { Tooltip } from 'react-tooltip';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    } 
  },
  hover: {
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
  }
};

const statsVariants = {
  hidden: { opacity: 0 },
  visible: (i) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5
    }
  })
};

const AlumniJobPostings = () => {
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    posted: '1 day ago',
    logo: '',
    description: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [editJobId, setEditJobId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/jobs/`);
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const jobData = {
      ...formData,
      posted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  
    try {
      const url = editMode
        ? `${process.env.REACT_APP_BACKEND_URL}/api/jobs/${editJobId}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/jobs/`;
  
      const method = editMode ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
  
      if (response.ok) {
        const updatedJob = await response.json();
  
        if (editMode) {
          setJobs(jobs.map((job) => (job._id === editJobId ? updatedJob : job)));
        } else {
          setJobs([updatedJob, ...jobs]);
        }
  
        setFormData({
          title: '',
          company: '',
          location: '',
          type: 'Full-time',
          salary: '',
          posted: '1 day ago',
          logo: '',
          description: ''
        });
        setEditMode(false);
        setEditJobId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };
  
  const handleDelete = async (jobId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setJobs(jobs.filter(job => job._id !== jobId));
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const calculateApplicationStats = () => {
    const total = jobs.reduce((sum, job) => sum + (job.applications || 0), 0);
    const shortlisted = Math.floor(total * 0.3);
    const interviews = Math.floor(total * 0.1);
    const hired = Math.floor(total * 0.05);
    
    return {
      total,
      shortlisted,
      interviews,
      hired,
      avgPerJob: jobs.length > 0 ? (total / jobs.length).toFixed(1) : 0
    };
  };

  const applications = calculateApplicationStats();

  const toggleJobExpand = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex-none">
        <Navbar type="alumni" />
      </div>
      <main className="flex-1 p-6 lg:p-8 ml-0 md:ml-64">
        {/* Animated Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            💼 Alumni Job Portal
          </h1>
          <p className="text-gray-600">
            Connect with talented students by posting job opportunities
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: <Briefcase className="w-6 h-6" />, value: jobs.length, label: "Active Jobs", color: "bg-blue-100 text-blue-600" },
            { icon: <Users className="w-6 h-6" />, value: applications.total, label: "Total Applications", color: "bg-green-100 text-green-600" },
            { icon: <CheckCircle className="w-6 h-6" />, value: applications.shortlisted, label: "Shortlisted", color: "bg-purple-100 text-purple-600" },
            { icon: <BarChart2 className="w-6 h-6" />, value: applications.avgPerJob, label: "Avg. per Job", color: "bg-amber-100 text-amber-600" }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={statsVariants}
              className={`p-4 rounded-xl ${stat.color} shadow-sm`}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-white bg-opacity-50 mr-3">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Post New Job Button */}
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800">Your Job Listings</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            onClick={() => {
              setShowForm(!showForm);
              setEditMode(false);
              setEditJobId(null);
            }}
          >
            {showForm ? (
              <>
                <X size={18} /> Cancel
              </>
            ) : (
              <>
                <Briefcase size={18} /> Post New Job
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Job Posting Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {editMode ? "Edit Job Posting" : "Create New Job Posting"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. Software Engineer"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. Tech Corp Inc."
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. San Francisco, CA or Remote"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Type *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Salary Range *
                      </label>
                      <input
                        type="text"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        placeholder="e.g. $80,000 - $120,000 per year"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Logo URL
                      </label>
                      <input
                        type="text"
                        name="logo"
                        value={formData.logo}
                        onChange={handleInputChange}
                        placeholder="https://example.com/logo.png"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the job responsibilities, requirements, and benefits..."
                    required
                  />
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                  >
                    {editMode ? "Update Job" : "Post Job"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Job Listings Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <motion.div 
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{ 
              visible: { 
                transition: { 
                  staggerChildren: 0.15,
                  delayChildren: 0.2
                } 
              } 
            }}
          >
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <motion.div 
                  key={job._id} 
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {job.logo ? (
                          <img 
                            src={job.logo} 
                            alt={`${job.company} logo`} 
                            className="w-14 h-14 rounded-lg object-contain border border-gray-200"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-blue-600" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-xl text-gray-800">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-gray-600 mt-1">
                            <div className="flex items-center">
                              <Building2 className="w-4 h-4 mr-1" />
                              <span>{job.company}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="w-4 h-4 mr-1" />
                              <span>{job.type}</span>
                            </div>
                            <div className="flex items-center text-green-600 font-medium">
                              <span>{job.salary}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                          onClick={() => {
                            setFormData(job);
                            setEditMode(true);
                            setEditJobId(job._id);
                            setShowForm(true);
                          }}
                          data-tooltip-id="edit-tooltip"
                          data-tooltip-content="Edit Job"
                        >
                          <Edit2 size={18} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          onClick={() => handleDelete(job._id)}
                          data-tooltip-id="delete-tooltip"
                          data-tooltip-content="Delete Job"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-full"
                          onClick={() => toggleJobExpand(job._id)}
                          data-tooltip-id="expand-tooltip"
                          data-tooltip-content={expandedJobId === job._id ? "Collapse" : "Expand"}
                        >
                          <ArrowUp 
                            size={18} 
                            className={`transition-transform ${expandedJobId === job._id ? 'rotate-180' : ''}`}
                          />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Posted {job.posted}</span>
                      </div>
                      {job.applications > 0 && (
                        <div className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                          {job.applications} application{job.applications !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {expandedJobId === job._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6 pt-0 border-t border-gray-100"
                      >
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-800 mb-2">Job Description</h4>
                          <p className="text-gray-600 whitespace-pre-line">
                            {job.description || "No description provided."}
                          </p>
                        </div>
                        <div className="mt-6">
                          <h4 className="font-semibold text-gray-800 mb-2">Application Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm text-blue-600">Total Applications</p>
                              <p className="text-xl font-bold">{job.applications || 0}</p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg">
                              <p className="text-sm text-purple-600">Shortlisted</p>
                              <p className="text-xl font-bold">{Math.floor((job.applications || 0) * 0.3)}</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                              <p className="text-sm text-green-600">Interviews</p>
                              <p className="text-xl font-bold">{Math.floor((job.applications || 0) * 0.1)}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={cardVariants}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center"
              >
                <Briefcase className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Job Postings Yet</h3>
                <p className="text-gray-500 mb-6">
                  You haven't posted any jobs yet. Click the button below to create your first job posting.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
                  onClick={() => setShowForm(true)}
                >
                  Post Your First Job
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        <Tooltip id="edit-tooltip" place="top" effect="solid" />
        <Tooltip id="delete-tooltip" place="top" effect="solid" />
        <Tooltip id="expand-tooltip" place="top" effect="solid" />
      </main>
    </div>
  );
};

export default AlumniJobPostings;