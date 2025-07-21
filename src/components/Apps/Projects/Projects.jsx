import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, 
  Github, 
  Play, 
  Code2, 
  Globe, 
  Star,
  Calendar,
  Users,
  Zap,
  Monitor,
  Smartphone,
  Database,
  Server,
  Palette,
  Layers,
  Award,
  TrendingUp,
  X
} from 'lucide-react';
import { playClick, playSuccess } from '../../../utils/soundManager';
import { useNotificationStore } from '../../../stores/useStore';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('all');
  const addNotification = useNotificationStore((state) => state.addNotification);

  const projects = [
    {
      id: 1,
      title: 'Portfolio Desktop OS',
      description: 'A fully functional desktop environment that simulates a complete operating system in the browser. Features advanced window management, 12 working applications, and professional UI/UX design.',
      longDescription: 'This project represents the pinnacle of web-based desktop simulation. Built with React 19 and modern web technologies, it features a complete window management system with snapping, split-screen functionality, context menus, and keyboard shortcuts. The system includes 12 fully functional applications including a web browser, text editor, calculator, image gallery, music player, and system settings. The UI uses advanced glass morphism effects, smooth animations with Framer Motion, and a comprehensive sound system.',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxMTI3NEUiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMUUxQjRCIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3QgeD0iNTAiIHk9IjUwIiB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiByeD0iMTAiLz4KPHN2ZyB4PSIxODAiIHk9IjEwNSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwZmZkMCIgc3Ryb2tlLXdpZHRoPSIyIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIi8+PC9zdmc+CjwvU3ZnPg==',
      technologies: ['React 19', 'Zustand', 'Framer Motion', 'Tailwind CSS', 'Howler.js', 'Lucide Icons'],
      category: 'Frontend',
      status: 'completed',
      featured: true,
      github: '#',
      live: '#',
      date: '2024',
      team: 'Solo Project',
      duration: '2 weeks',
      highlights: [
        '12 working applications with full functionality',
        'Advanced window management with snapping',
        'Professional boot sequence animation',
        'Comprehensive sound system integration',
        'Modern state management with Zustand'
      ]
    },
    {
      id: 2,
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with modern design, payment integration, and comprehensive admin dashboard for managing products and orders.',
      longDescription: 'A complete e-commerce platform built with React and Node.js, featuring user authentication, product catalog, shopping cart, payment processing with Stripe, order management, and admin dashboard. The platform includes advanced search and filtering, real-time inventory management, and responsive design for optimal mobile experience.',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MikiLz4KPHN2ZyB4PSIxODAiIHk9IjEwNSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwZmZkMCIgc3Ryb2tlLXdpZHRoPSIyIj48cGF0aCBkPSJNOSA3aDE2TDE1IDIxSDlWNyIvPjwvc3ZnPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDIiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMjIyMjc3Ii8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzExMjI1NSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjwvU3ZnPg==',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe', 'JWT'],
      category: 'Full Stack',
      status: 'completed',
      featured: true,
      github: '#',
      live: '#',
      date: '2023',
      team: 'Solo Project',
      duration: '6 weeks',
      highlights: [
        'Complete payment processing with Stripe',
        'Real-time inventory management',
        'Advanced search and filtering',
        'Comprehensive admin dashboard',
        'Mobile-responsive design'
      ]
    },
    {
      id: 3,
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, team collaboration features, and advanced project tracking capabilities.',
      longDescription: 'A comprehensive task management solution designed for team collaboration. Features include real-time updates using WebSockets, drag-and-drop task organization, project timeline visualization, team member assignment, file attachments, and detailed progress tracking. The application supports multiple project templates and integrates with calendar systems.',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MykiLz4KPHN2ZyB4PSIxODAiIHk9IjEwNSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwZmZkMCIgc3Ryb2tlLXdpZHRoPSIyIj48cGF0aCBkPSJtOSAxMSAzIDNMNSAyMiIvPjwvc3ZnPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDMiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMjQyNDQ0Ii8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzExMTEzMyIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjwvU3ZnPg==',
      technologies: ['Vue.js', 'Firebase', 'Vuetify', 'WebSockets', 'PWA'],
      category: 'Frontend',
      status: 'completed',
      featured: false,
      github: '#',
      live: '#',
      date: '2023',
      team: '3 developers',
      duration: '4 weeks',
      highlights: [
        'Real-time collaboration with WebSockets',
        'Drag-and-drop task organization',
        'Project timeline visualization',
        'Progressive Web App features',
        'Calendar system integration'
      ]
    },
    {
      id: 4,
      title: 'AI-Powered Analytics Dashboard',
      description: 'A data visualization platform with machine learning insights, real-time analytics, and customizable dashboard widgets for business intelligence.',
      longDescription: 'An advanced analytics platform that combines data visualization with AI-powered insights. Features include custom dashboard creation, real-time data streaming, machine learning model integration for predictive analytics, automated report generation, and interactive charts and graphs. The platform supports multiple data sources and provides actionable business intelligence.',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSJ1cmwoI2dyYWRpZW50NCkiLz4KPHN2ZyB4PSIxODAiIHk9IjEwNSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwZmZkMCIgc3Ryb2tlLXdpZHRoPSIyIj48cG9seWxpbmUgcG9pbnRzPSIyMiAxMiAxOCA3IDE0LjUgMTEgMTMgMTciLz48L3N2Zz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQ0Ij4KPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzMzMTEzMyIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyMjE5MzkiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4=',
      technologies: ['Python', 'TensorFlow', 'React', 'D3.js', 'PostgreSQL', 'Docker'],
      category: 'Full Stack',
      status: 'in-progress',
      featured: true,
      github: '#',
      live: '#',
      date: '2024',
      team: '5 developers',
      duration: '12 weeks',
      highlights: [
        'Machine learning integration',
        'Real-time data processing',
        'Custom dashboard widgets',
        'Automated report generation',
        'Multi-source data integration'
      ]
    }
  ];

  const categories = ['all', 'Frontend', 'Full Stack', 'Mobile', 'AI/ML'];
  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  const handleProjectClick = (project) => {
    playClick();
    setSelectedProject(project);
  };

  const handleLinkClick = (type, project) => {
    playSuccess();
    addNotification({
      message: `Opening ${project.title} ${type === 'github' ? 'repository' : 'live demo'}`,
      type: 'success'
    });
  };

  const ProjectCard = ({ project }) => (
    <motion.div
      className="bg-glass-dark rounded-xl overflow-hidden border border-white/10 hover:border-accent/30 cursor-pointer group transition-all"
      onClick={() => handleProjectClick(project)}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="relative overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {project.featured && (
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-1 bg-accent/20 text-accent px-2 py-1 rounded-full text-xs font-medium">
              <Star className="w-3 h-3" />
              Featured
            </div>
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            project.status === 'completed' 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {project.status === 'completed' ? 'Completed' : 'In Progress'}
          </div>
        </div>
        
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-lg mb-1">{project.title}</h3>
          <p className="text-white/80 text-sm line-clamp-2">{project.description}</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-3">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded">
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-white/60 text-xs">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {project.date}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {project.team}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLinkClick('github', project);
              }}
              className="p-1 hover:bg-white/10 rounded transition"
              title="View on GitHub"
            >
              <Github className="w-4 h-4 text-white/60 hover:text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLinkClick('live', project);
              }}
              className="p-1 hover:bg-white/10 rounded transition"
              title="View live demo"
            >
              <ExternalLink className="w-4 h-4 text-white/60 hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="h-full flex flex-col bg-black/5">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-black/10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Code2 className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-white">Projects</h2>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                playClick();
                setFilter(category);
              }}
              className={`px-3 py-1 rounded-lg text-sm transition ${
                filter === category
                  ? 'bg-accent text-black font-medium'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
            >
              {category === 'all' ? 'All Projects' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 overflow-auto scrollbar-glass p-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
          layout
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-glass backdrop-blur-lg rounded-xl border border-white/20 max-w-4xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedProject.title}</h2>
                    <p className="text-white/80">{selectedProject.longDescription}</p>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Key Highlights</h3>
                    <ul className="space-y-2">
                      {selectedProject.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2 text-white/80">
                          <Award className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-white/80">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Completed: {selectedProject.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">Team: {selectedProject.team}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">Duration: {selectedProject.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleLinkClick('github', selectedProject)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                  >
                    <Github className="w-4 h-4" />
                    <span className="text-white">View Code</span>
                  </button>
                  <button
                    onClick={() => handleLinkClick('live', selectedProject)}
                    className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 text-black rounded-lg transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;