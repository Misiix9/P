import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
// import your SVG icons here or use inline SVGs for battery, volume, network, profile

const BatteryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="18" height="10" rx="2"/><line x1="22" y1="11" x2="22" y2="13"/></svg>
);
const VolumeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
);
const NetworkIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 8.82A17.89 17.89 0 0 1 12 6c3.31 0 6.42.8 9.18 2.22"/><path d="M5.07 13.11A12.94 12.94 0 0 1 12 11c2.21 0 4.3.53 6.13 1.47"/><path d="M8.53 17.39A7.94 7.94 0 0 1 12 16c1.1 0 2.16.18 3.13.5"/></svg>
);
const ProfileAvatar = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0 1 13 0"/></svg>
);

const startMenuApps = [
  { id: 'computer', label: 'My Computer', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 20h8"/><path d="M12 16v4"/></svg> },
  { id: 'terminal', label: 'Terminal', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> },
  { id: 'contact', label: 'Contact', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="12" cy="10" r="3"/></svg> },
  { id: 'projects', label: 'Projects', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg> },
  { id: 'settings', label: 'Settings', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 5 15.4a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 5 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09c0 .66.39 1.26 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.66 0 1.26.39 1.51 1H21a2 2 0 0 1 0 4h-.09c-.25 0-.48.09-.68.26z"/></svg> },
];

const StartMenu = ({ open, onClose, onShortcut }) => {
  const ref = useRef();
  const [focusIdx, setFocusIdx] = useState(0);
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const handleKey = (e) => {
      if (e.key === 'ArrowDown') setFocusIdx(idx => Math.min(idx + 1, startMenuApps.length - 1));
      if (e.key === 'ArrowUp') setFocusIdx(idx => Math.max(idx - 1, 0));
      if (e.key === 'Enter') onShortcut(startMenuApps[focusIdx].id);
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose, onShortcut, focusIdx]);
  if (!open) return null;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute left-2 top-14 w-80 bg-glass backdrop-blur-md rounded-2xl shadow-glass border border-white/10 p-4 z-50 flex flex-col gap-4"
      tabIndex={-1}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-black font-bold text-xl shadow-glass">🟢</span>
        <span className="text-accent font-bold text-xl">Start</span>
      </div>
      <div className="text-white/70 text-xs mb-1">Pinned</div>
      <div className="grid grid-cols-3 gap-3 mb-2">
        {startMenuApps.slice(0, 3).map((app, i) => (
          <button
            key={app.id}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition focus:outline-none ${focusIdx === i ? 'bg-accent/20 ring-2 ring-accent' : 'hover:bg-white/10'}`}
            onClick={() => onShortcut(app.id)}
            tabIndex={0}
            autoFocus={focusIdx === i}
          >
            {app.icon}
            <span className="text-xs text-white/80">{app.label}</span>
          </button>
        ))}
      </div>
      <div className="text-white/70 text-xs mb-1">All Apps</div>
      <div className="flex flex-col gap-1">
        {startMenuApps.map((app, i) => (
          <button
            key={app.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition focus:outline-none ${focusIdx === i + 3 ? 'bg-accent/20 ring-2 ring-accent' : 'hover:bg-white/10'}`}
            onClick={() => onShortcut(app.id)}
            tabIndex={0}
            autoFocus={focusIdx === i + 3}
          >
            {app.icon}
            <span className="text-white/90 font-medium">{app.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

const Taskbar = ({ onStartMenuShortcut }) => {
  const [date, setDate] = useState(new Date());
  const [profileOpen, setProfileOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [battery, setBattery] = useState(76); // default fake battery %
  const [charging, setCharging] = useState(true); // default fake charging
  const [wifi, setWifi] = useState('connected'); // 'connected', 'disconnected', 'connecting'
  const [volume, setVolume] = useState(60); // 0-100
  const [showVolume, setShowVolume] = useState(false);
  const [showWifi, setShowWifi] = useState(false);
  const [showBattery, setShowBattery] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Battery Status API
  useEffect(() => {
    let batteryObj;
    if (navigator.getBattery) {
      navigator.getBattery().then(bat => {
        batteryObj = bat;
        setBattery(Math.round(bat.level * 100));
        setCharging(bat.charging);
        bat.addEventListener('levelchange', () => setBattery(Math.round(bat.level * 100)));
        bat.addEventListener('chargingchange', () => setCharging(bat.charging));
      });
    }
    return () => {
      if (batteryObj) {
        batteryObj.removeEventListener('levelchange', () => {});
        batteryObj.removeEventListener('chargingchange', () => {});
      }
    };
  }, []);

  // Network Information API
  useEffect(() => {
    const updateWifi = () => {
      if (navigator.onLine) {
        setWifi('connected');
      } else {
        setWifi('disconnected');
      }
    };
    updateWifi();
    window.addEventListener('online', updateWifi);
    window.addEventListener('offline', updateWifi);
    return () => {
      window.removeEventListener('online', updateWifi);
      window.removeEventListener('offline', updateWifi);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-12 flex items-center justify-between px-4 z-50 backdrop-blur-md bg-taskbar shadow-glass border-b border-white/10 select-none"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 60 }}
    >
      {/* Left: Start Menu Button */}
      <div className="relative">
        <button
          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-glass hover:bg-white/10 transition border border-white/10 shadow-glass text-accent font-semibold text-lg"
          aria-label="Open Start Menu"
          onClick={() => setStartOpen((v) => !v)}
        >
          <span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse" />
          Start
        </button>
        <StartMenu open={startOpen} onClose={() => setStartOpen(false)} onShortcut={onStartMenuShortcut} />
      </div>

      {/* Center: Live Date & Time */}
      <div className="text-white/90 font-mono text-sm tracking-wide drop-shadow">
        {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>

      {/* Right: System Icons */}
      <div className="flex items-center gap-4">
        {/* Battery */}
        <div className="relative">
          <button onClick={() => setShowBattery(v => !v)} className="hover:bg-white/10 rounded p-1 transition" aria-label="Battery Status">
            <BatteryIcon />
          </button>
          {showBattery && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-36 bg-glass backdrop-blur-md rounded-lg shadow-glass border border-white/10 p-3 z-50">
              <div className="text-white/80 text-sm">Battery: {battery}% {charging ? '(Charging)' : ''}</div>
              <div className="w-full h-2 bg-white/10 rounded mt-2">
                <div className="h-2 rounded bg-accent" style={{ width: `${battery}%` }} />
              </div>
            </motion.div>
          )}
        </div>
        {/* Volume */}
        <div className="relative">
          <button onClick={() => setShowVolume(v => !v)} className="hover:bg-white/10 rounded p-1 transition" aria-label="Volume Control">
            <VolumeIcon />
          </button>
          {showVolume && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-36 bg-glass backdrop-blur-md rounded-lg shadow-glass border border-white/10 p-3 z-50">
              <div className="text-white/80 text-sm mb-2">Volume: {volume}%</div>
              <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-full accent-accent" />
            </motion.div>
          )}
        </div>
        {/* Wifi */}
        <div className="relative">
          <button onClick={() => setShowWifi(v => !v)} className="hover:bg-white/10 rounded p-1 transition" aria-label="Network Status">
            <NetworkIcon />
          </button>
          {showWifi && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-40 bg-glass backdrop-blur-md rounded-lg shadow-glass border border-white/10 p-3 z-50">
              <div className="text-white/80 text-sm mb-2">WiFi: {wifi === 'connected' ? 'Connected' : wifi === 'connecting' ? 'Connecting...' : 'Disconnected'}</div>
              <button onClick={() => setWifi(wifi === 'connected' ? 'disconnected' : 'connected')} className="px-3 py-1 rounded bg-accent/20 text-accent hover:bg-accent/40 transition text-xs font-semibold">
                {wifi === 'connected' ? 'Disconnect' : 'Connect'}
              </button>
            </motion.div>
          )}
        </div>
        {/* Profile */}
        <div className="relative">
          <button onClick={() => setProfileOpen(v => !v)} className="rounded-full border-2 border-accent p-1 hover:shadow-glass transition">
            <ProfileAvatar />
          </button>
          {/* Profile dropdown (to be implemented) */}
          {profileOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-40 bg-glass backdrop-blur-md rounded-lg shadow-glass border border-white/10 p-2 z-50">
              <div className="text-white/80 px-2 py-1">Profile</div>
              <div className="text-white/60 px-2 py-1 hover:bg-white/10 rounded cursor-pointer">Settings</div>
              <div className="text-white/60 px-2 py-1 hover:bg-white/10 rounded cursor-pointer">Logout</div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Taskbar; 