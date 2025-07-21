import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Volume2, 
  Monitor, 
  User,
  Shield,
  Bell,
  Wifi,
  Battery,
  Moon,
  Sun,
  Smartphone,
  Laptop,
  Gamepad2,
  Music,
  Image,
  FileText,
  Globe,
  Download,
  Upload,
  HardDrive,
  MemoryStick,
  Cpu,
  Eye,
  MousePointer,
  Keyboard,
  Headphones,
  Bluetooth,
  Camera,
  Mic,
  Printer,
  UsbIcon,
  RotateCcw,
  Trash2,
  RefreshCw,
  Power,
  LogOut,
  Info
} from 'lucide-react';
import { playClick, playSuccess } from '../../../utils/soundManager';
import { useThemeStore, useSystemStore, useNotificationStore } from '../../../stores/useStore';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('appearance');
  
  // Theme store
  const {
    currentTheme,
    wallpaper,
    accentColor,
    glassIntensity,
    animationSpeed,
    soundEnabled,
    themes,
    wallpapers,
    setTheme,
    setWallpaper,
    setAccentColor,
    setGlassIntensity,
    setAnimationSpeed,
    toggleSound
  } = useThemeStore();

  // System store
  const {
    userName,
    quickSettings,
    updateQuickSettings,
    volume,
    setVolume
  } = useSystemStore();

  const addNotification = useNotificationStore((state) => state.addNotification);

  const menuItems = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System', icon: Monitor },
    { id: 'sound', label: 'Sound', icon: Volume2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'accounts', label: 'User Accounts', icon: User },
    { id: 'storage', label: 'Storage', icon: HardDrive },
    { id: 'performance', label: 'Performance', icon: Cpu },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
    { id: 'about', label: 'About', icon: Info }
  ];

  const handleSettingChange = (setting, value) => {
    playClick();
    
    switch (setting) {
      case 'theme':
        setTheme(value);
        addNotification({ message: `Theme changed to ${themes[value].name}`, type: 'success' });
        break;
      case 'wallpaper':
        setWallpaper(value);
        addNotification({ message: 'Wallpaper changed', type: 'success' });
        break;
      case 'accentColor':
        setAccentColor(value);
        addNotification({ message: 'Accent color updated', type: 'success' });
        break;
      case 'glassIntensity':
        setGlassIntensity(value);
        break;
      case 'animationSpeed':
        setAnimationSpeed(value);
        break;
      case 'sound':
        toggleSound();
        addNotification({ 
          message: `Sound ${!soundEnabled ? 'enabled' : 'disabled'}`, 
          type: 'success' 
        });
        break;
      case 'volume':
        setVolume(value);
        break;
      case 'quickSetting':
        updateQuickSettings({ [value.key]: value.value });
        break;
      default:
        addNotification({ message: 'Setting updated', type: 'success' });
    }
  };

  const resetToDefaults = () => {
    playSuccess();
    setTheme('dark');
    setWallpaper('gradient');
    setAccentColor('#00ffd0');
    setGlassIntensity(0.1);
    setAnimationSpeed(1);
    addNotification({ message: 'Settings reset to defaults', type: 'success' });
  };

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div>
        <h3 className="text-white/90 font-semibold mb-3">Theme</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(themes).map(([key, theme]) => (
            <motion.button
              key={key}
              className={`p-4 rounded-xl border-2 transition-all ${
                currentTheme === key 
                  ? 'border-accent bg-accent/10' 
                  : 'border-white/10 bg-glass-dark hover:border-white/20'
              }`}
              onClick={() => handleSettingChange('theme', key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-full h-12 rounded-lg mb-2 ${theme.background}`}></div>
              <div className="text-white/90 text-sm font-medium">{theme.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Wallpaper Selection */}
      <div>
        <h3 className="text-white/90 font-semibold mb-3">Wallpaper</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(wallpapers).map(([key, wallpaperClass]) => (
            <motion.button
              key={key}
              className={`aspect-video rounded-lg border-2 transition-all ${
                wallpaper === key 
                  ? 'border-accent' 
                  : 'border-white/10 hover:border-white/20'
              }`}
              onClick={() => handleSettingChange('wallpaper', key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-full h-full rounded-lg ${wallpaperClass}`}></div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Accent Color */}
      <div>
        <h3 className="text-white/90 font-semibold mb-3">Accent Color</h3>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={accentColor}
            onChange={(e) => handleSettingChange('accentColor', e.target.value)}
            className="w-12 h-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
          />
          <div className="flex gap-2">
            {['#00ffd0', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'].map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full border-2 transition ${
                  accentColor === color ? 'border-white' : 'border-white/20'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleSettingChange('accentColor', color)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Visual Effects */}
      <div>
        <h3 className="text-white/90 font-semibold mb-3">Visual Effects</h3>
        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-between">
              <span className="text-white/80">Glass Intensity</span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="0.3"
                  step="0.05"
                  value={glassIntensity}
                  onChange={(e) => handleSettingChange('glassIntensity', parseFloat(e.target.value))}
                  className="w-32 accent-accent"
                />
                <span className="text-white/60 text-sm w-12">{Math.round(glassIntensity * 100)}%</span>
              </div>
            </label>
          </div>
          
          <div>
            <label className="flex items-center justify-between">
              <span className="text-white/80">Animation Speed</span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.25"
                  value={animationSpeed}
                  onChange={(e) => handleSettingChange('animationSpeed', parseFloat(e.target.value))}
                  className="w-32 accent-accent"
                />
                <span className="text-white/60 text-sm w-12">{animationSpeed}x</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      {/* Display Settings */}
      <div>
        <h3 className="text-white/90 font-semibold mb-3">Display</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/80">Dark Mode</span>
            <button
              onClick={() => handleSettingChange('quickSetting', { key: 'darkMode', value: !quickSettings.darkMode })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                quickSettings.darkMode ? 'bg-accent' : 'bg-white/20'
              }`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg"
                animate={{ x: quickSettings.darkMode ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
          
          <div>
            <label className="flex items-center justify-between">
              <span className="text-white/80">Brightness</span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={quickSettings.brightness}
                  onChange={(e) => handleSettingChange('quickSetting', { 
                    key: 'brightness', 
                    value: parseInt(e.target.value) 
                  })}
                  className="w-32 accent-accent"
                />
                <span className="text-white/60 text-sm w-12">{quickSettings.brightness}%</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Network Settings */}
      <div>
        <h3 className="text-white/90 font-semibold mb-3">Network</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-accent" />
              <span className="text-white/80">Wi-Fi</span>
            </div>
            <button
              onClick={() => handleSettingChange('quickSetting', { key: 'wifi', value: !quickSettings.wifi })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                quickSettings.wifi ? 'bg-accent' : 'bg-white/20'
              }`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg"
                animate={{ x: quickSettings.wifi ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bluetooth className="w-5 h-5 text-blue-400" />
              <span className="text-white/80">Bluetooth</span>
            </div>
            <button
              onClick={() => handleSettingChange('quickSetting', { key: 'bluetooth', value: !quickSettings.bluetooth })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                quickSettings.bluetooth ? 'bg-accent' : 'bg-white/20'
              }`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg"
                animate={{ x: quickSettings.bluetooth ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Power Management */}
      <div>
        <h3 className="text-white/90 font-semibold mb-3">Power</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button className="flex items-center gap-3 p-3 bg-glass-dark rounded-lg border border-white/10 hover:border-accent/30 transition">
            <RefreshCw className="w-5 h-5 text-green-400" />
            <span className="text-white/80">Restart</span>
          </button>
          <button className="flex items-center gap-3 p-3 bg-glass-dark rounded-lg border border-white/10 hover:border-accent/30 transition">
            <Power className="w-5 h-5 text-red-400" />
            <span className="text-white/80">Shutdown</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSoundSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white/90 font-semibold mb-3">Audio</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/80">System Sounds</span>
            <button
              onClick={() => handleSettingChange('sound')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                soundEnabled ? 'bg-accent' : 'bg-white/20'
              }`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg"
                animate={{ x: soundEnabled ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
          
          <div>
            <label className="flex items-center justify-between">
              <span className="text-white/80">Master Volume</span>
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-white/60" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleSettingChange('volume', parseInt(e.target.value))}
                  className="w-32 accent-accent"
                />
                <span className="text-white/60 text-sm w-12">{volume}%</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAboutSettings = () => (
    <div className="space-y-6">
      <div className="bg-glass-dark rounded-xl p-6 border border-white/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center">
            <Monitor className="w-8 h-8 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Portfolio Desktop</h2>
            <p className="text-white/60">Version 1.0.0</p>
          </div>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-white/60">Built with</span>
            <span className="text-white/90">React 19, Vite, Tailwind CSS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">State Management</span>
            <span className="text-white/90">Zustand</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Animations</span>
            <span className="text-white/90">Framer Motion</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Audio</span>
            <span className="text-white/90">Howler.js</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Icons</span>
            <span className="text-white/90">Lucide React</span>
          </div>
        </div>
      </div>

      <div className="bg-glass-dark rounded-xl p-6 border border-white/10">
        <h3 className="text-white/90 font-semibold mb-3">System Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-white/60">User Agent</span>
            <span className="text-white/90 text-xs">{navigator.userAgent.split(' ')[0]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Platform</span>
            <span className="text-white/90">{navigator.platform}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Language</span>
            <span className="text-white/90">{navigator.language}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Screen Resolution</span>
            <span className="text-white/90">{screen.width}x{screen.height}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'appearance':
        return renderAppearanceSettings();
      case 'system':
        return renderSystemSettings();
      case 'sound':
        return renderSoundSettings();
      case 'about':
        return renderAboutSettings();
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-white/60">
            <SettingsIcon className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
            <p>This settings section is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex bg-black/5">
      {/* Sidebar */}
      <div className="w-64 bg-black/10 border-r border-white/10 p-4">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-semibold text-white">Settings</h2>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                  activeSection === item.id
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => {
                  playClick();
                  setActiveSection(item.id);
                }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Reset Button */}
        <div className="mt-8 pt-4 border-t border-white/10">
          <button
            onClick={resetToDefaults}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="font-medium">Reset to Defaults</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto scrollbar-glass">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold text-white mb-6 capitalize">
            {activeSection.replace(/([A-Z])/g, ' $1').trim()}
          </h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;