import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { persist } from 'zustand/middleware';

// Window management store
const useWindowStore = create(
  subscribeWithSelector((set, get) => ({
    windows: [],
    activeWindowId: null,
    nextZIndex: 1,

    openWindow: (windowData) => set((state) => {
      const existingWindow = state.windows.find(w => w.id === windowData.id);
      
      if (existingWindow) {
        // Bring existing window to front and restore if minimized
        return {
          windows: state.windows.map(w =>
            w.id === windowData.id
              ? { ...w, minimized: false, zIndex: state.nextZIndex }
              : w
          ),
          nextZIndex: state.nextZIndex + 1,
          activeWindowId: windowData.id
        };
      }

      // Create new window
      const newWindow = {
        id: windowData.id,
        title: windowData.title,
        type: windowData.type,
        minimized: false,
        maximized: false,
        zIndex: state.nextZIndex,
        position: { x: 100 + (state.windows.length * 30), y: 100 + (state.windows.length * 30) },
        size: { width: 800, height: 600 },
        ...windowData
      };

      return {
        windows: [...state.windows, newWindow],
        nextZIndex: state.nextZIndex + 1,
        activeWindowId: windowData.id
      };
    }),

    closeWindow: (windowId) => set((state) => ({
      windows: state.windows.filter(w => w.id !== windowId),
      activeWindowId: state.activeWindowId === windowId ? null : state.activeWindowId
    })),

    minimizeWindow: (windowId, minimized = true) => set((state) => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, minimized } : w
      ),
      activeWindowId: minimized && state.activeWindowId === windowId ? null : state.activeWindowId
    })),

    maximizeWindow: (windowId) => set((state) => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, maximized: !w.maximized, minimized: false } : w
      ),
      activeWindowId: windowId
    })),

    focusWindow: (windowId) => set((state) => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, zIndex: state.nextZIndex } : w
      ),
      nextZIndex: state.nextZIndex + 1,
      activeWindowId: windowId
    })),

    updateWindowPosition: (windowId, position) => set((state) => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, position } : w
      )
    })),

    updateWindowSize: (windowId, size) => set((state) => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, size } : w
      )
    })),

    // Advanced window management
    snapWindow: (windowId, snapPosition) => set((state) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight - 64; // Account for taskbar
      const taskbarHeight = 48;
      
      let position, size;
      
      switch (snapPosition) {
        case 'left':
          position = { x: 0, y: taskbarHeight };
          size = { width: screenWidth / 2, height: screenHeight };
          break;
        case 'right':
          position = { x: screenWidth / 2, y: taskbarHeight };
          size = { width: screenWidth / 2, height: screenHeight };
          break;
        case 'top':
          position = { x: 0, y: taskbarHeight };
          size = { width: screenWidth, height: screenHeight / 2 };
          break;
        case 'bottom':
          position = { x: 0, y: taskbarHeight + screenHeight / 2 };
          size = { width: screenWidth, height: screenHeight / 2 };
          break;
        case 'top-left':
          position = { x: 0, y: taskbarHeight };
          size = { width: screenWidth / 2, height: screenHeight / 2 };
          break;
        case 'top-right':
          position = { x: screenWidth / 2, y: taskbarHeight };
          size = { width: screenWidth / 2, height: screenHeight / 2 };
          break;
        case 'bottom-left':
          position = { x: 0, y: taskbarHeight + screenHeight / 2 };
          size = { width: screenWidth / 2, height: screenHeight / 2 };
          break;
        case 'bottom-right':
          position = { x: screenWidth / 2, y: taskbarHeight + screenHeight / 2 };
          size = { width: screenWidth / 2, height: screenHeight / 2 };
          break;
        case 'center':
          position = { x: screenWidth / 4, y: taskbarHeight + screenHeight / 4 };
          size = { width: screenWidth / 2, height: screenHeight / 2 };
          break;
        case 'maximize':
          position = { x: 0, y: taskbarHeight };
          size = { width: screenWidth, height: screenHeight };
          break;
        default:
          return state;
      }
      
      return {
        windows: state.windows.map(w =>
          w.id === windowId 
            ? { ...w, position, size, maximized: snapPosition === 'maximize', snapped: snapPosition !== 'maximize' ? snapPosition : false }
            : w
        )
      };
    }),

    arrangeSplitScreen: (windowId1, windowId2, orientation = 'horizontal') => set((state) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight - 64;
      const taskbarHeight = 48;
      
      if (orientation === 'horizontal') {
        // Side by side
        const window1Data = {
          position: { x: 0, y: taskbarHeight },
          size: { width: screenWidth / 2, height: screenHeight },
          snapped: 'left'
        };
        const window2Data = {
          position: { x: screenWidth / 2, y: taskbarHeight },
          size: { width: screenWidth / 2, height: screenHeight },
          snapped: 'right'
        };
        
        return {
          windows: state.windows.map(w => {
            if (w.id === windowId1) return { ...w, ...window1Data, maximized: false };
            if (w.id === windowId2) return { ...w, ...window2Data, maximized: false };
            return w;
          }),
          activeWindowId: windowId1
        };
      } else {
        // Top and bottom
        const window1Data = {
          position: { x: 0, y: taskbarHeight },
          size: { width: screenWidth, height: screenHeight / 2 },
          snapped: 'top'
        };
        const window2Data = {
          position: { x: 0, y: taskbarHeight + screenHeight / 2 },
          size: { width: screenWidth, height: screenHeight / 2 },
          snapped: 'bottom'
        };
        
        return {
          windows: state.windows.map(w => {
            if (w.id === windowId1) return { ...w, ...window1Data, maximized: false };
            if (w.id === windowId2) return { ...w, ...window2Data, maximized: false };
            return w;
          }),
          activeWindowId: windowId1
        };
      }
    }),

    cascadeWindows: () => set((state) => {
      const offset = 40;
      return {
        windows: state.windows.map((w, index) => ({
          ...w,
          position: { 
            x: 100 + (index * offset), 
            y: 100 + (index * offset) 
          },
          size: { width: 800, height: 600 },
          maximized: false,
          snapped: false
        }))
      };
    }),

    tileWindows: () => set((state) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight - 64;
      const taskbarHeight = 48;
      const windowCount = state.windows.length;
      
      if (windowCount === 0) return state;
      
      const cols = Math.ceil(Math.sqrt(windowCount));
      const rows = Math.ceil(windowCount / cols);
      const windowWidth = screenWidth / cols;
      const windowHeight = screenHeight / rows;
      
      return {
        windows: state.windows.map((w, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          
          return {
            ...w,
            position: {
              x: col * windowWidth,
              y: taskbarHeight + (row * windowHeight)
            },
            size: {
              width: windowWidth,
              height: windowHeight
            },
            maximized: false,
            snapped: false
          };
        })
      };
    }),

    getSnapZone: (x, y) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const snapThreshold = 50;
      
      // Edge snapping zones
      if (x < snapThreshold) {
        if (y < snapThreshold) return 'top-left';
        if (y > screenHeight - snapThreshold) return 'bottom-left';
        return 'left';
      }
      if (x > screenWidth - snapThreshold) {
        if (y < snapThreshold) return 'top-right';
        if (y > screenHeight - snapThreshold) return 'bottom-right';
        return 'right';
      }
      if (y < snapThreshold) return 'top';
      if (y > screenHeight - snapThreshold) return 'bottom';
      
      return null;
    },

    restoreWindow: (windowId) => set((state) => ({
      windows: state.windows.map(w =>
        w.id === windowId 
          ? { 
              ...w, 
              maximized: false, 
              snapped: false,
              position: { x: 100, y: 100 },
              size: { width: 800, height: 600 }
            } 
          : w
      )
    }))
  }))
);

// Theme store
const useThemeStore = create(
  persist(
    (set, get) => ({
      currentTheme: 'dark',
      wallpaper: 'gradient',
      accentColor: '#00ffd0',
      glassIntensity: 0.1,
      animationSpeed: 1,
      soundEnabled: true,
      
      themes: {
        dark: {
          name: 'Dark Mode',
          background: 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900',
          taskbar: 'bg-black/20',
          window: 'bg-black/10',
          text: 'text-white',
          accent: '#00ffd0'
        },
        light: {
          name: 'Light Mode',
          background: 'bg-gradient-to-br from-blue-50 via-white to-gray-100',
          taskbar: 'bg-white/20',
          window: 'bg-white/10',
          text: 'text-gray-900',
          accent: '#0066cc'
        },
        macos: {
          name: 'macOS Style',
          background: 'bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100',
          taskbar: 'bg-white/30',
          window: 'bg-white/20',
          text: 'text-gray-800',
          accent: '#007AFF'
        },
        windows: {
          name: 'Windows 11',
          background: 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600',
          taskbar: 'bg-black/40',
          window: 'bg-black/20',
          text: 'text-white',
          accent: '#0078d4'
        },
        ubuntu: {
          name: 'Ubuntu',
          background: 'bg-gradient-to-br from-orange-400 via-red-500 to-purple-600',
          taskbar: 'bg-black/30',
          window: 'bg-black/15',
          text: 'text-white',
          accent: '#E95420'
        }
      },

      wallpapers: {
        gradient: 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900',
        abstract: 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500',
        mountains: 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600',
        space: 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900'
      },

      setTheme: (theme) => set({ currentTheme: theme }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
      setAccentColor: (color) => set({ accentColor: color }),
      setGlassIntensity: (intensity) => set({ glassIntensity: intensity }),
      setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      
      getCurrentTheme: () => {
        const state = get();
        return state.themes[state.currentTheme];
      }
    }),
    {
      name: 'theme-storage'
    }
  )
);

// Desktop store
const useDesktopStore = create(
  persist(
    (set, get) => ({
      iconPositions: {},
      gridSize: 120,
      gridGap: 32,
      gridCols: 6,
      showDesktopIcons: true,
      
      desktopIcons: [
        { id: 'computer', label: 'My Computer', type: 'computer', icon: 'Monitor' },
        { id: 'trash', label: 'Trash', type: 'trash', icon: 'Trash2' },
        { id: 'terminal', label: 'Terminal', type: 'terminal', icon: 'Terminal' },
        { id: 'security', label: 'Security', type: 'security', icon: 'Shield' },
        { id: 'terms', label: 'Terms & Services', type: 'terms', icon: 'FileText' },
        { id: 'contact', label: 'Contact', type: 'contact', icon: 'Mail' },
        { id: 'browser', label: 'Browser', type: 'browser', icon: 'Globe' },
        { id: 'calculator', label: 'Calculator', type: 'calculator', icon: 'Calculator' },
        { id: 'notepad', label: 'Notepad', type: 'notepad', icon: 'Edit' },
        { id: 'gallery', label: 'Gallery', type: 'gallery', icon: 'Image' },
        { id: 'music', label: 'Music', type: 'music', icon: 'Music' },
        { id: 'settings', label: 'Settings', type: 'settings', icon: 'Settings' }
      ],

      updateIconPosition: (iconId, position) => set((state) => ({
        iconPositions: { ...state.iconPositions, [iconId]: position }
      })),

      getGridPosition: (index) => {
        const state = get();
        const col = index % state.gridCols;
        const row = Math.floor(index / state.gridCols);
        return {
          x: col * (state.gridSize + state.gridGap) + 40,
          y: row * (state.gridSize + state.gridGap) + 40
        };
      },

      resetIconPositions: () => set({ iconPositions: {} })
    }),
    {
      name: 'desktop-storage'
    }
  )
);

// Notification store
const useNotificationStore = create((set, get) => ({
  notifications: [],
  nextId: 1,

  addNotification: (notification) => set((state) => {
    const newNotification = {
      id: state.nextId,
      type: 'info',
      duration: 4000,
      ...notification,
      timestamp: Date.now()
    };

    // Auto-remove after duration
    setTimeout(() => {
      get().removeNotification(newNotification.id);
    }, newNotification.duration);

    return {
      notifications: [...state.notifications, newNotification],
      nextId: state.nextId + 1
    };
  }),

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  clearAll: () => set({ notifications: [] })
}));

// System store for system-level features
const useSystemStore = create(
  persist(
    (set, get) => ({
      startMenuOpen: false,
      currentTime: new Date(),
      batteryLevel: 85,
      batteryCharging: true,
      wifiConnected: true,
      volume: 70,
      screenLocked: false,
      userName: 'User',
      userAvatar: null,
      
      // Quick settings
      quickSettings: {
        wifi: true,
        bluetooth: true,
        brightness: 80,
        volume: 70,
        doNotDisturb: false,
        darkMode: true
      },

      toggleStartMenu: () => set((state) => ({ startMenuOpen: !state.startMenuOpen })),
      closeStartMenu: () => set({ startMenuOpen: false }),
      
      updateTime: () => set({ currentTime: new Date() }),
      
      setBatteryLevel: (level) => set({ batteryLevel: level }),
      setBatteryCharging: (charging) => set({ batteryCharging: charging }),
      
      setWifiConnected: (connected) => set({ wifiConnected: connected }),
      setVolume: (volume) => set({ volume }),
      
      updateQuickSettings: (settings) => set((state) => ({
        quickSettings: { ...state.quickSettings, ...settings }
      })),

      lockScreen: () => set({ screenLocked: true }),
      unlockScreen: () => set({ screenLocked: false })
    }),
    {
      name: 'system-storage',
      partialize: (state) => ({
        userName: state.userName,
        userAvatar: state.userAvatar,
        quickSettings: state.quickSettings
      })
    }
  )
);

// Export all stores
export {
  useWindowStore,
  useThemeStore,
  useDesktopStore,
  useNotificationStore,
  useSystemStore
};