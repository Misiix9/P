import React, { useState, useRef, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const COMMANDS = {
  help: 'Available commands: about, help, projects, contact',
  about: 'Hi, I am Onxy, a passionate developer. Type projects to see my work.',
  projects: 'Projects: Portfolio, WebApp, API, ...',
  contact: 'Contact: onxy@example.com',
};

const PROMPT = 'user@portfolio:~$';

const Terminal = () => {
  const [lines, setLines] = useState([
    { type: 'output', text: 'Welcome to the Portfolio Terminal. Type help to get started.' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [lines]);

  const handleCommand = (cmd) => {
    setIsTyping(true);
    setTimeout(() => {
      setLines((prev) => [
        ...prev,
        { type: 'input', text: `${PROMPT} ${cmd}` },
        { type: 'output', text: COMMANDS[cmd] || `Command not found: ${cmd}` },
      ]);
      setIsTyping(false);
    }, 400);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      handleCommand(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-black/70 rounded-lg h-full w-full font-mono text-green-400 p-2 overflow-auto text-sm shadow-glass border border-white/10">
      <div className="space-y-1">
        {lines.map((line, i) => (
          <div key={i} className={line.type === 'input' ? 'text-accent' : ''}>
            {line.text}
          </div>
        ))}
        <AnimatePresence>
          {isTyping && (
            <Motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-block"
            >
              <span className="animate-pulse">|</span>
            </Motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center">
          <span className="text-accent mr-1">{PROMPT}</span>
          <input
            ref={inputRef}
            className="bg-transparent outline-none flex-1 text-green-400"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal; 