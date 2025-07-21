import './App.css';
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// Components
import Taskbar from './components/Taskbar/Taskbar';
import DesktopIcon from './components/DesktopIcon/DesktopIcon';
import Window from './components/Window/Window';
import Notification from './components/Notification';
import BottomTaskbar from './components/Taskbar/BottomTaskbar';

// Apps
import MyComputer from './components/Apps/MyComputer/MyComputer';
import Trash from './components/Apps/Trash/Trash';
import Terminal from './components/Apps/Terminal/Terminal';
import Security from './components/Apps/Security/Security';
import Terms from './components/Apps/Terms/Terms';
import Contact from './components/Apps/Contact/Contact';
import Browser from './components/Apps/Browser/Browser';
import Calculator from './components/Apps/Calculator/Calculator';
import Notepad from './components/Apps/Notepad/Notepad';
import Gallery from './components/Apps/Gallery/Gallery';
import Music from './components/Apps/Music/Music';
import Settings from './components/Apps/Settings/Settings';

// Stores
import {
  useWindowStore,
  useThemeStore,
  useDesktopStore,
  useNotificationStore,
  useSystemStore
} from './stores/useStore';

// Sound manager
import { playOpen, playClose, playClick } from './utils/soundManager';

function App() {
  // Store hooks
  const {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow
  } = useWindowStore();

  const {
    currentTheme,
    wallpaper,
    getCurrentTheme,
    wallpapers
  } = useThemeStore();

  const {
    desktopIcons,
    iconPositions,
    updateIconPosition,
    getGridPosition
  } = useDesktopStore();

  const { notifications, addNotification, removeNotification } = useNotificationStore();

  const {
    startMenuOpen,
    toggleStartMenu,
    closeStartMenu,
    updateTime
  } = useSystemStore();

  // Update system time every second
  useEffect(() => {
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [updateTime]);

  // Apply theme CSS variables
  useEffect(() => {
    const theme = getCurrentTheme();
    const root = document.documentElement;
    
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--taskbar-bg', theme.taskbar);
    root.style.setProperty('--window-bg', theme.window);
  }, [currentTheme, getCurrentTheme]);

  // Handle Start Menu shortcuts
  const handleStartMenuShortcut = (appId) => {
    playClick();
    closeStartMenu();

    const appConfigs = {
      computer: { title: 'My Computer', type: 'computer' },
      trash: { title: 'Trash', type: 'trash' },
      terminal: { title: 'Terminal', type: 'terminal' },
      security: { title: 'Security', type: 'security' },
      terms: { title: 'Terms & Services', type: 'terms' },
      contact: { title: 'Contact', type: 'contact' },
      browser: { title: 'Portfolio Browser', type: 'browser' },
      calculator: { title: 'Calculator', type: 'calculator' },
      notepad: { title: 'Notepad', type: 'notepad' },
      gallery: { title: 'Gallery', type: 'gallery' },
      music: { title: 'Music Player', type: 'music' },
      settings: { title: 'Settings', type: 'settings' }
    };

    const config = appConfigs[appId];
    if (config) {
      openWindow({
        id: appId,
        title: config.title,
        type: config.type
      });
      
      addNotification({
        message: `${config.title} opened`,
        type: 'success'
      });
    } else {
      addNotification({
        message: 'This feature is coming soon!',
        type: 'info'
      });
    }
  };

  // Handle desktop icon double click
  const handleIconDoubleClick = (icon) => {
    playOpen();
    
    openWindow({
      id: icon.id,
      title: icon.label,
      type: icon.type
    });

    addNotification({
      message: `${icon.label} opened`,
      type: 'success'
    });
  };

  // Handle icon drag end with grid snapping
  const handleIconDragEnd = (iconId, event, info) => {
    const pointerX = info.point.x;
    const pointerY = info.point.y;
    
    // Snap to grid
    const x = pointerX - 40; // Account for desktop padding
    const y = pointerY - 40;
    const gridSize = 120;
    const gridGap = 32;
    
    const col = Math.max(0, Math.round(x / (gridSize + gridGap)));
    const row = Math.max(0, Math.round(y / (gridSize + gridGap)));
    
    const snappedPosition = {
      x: col * (gridSize + gridGap) + 40,
      y: row * (gridSize + gridGap) + 40
    };

    updateIconPosition(iconId, snappedPosition);
  };

  // Handle window actions
  const handleWindowMinimize = (windowId) => {
    playClick();
    minimizeWindow(windowId, true);
  };

  const handleWindowMaximize = (windowId) => {
    playClick();
    maximizeWindow(windowId);
  };

  const handleWindowClose = (windowId) => {
    playClose();
    closeWindow(windowId);
  };

  const handleWindowFocus = (windowId) => {
    focusWindow(windowId);
  };

  // Handle taskbar click (minimize/restore)
  const handleTaskbarClick = (window) => {
    if (window.minimized) {
      minimizeWindow(window.id, false);
      focusWindow(window.id);
    } else {
      minimizeWindow(window.id, true);
    }
  };

  // Render app content based on type
  const renderAppContent = (window) => {
    const components = {
      computer: <MyComputer />,
      trash: <Trash />,
      terminal: <Terminal />,
      security: <Security />,
      terms: <Terms />,
      contact: <Contact showNotification={addNotification} />,
      browser: <Browser />,
      calculator: <Calculator />,
      notepad: <Notepad />,
      gallery: <Gallery />,
      music: <Music />,
      settings: <Settings />
    };

    return components[window.type] || (
      <div className="text-white/80 text-center text-lg font-mono">
        {window.title} App Window
      </div>
    );
  };

  // Get current wallpaper class
  const currentWallpaper = wallpapers[wallpaper] || wallpapers.gradient;

  return (
    <div className={clsx(
      "min-h-screen w-full relative overflow-hidden transition-all duration-500",
      currentWallpaper
    )}>
      {/* Taskbar at the top */}
      <Taskbar onStartMenuShortcut={handleStartMenuShortcut} />
      
      {/* Desktop area */}
      <motion.div 
        className="pt-16 px-8 pb-4 min-h-[calc(100vh-3rem)] relative"
        style={{ minHeight: 'calc(100vh - 3rem)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Desktop Icons */}
        <AnimatePresence>
          {desktopIcons.map((icon, index) => {
            const position = iconPositions[icon.id] || getGridPosition(index);
            
            return (
              <DesktopIcon
                key={icon.id}
                type={icon.type}
                label={icon.label}
                tabIndex={0}
                onDoubleClick={() => handleIconDoubleClick(icon)}
                drag
                dragMomentum={false}
                style={{
                  position: 'absolute',
                  left: position.x,
                  top: position.y,
                  zIndex: 2,
                }}
                onDragEnd={(event, info) => handleIconDragEnd(icon.id, event, info)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 300
                }}
              />
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Windows */}
      <AnimatePresence>
        {windows.map((window) => (
          <Window
            key={window.id}
            title={window.title}
            minimized={window.minimized}
            maximized={window.maximized}
            z={window.zIndex}
            position={window.position}
            size={window.size}
            onMinimize={() => handleWindowMinimize(window.id)}
            onMaximize={() => handleWindowMaximize(window.id)}
            onClose={() => handleWindowClose(window.id)}
            onFocus={() => handleWindowFocus(window.id)}
            isActive={window.id === activeWindowId}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
          >
            {renderAppContent(window)}
          </Window>
        ))}
      </AnimatePresence>

      {/* Bottom Taskbar */}
      <BottomTaskbar 
        windows={windows} 
        onClick={handleTaskbarClick} 
        activeId={activeWindowId} 
      />

      {/* Notifications */}
      <div className="fixed top-20 right-4 space-y-2 z-50">
        <AnimatePresence>
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              message={notification.message}
              type={notification.type}
              onClose={() => removeNotification(notification.id)}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Boot sequence overlay (optional) */}
      {/* This could be added later for the boot animation */}
    </div>
  );
}

export default App;
