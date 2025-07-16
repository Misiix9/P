import React, { useRef, useEffect, useState } from 'react';
import { motion as Motion, useDragControls } from 'framer-motion';
import { playOpen, playClose, playNotification } from '../../assets/sounds';

// Window control icons (SVG)
const MinimizeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="19" x2="19" y2="19"/></svg>
);
const MaximizeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

/**
 * Window component
 * @param {Object} props
 * @param {string} props.title - Window title
 * @param {boolean} props.minimized
 * @param {boolean} props.maximized
 * @param {number} props.z - z-index
 * @param {function} props.onMinimize
 * @param {function} props.onMaximize
 * @param {function} props.onClose
 * @param {function} props.onFocus
 * @param {React.ReactNode} props.children - Window content
 */
const MIN_WIDTH = 320;
const MIN_HEIGHT = 220;
const MAX_WIDTH = 900;
const MAX_HEIGHT = 700;

const Window = ({
  title,
  minimized,
  maximized,
  z,
  onMinimize,
  onMaximize,
  onClose,
  onFocus,
  children,
  ...props
}) => {
  const dragControls = useDragControls();
  const windowRef = useRef(null);
  const [size, setSize] = useState({ width: 480, height: 380 });
  const [resizing, setResizing] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0, width: 480, height: 380 });

  useEffect(() => {
    playOpen();
    return () => playClose();
  }, []);

  // Reset size on maximize
  useEffect(() => {
    if (maximized) {
      setSize({ width: '90vw', height: '80vh' });
    } else {
      setSize({ width: 480, height: 380 });
    }
  }, [maximized]);

  // Handle resize drag
  const handleResizeStart = (e) => {
    e.stopPropagation();
    setResizing(true);
    setStart({
      x: e.clientX,
      y: e.clientY,
      width: windowRef.current.offsetWidth,
      height: windowRef.current.offsetHeight,
    });
    document.body.style.cursor = 'nwse-resize';
  };
  useEffect(() => {
    if (!resizing) return;
    const handleMove = (e) => {
      const newWidth = Math.min(
        Math.max(start.width + (e.clientX - start.x), MIN_WIDTH),
        MAX_WIDTH
      );
      const newHeight = Math.min(
        Math.max(start.height + (e.clientY - start.y), MIN_HEIGHT),
        MAX_HEIGHT
      );
      setSize({ width: newWidth, height: newHeight });
    };
    const handleUp = () => {
      setResizing(false);
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [resizing, start]);

  // Window animation variants
  const variants = {
    initial: { opacity: 0, scale: 0.92, y: 40 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.92, y: 40 },
  };

  if (minimized) return null;

  return (
    <Motion.div
      ref={windowRef}
      className={`fixed left-1/2 top-1/2 bg-glass backdrop-blur-md rounded-xl shadow-glass border border-white/10 flex flex-col overflow-hidden select-none`}
      style={{
        zIndex: z,
        width: size.width,
        height: size.height,
        x: '-50%',
        y: '-50%',
      }}
      tabIndex={0}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ type: 'spring', stiffness: 180, damping: 20 }}
      drag
      dragControls={dragControls}
      dragListener={false}
      onPointerDown={onFocus}
      {...props}
    >
      {/* Titlebar */}
      <Motion.div
        whileHover={{ backgroundColor: 'rgba(20,22,28,0.95)' }}
        className="flex items-center justify-between px-4 py-2 bg-taskbar/80 cursor-move border-b border-white/10"
        onPointerDown={e => {
          dragControls.start(e);
          onFocus && onFocus();
        }}
      >
        <span className="font-semibold text-white/90 text-sm tracking-wide drop-shadow">{title}</span>
        <div className="flex items-center gap-2">
          <button onClick={onMinimize} className="hover:bg-white/10 rounded p-1" aria-label="Minimize"><MinimizeIcon /></button>
          <button onClick={() => { onMaximize(); playNotification(); }} className="hover:bg-white/10 rounded p-1" aria-label="Maximize"><MaximizeIcon /></button>
          <button onClick={onClose} className="hover:bg-red-500/60 rounded p-1" aria-label="Close"><CloseIcon /></button>
        </div>
      </Motion.div>
      {/* Window Content */}
      <div className="flex-1 p-4 overflow-auto">
        {children}
      </div>
      {/* Resize handle */}
      {!maximized && (
        <div
          onMouseDown={handleResizeStart}
          className="absolute right-1 bottom-1 w-5 h-5 cursor-nwse-resize z-50 flex items-end justify-end"
          style={{ userSelect: 'none' }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#00ffd0" strokeWidth="2"><polyline points="4,16 16,16 16,4" /></svg>
        </div>
      )}
    </Motion.div>
  );
};

export default Window; 