import React from 'react';

const folders = [
  { name: 'Portfolio', icon: (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>
  ) },
  { name: 'Projects', icon: (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
  ) },
  { name: 'Gallery', icon: (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
  ) },
  { name: 'Documents', icon: (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h7l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4z"/><polyline points="14 4 14 8 18 8"/></svg>
  ) },
];

const MyComputer = () => {
  return (
    <div className="grid grid-cols-2 gap-8 p-4">
      {folders.map(folder => (
        <div key={folder.name} className="flex flex-col items-center cursor-pointer group">
          <div className="rounded-xl bg-glass backdrop-blur-md shadow-glass p-4 group-hover:bg-white/10 transition border border-white/10">
            {folder.icon}
          </div>
          <span className="mt-2 text-sm text-white/80 text-center group-hover:text-accent transition drop-shadow">
            {folder.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MyComputer; 