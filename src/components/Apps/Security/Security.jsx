import React from 'react';

const techStack = [
  { name: 'React', icon: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#61DAFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="4" ry="10"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>
  ) },
  { name: 'Node.js', icon: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8CC84B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l10 6v8c0 1.1-.9 2-2 2h-2v-2h2V8.6l-8-4.6-8 4.6V18h2v2H4c-1.1 0-2-.9-2-2V8l10-6z"/></svg>
  ) },
  { name: 'TailwindCSS', icon: (
    <svg width="32" height="32" viewBox="0 0 48 48" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 24c4-8 8-12 16-12s12 4 16 12"/><path d="M12 24c4 8 8 12 16 12s12-4 16-12"/></svg>
  ) },
  { name: 'Framer Motion', icon: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M7 7h10v10H7z"/></svg>
  ) },
  { name: 'MongoDB', icon: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#47A248" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M12 2c-4 4-6 8-6 12s2 8 6 8 6-4 6-8-2-8-6-12z"/></svg>
  ) },
];

const securityInfo = [
  'JWT Auth, OAuth2, and session management',
  'Input validation & sanitization',
  'Rate limiting & brute-force protection',
  'HTTPS, CORS, and secure headers',
  'Environment variable & secret management',
  'OWASP Top 10 best practices',
];

const Security = () => {
  return (
    <div className="flex flex-col gap-8 p-4">
      <div>
        <h2 className="text-accent text-lg font-bold mb-2">Tech Stack</h2>
        <div className="flex flex-wrap gap-6">
          {techStack.map(tech => (
            <div key={tech.name} className="flex flex-col items-center">
              <div className="bg-glass rounded-full p-3 mb-1 border border-white/10 shadow-glass">
                {tech.icon}
              </div>
              <span className="text-white/80 text-xs mt-1">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-accent text-lg font-bold mb-2">Security Practices</h2>
        <ul className="list-disc list-inside space-y-1 text-white/80 text-sm">
          {securityInfo.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Security; 