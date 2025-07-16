import './App.css';
import Taskbar from './components/Taskbar/Taskbar';
import DesktopIcon from './components/DesktopIcon/DesktopIcon';
import Window from './components/Window/Window';
import React, { useReducer, useState, useCallback, useEffect } from 'react';
import { windowReducer, initialWindows } from './utils/windowManager';
import MyComputer from './components/Apps/MyComputer/MyComputer';
import Trash from './components/Apps/Trash/Trash';
import Terminal from './components/Apps/Terminal/Terminal';
import Security from './components/Apps/Security/Security';
import Terms from './components/Apps/Terms/Terms';
import Contact from './components/Apps/Contact/Contact';
import Notification from './components/Notification';
import BottomTaskbar from './components/Taskbar/BottomTaskbar';

const desktopIcons = [
  { type: 'computer', label: 'My Computer', id: 'computer' },
  { type: 'trash', label: 'Trash', id: 'trash' },
  { type: 'terminal', label: 'Terminal', id: 'terminal' },
  { type: 'security', label: 'Security', id: 'security' },
  { type: 'terms', label: 'Terms & Services', id: 'terms' },
  { type: 'contact', label: 'Contact', id: 'contact' },
];

const windowTitles = {
  computer: 'My Computer',
  trash: 'Trash',
  terminal: 'Terminal',
  security: 'Security',
  terms: 'Terms & Services',
  contact: 'Contact',
};

const GRID_SIZE = 120;
const GRID_GAP = 32;
const GRID_COLS = 3;

function App() {
  const [windows, dispatch] = useReducer(windowReducer, initialWindows);
  const [notification, setNotification] = useState(null);
  const [iconPositions, setIconPositions] = useState({});
  const [activeId, setActiveId] = useState(null);

  // Load icon positions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('desktopIconPositions');
    if (saved) setIconPositions(JSON.parse(saved));
  }, []);

  // Save icon positions to localStorage
  useEffect(() => {
    localStorage.setItem('desktopIconPositions', JSON.stringify(iconPositions));
  }, [iconPositions]);

  // Notification helper
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
  }, []);

  // Handle Start Menu shortcut
  const handleStartMenuShortcut = (id) => {
    if (id === 'computer' || id === 'terminal' || id === 'contact') {
      dispatch({
        type: 'OPEN_WINDOW',
        payload: {
          id,
          title: windowTitles[id] || id.charAt(0).toUpperCase() + id.slice(1),
          type: id,
        },
      });
      showNotification(`${windowTitles[id] || id} opened`, 'info');
    } else if (id === 'projects' || id === 'settings') {
      showNotification('This feature is coming soon!', 'info');
    }
  };

  // Open window on icon double-click
  const handleIconDoubleClick = (icon) => {
    dispatch({
      type: 'OPEN_WINDOW',
      payload: {
        id: icon.id,
        title: windowTitles[icon.id],
        type: icon.type,
      },
    });
    showNotification(`${icon.label} opened`, 'info');
  };

  // Snap to grid logic
  const getGridPosition = (i) => {
    const col = i % GRID_COLS;
    const row = Math.floor(i / GRID_COLS);
    return {
      x: col * (GRID_SIZE + GRID_GAP) + 40,
      y: row * (GRID_SIZE + GRID_GAP) + 40,
    };
  };

  const handleIconDragEnd = (id, event, info) => {
    // Snap to grid cell under the mouse pointer
    const pointerX = info.point.x;
    const pointerY = info.point.y;
    // Subtract desktop offset (40px padding)
    const x = pointerX - 40;
    const y = pointerY - 40;
    const col = Math.max(0, Math.round(x / (GRID_SIZE + GRID_GAP)));
    const row = Math.max(0, Math.round(y / (GRID_SIZE + GRID_GAP)));
    setIconPositions(pos => ({
      ...pos,
      [id]: {
        x: col * (GRID_SIZE + GRID_GAP) + 40,
        y: row * (GRID_SIZE + GRID_GAP) + 40,
      },
    }));
  };

  // Minimize/restore logic for BottomTaskbar
  const handleTaskbarClick = (win) => {
    if (win.minimized) {
      setActiveId(win.id);
      dispatch({ type: 'MINIMIZE_WINDOW', payload: { id: win.id, minimized: false } });
      dispatch({ type: 'FOCUS_WINDOW', payload: { id: win.id } });
    } else {
      dispatch({ type: 'MINIMIZE_WINDOW', payload: { id: win.id, minimized: true } });
    }
  };

  // Notification close handler
  const handleNotificationClose = () => setNotification(null);

  return (
    <div className="min-h-screen w-full bg-[#181a20]">
      {/* Taskbar at the top */}
      <Taskbar onStartMenuShortcut={handleStartMenuShortcut} />
      {/* Desktop area: absolutely positioned icons, snap to grid */}
      <div className="pt-16 px-8 pb-4 min-h-[calc(100vh-3rem)] relative" style={{ minHeight: 'calc(100vh - 3rem)' }}>
        {desktopIcons.map((icon, i) => {
          const pos = iconPositions[icon.id] || getGridPosition(i);
          return (
            <DesktopIcon
              key={icon.type}
              type={icon.type}
              label={icon.label}
              tabIndex={0}
              onDoubleClick={() => handleIconDoubleClick(icon)}
              drag
              dragMomentum={false}
              style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                zIndex: 2,
              }}
              onDragEnd={(event, info) => handleIconDragEnd(icon.id, event, info)}
            />
          );
        })}
      </div>
      {/* Windows */}
      {windows.map((win) => (
        <Window
          key={win.id}
          title={win.title}
          minimized={win.minimized}
          maximized={win.maximized}
          z={win.z}
          onMinimize={() => dispatch({ type: 'MINIMIZE_WINDOW', payload: { id: win.id, minimized: true } })}
          onMaximize={() => {
            dispatch({ type: 'MAXIMIZE_WINDOW', payload: { id: win.id } });
            showNotification(`${win.title} maximized`, 'info');
          }}
          onClose={() => dispatch({ type: 'CLOSE_WINDOW', payload: { id: win.id } })}
          onFocus={() => { setActiveId(win.id); dispatch({ type: 'FOCUS_WINDOW', payload: { id: win.id } }); }}
        >
          {/* App content by window type */}
          {win.id === 'computer' ? (
            <MyComputer />
          ) : win.id === 'trash' ? (
            <Trash />
          ) : win.id === 'terminal' ? (
            <Terminal />
          ) : win.id === 'security' ? (
            <Security />
          ) : win.id === 'terms' ? (
            <Terms />
          ) : win.id === 'contact' ? (
            <Contact showNotification={showNotification} />
          ) : (
            <div className="text-white/80 text-center text-lg font-mono">
              {win.title} App Window
            </div>
          )}
        </Window>
      ))}
      {/* Bottom Taskbar */}
      <BottomTaskbar windows={windows} onClick={handleTaskbarClick} activeId={activeId} />
      {/* Notification Toast */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleNotificationClose}
        />
      )}
    </div>
  );
}

export default App;
