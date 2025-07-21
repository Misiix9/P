import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Minus, Square, X, Maximize2, MoreHorizontal } from 'lucide-react';
import { playOpen, playClose } from '../../utils/soundManager';
import { useWindowStore } from '../../stores/useStore';
import WindowContextMenu from '../WindowContextMenu/WindowContextMenu';
import SnapZones from '../SnapZones/SnapZones';

const MIN_WIDTH = 320;
const MIN_HEIGHT = 220;
const MAX_WIDTH = window.innerWidth * 0.9;
const MAX_HEIGHT = window.innerHeight * 0.9;

const Window = ({
  id,
  title,
  minimized,
  maximized,
  position,
  size,
  z,
  onMinimize,
  onMaximize,
  onClose,
  onFocus,
  isActive,
  children,
  ...motionProps
}) => {
  const dragControls = useDragControls();
  const windowRef = useRef(null);
  const titleBarRef = useRef(null);
  
  // Window management store
  const { 
    snapWindow, 
    getSnapZone, 
    updateWindowPosition, 
    updateWindowSize,
    arrangeSplitScreen,
    cascadeWindows,
    tileWindows,
    restoreWindow,
    windows
  } = useWindowStore();

  // Local state
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [activeSnapZone, setActiveSnapZone] = useState(null);
  const [showSnapZones, setShowSnapZones] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  
  // Window dimensions
  const windowWidth = maximized ? window.innerWidth : (size?.width || 800);
  const windowHeight = maximized ? window.innerHeight - 64 : (size?.height || 600);
  const windowX = maximized ? 0 : (position?.x || 100);
  const windowY = maximized ? 48 : (position?.y || 100);

  // Sound effects
  useEffect(() => {
    playOpen();
    return () => playClose();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isActive) return;

      // Window management shortcuts
      if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        onClose();
      } else if (e.altKey && e.key === 'F9') {
        e.preventDefault();
        onMinimize();
      } else if (e.altKey && e.key === 'F10') {
        e.preventDefault();
        onMaximize();
      } else if (e.metaKey || e.ctrlKey) {
        // Snap shortcuts
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          snapWindow(id, 'left');
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          snapWindow(id, 'right');
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          snapWindow(id, 'top');
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          snapWindow(id, 'bottom');
        }
      } else if (e.ctrlKey && e.altKey) {
        // Window arrangement shortcuts
        if (e.key === 'c') {
          e.preventDefault();
          cascadeWindows();
        } else if (e.key === 't') {
          e.preventDefault();
          tileWindows();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, id, onClose, onMinimize, onMaximize, snapWindow, cascadeWindows, tileWindows]);

  // Context menu handlers
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY
    });
  }, []);

  const handleContextMenuAction = useCallback((action, ...args) => {
    switch (action) {
      case 'minimize':
        onMinimize();
        break;
      case 'maximize':
        onMaximize();
        break;
      case 'close':
        onClose();
        break;
      case 'restore':
        restoreWindow(id);
        break;
      case 'snap':
        snapWindow(id, args[0]);
        break;
      case 'splitScreen':
        const otherWindows = windows.filter(w => w.id !== id && !w.minimized);
        if (otherWindows.length > 0) {
          const targetWindow = args[1] === 'previous' 
            ? otherWindows[otherWindows.length - 1]
            : otherWindows[0];
          arrangeSplitScreen(id, targetWindow.id, args[0]);
        }
        break;
      case 'cascadeAll':
        cascadeWindows();
        break;
      case 'tileAll':
        tileWindows();
        break;
      case 'alwaysOnTop':
        // TODO: Implement always on top functionality
        break;
    }
  }, [id, onMinimize, onMaximize, onClose, restoreWindow, snapWindow, arrangeSplitScreen, windows, cascadeWindows, tileWindows]);

  // Drag handlers
  const handleDragStart = useCallback((event, info) => {
    if (!titleBarRef.current?.contains(event.target)) return false;
    
    setIsDragging(true);
    setShowSnapZones(true);
    onFocus();
    
    // If window is maximized, restore it first
    if (maximized) {
      onMaximize();
      // Adjust position to cursor
      const rect = windowRef.current.getBoundingClientRect();
      const offsetX = info.point.x - rect.left;
      const newX = info.point.x - (800 * (offsetX / rect.width));
      updateWindowPosition(id, { x: newX, y: info.point.y - 20 });
    }
  }, [id, maximized, onMaximize, onFocus, updateWindowPosition]);

  const handleDrag = useCallback((event, info) => {
    if (!isDragging) return;

    const { x, y } = info.point;
    const snapZone = getSnapZone(x, y);
    setActiveSnapZone(snapZone);
    
    // Update position in store
    updateWindowPosition(id, { x: info.offset.x, y: info.offset.y });
  }, [isDragging, id, getSnapZone, updateWindowPosition]);

  const handleDragEnd = useCallback((event, info) => {
    setIsDragging(false);
    setShowSnapZones(false);
    
    if (activeSnapZone) {
      snapWindow(id, activeSnapZone);
    }
    
    setActiveSnapZone(null);
  }, [id, activeSnapZone, snapWindow]);

  // Resize handlers
  const handleResizeStart = useCallback((e, direction) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    document.body.style.cursor = `${direction}-resize`;
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      const rect = windowRef.current.getBoundingClientRect();
      let newWidth = windowWidth;
      let newHeight = windowHeight;
      let newX = windowX;
      let newY = windowY;

      switch (resizeDirection) {
        case 'nw':
          newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, rect.right - e.clientX));
          newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, rect.bottom - e.clientY));
          newX = e.clientX;
          newY = e.clientY;
          break;
        case 'ne':
          newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, e.clientX - rect.left));
          newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, rect.bottom - e.clientY));
          newY = e.clientY;
          break;
        case 'sw':
          newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, rect.right - e.clientX));
          newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, e.clientY - rect.top));
          newX = e.clientX;
          break;
        case 'se':
          newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, e.clientX - rect.left));
          newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, e.clientY - rect.top));
          break;
      }

      updateWindowSize(id, { width: newWidth, height: newHeight });
      if (newX !== windowX || newY !== windowY) {
        updateWindowPosition(id, { x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection('');
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeDirection, id, windowWidth, windowHeight, windowX, windowY, updateWindowSize, updateWindowPosition]);

  // Don't render if minimized
  if (minimized) return null;

  return (
    <>
      <motion.div
        ref={windowRef}
        className={`fixed bg-glass backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl overflow-hidden select-none ${
          isActive ? 'ring-2 ring-accent/30' : ''
        }`}
        style={{ 
          zIndex: z,
          width: windowWidth,
          height: windowHeight,
          left: windowX,
          top: windowY
        }}
        drag={!maximized && !isResizing}
        dragControls={dragControls}
        dragMomentum={false}
        dragElastic={0}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onMouseDown={onFocus}
        onContextMenu={handleContextMenu}
        {...motionProps}
      >
        {/* Title Bar */}
        <div 
          ref={titleBarRef}
          className="flex items-center justify-between h-12 px-4 bg-black/20 border-b border-white/10 cursor-move"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <h3 className="text-white/90 font-medium truncate">{title}</h3>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              onClick={onMinimize}
              title="Minimize (Alt+F9)"
            >
              <Minus className="w-4 h-4 text-white/80" />
            </button>
            <button
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              onClick={onMaximize}
              title={maximized ? "Restore" : "Maximize (Alt+F10)"}
            >
              {maximized ? (
                <Square className="w-4 h-4 text-white/80" />
              ) : (
                <Maximize2 className="w-4 h-4 text-white/80" />
              )}
            </button>
            <button
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              onClick={handleContextMenu}
              title="More options"
            >
              <MoreHorizontal className="w-4 h-4 text-white/80" />
            </button>
            <button
              className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors"
              onClick={onClose}
              title="Close (Alt+F4)"
            >
              <X className="w-4 h-4 text-white/80" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden" style={{ height: 'calc(100% - 48px)' }}>
          {children}
        </div>

        {/* Resize Handles */}
        {!maximized && (
          <>
            {/* Corner handles */}
            <div
              className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
              onMouseDown={(e) => handleResizeStart(e, 'nw')}
            />
            <div
              className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
              onMouseDown={(e) => handleResizeStart(e, 'ne')}
            />
            <div
              className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
              onMouseDown={(e) => handleResizeStart(e, 'sw')}
            />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize bg-white/10 hover:bg-accent/30 rounded-tl-md transition-colors"
              onMouseDown={(e) => handleResizeStart(e, 'se')}
            />
          </>
        )}
      </motion.div>

      {/* Context Menu */}
      <WindowContextMenu
        isOpen={contextMenu.visible}
        position={{ x: contextMenu.x, y: contextMenu.y }}
        onClose={() => setContextMenu({ visible: false, x: 0, y: 0 })}
        onAction={handleContextMenuAction}
        windowData={{ maximized, minimized }}
        canSplitScreen={windows.filter(w => w.id !== id && !w.minimized).length > 0}
      />

      {/* Snap Zones */}
      <SnapZones
        isVisible={showSnapZones && isDragging}
        activeZone={activeSnapZone}
      />
    </>
  );
};

export default Window; 