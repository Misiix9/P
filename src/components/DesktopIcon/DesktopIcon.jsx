import React from 'react';
import { motion as Motion } from 'framer-motion';

// Example SVG icon (replace with custom icons as needed)
const icons = {
  computer: (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 20h8"/><path d="M12 16v4"/></svg>
  ),
  trash: (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
  ),
  terminal: (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
  ),
  security: (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  terms: (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>
  ),
  contact: (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
};

const DesktopIcon = ({ type, label, onDoubleClick, style, ...props }) => {
  return (
    <Motion.div
      drag
      dragMomentum={false}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.08, boxShadow: '0 0 16px #00ffd0, 0 8px 32px 0 rgba(31,38,135,0.37)' }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className="flex flex-col items-center cursor-pointer select-none w-20 group"
      style={style}
      tabIndex={0}
      onDoubleClick={onDoubleClick}
      {...props}
    >
      <div className="rounded-xl bg-glass backdrop-blur-md shadow-glass p-2 group-hover:bg-white/10 transition border border-white/10">
        {icons[type]}
      </div>
      <span className="mt-2 text-xs text-white/80 text-center group-hover:text-accent transition drop-shadow">
        {label}
      </span>
    </Motion.div>
  );
};

export default DesktopIcon; 