import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { playHover, playClick } from '../../utils/soundManager';

// Icon mapping
const iconMap = {
  Monitor: LucideIcons.Monitor,
  Trash2: LucideIcons.Trash2,
  Terminal: LucideIcons.Terminal,
  Shield: LucideIcons.Shield,
  FileText: LucideIcons.FileText,
  Mail: LucideIcons.Mail,
  Globe: LucideIcons.Globe,
  Calculator: LucideIcons.Calculator,
  Edit: LucideIcons.Edit,
  Image: LucideIcons.Image,
  Music: LucideIcons.Music,
  Cloud: LucideIcons.Cloud,
  TrendingUp: LucideIcons.TrendingUp,
  Settings: LucideIcons.Settings,
  FolderOpen: LucideIcons.FolderOpen,
  Code: LucideIcons.Code,
  Code2: LucideIcons.Code2,
  Database: LucideIcons.Database
};

// Legacy type to icon mapping for backward compatibility
const typeIconMap = {
  computer: 'Monitor',
  trash: 'Trash2',
  terminal: 'Terminal',
  security: 'Shield',
  terms: 'FileText',
  contact: 'Mail',
  projects: 'Code2',
  browser: 'Globe',
  calculator: 'Calculator',
  notepad: 'Edit',
  gallery: 'Image',
  music: 'Music',
  weather: 'Cloud',
  stocks: 'TrendingUp',
  settings: 'Settings',
  folder: 'FolderOpen',
  code: 'Code',
  database: 'Database'
};

const DesktopIcon = ({ 
  type, 
  label, 
  onDoubleClick, 
  style,
  icon,
  ...motionProps 
}) => {
  // Get the appropriate icon
  const iconName = icon || typeIconMap[type] || 'Monitor';
  const IconComponent = iconMap[iconName];

  const handleMouseEnter = () => {
    playHover();
  };

  const handleClick = () => {
    playClick();
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center w-20 h-20 p-2 cursor-pointer select-none group"
      style={style}
      onDoubleClick={onDoubleClick}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      whileHover={{ 
        scale: 1.05,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      {...motionProps}
    >
      {/* Icon Background */}
      <motion.div
        className="relative w-12 h-12 mb-1 flex items-center justify-center rounded-xl bg-glass-dark backdrop-blur-sm border border-white/10 shadow-glass group-hover:shadow-glow transition-all duration-300"
        whileHover={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderColor: 'rgba(0, 255, 208, 0.3)',
        }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-accent/20 blur-lg"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Icon */}
        {IconComponent && (
          <IconComponent 
            className="w-6 h-6 text-white/90 group-hover:text-accent transition-colors duration-300 relative z-10" 
          />
        )}
      </motion.div>

      {/* Label */}
      <motion.span
        className="text-xs text-white/80 text-center font-medium drop-shadow-lg px-1 py-0.5 rounded bg-black/20 backdrop-blur-sm border border-white/5 max-w-16 truncate group-hover:text-white group-hover:bg-black/40 transition-all duration-300"
        initial={{ opacity: 0.8 }}
        whileHover={{ opacity: 1 }}
      >
        {label}
      </motion.span>

      {/* Selection highlight */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-accent/60 bg-accent/10"
        initial={{ opacity: 0 }}
        whileFocus={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};

export default DesktopIcon; 