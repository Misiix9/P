import React, { useEffect } from 'react';
import { motion as Motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 40 },
};

const Notification = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={`fixed bottom-8 right-8 z-[9999] px-6 py-3 rounded-xl shadow-glass border border-white/10 bg-glass backdrop-blur-md text-white/90 font-semibold text-base flex items-center gap-2 ${type === 'success' ? 'text-green-400' : type === 'error' ? 'text-red-400' : 'text-accent'}`}
      style={{ pointerEvents: 'auto' }}
    >
      {message}
      <button onClick={onClose} className="ml-3 text-white/60 hover:text-white/90">&times;</button>
    </Motion.div>
  );
};

export default Notification; 