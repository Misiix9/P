import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Maximize2,
  Minimize2,
  X,
  Square,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Grid3X3,
  Layers,
  RotateCcw,
  Settings,
  Copy,
  Move,
  Resize,
  PictureInPicture2
} from 'lucide-react';
import { playClick } from '../../utils/soundManager';

const WindowContextMenu = ({ 
  isOpen, 
  position, 
  onClose, 
  onAction, 
  windowData,
  canSplitScreen 
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleMenuAction = (action, ...args) => {
    playClick();
    onAction(action, ...args);
    onClose();
  };

  const menuItems = [
    {
      label: 'Restore',
      icon: RotateCcw,
      action: () => handleMenuAction('restore'),
      disabled: !windowData?.maximized && !windowData?.snapped
    },
    {
      label: windowData?.maximized ? 'Restore Down' : 'Maximize',
      icon: windowData?.maximized ? Square : Maximize2,
      action: () => handleMenuAction('maximize'),
      shortcut: 'Alt+F10'
    },
    {
      label: 'Minimize',
      icon: Minimize2,
      action: () => handleMenuAction('minimize'),
      shortcut: 'Alt+F9'
    },
    { type: 'separator' },
    {
      label: 'Snap Left',
      icon: ArrowLeft,
      action: () => handleMenuAction('snap', 'left'),
      shortcut: '⊞+←'
    },
    {
      label: 'Snap Right',
      icon: ArrowRight,
      action: () => handleMenuAction('snap', 'right'),
      shortcut: '⊞+→'
    },
    {
      label: 'Snap Top',
      icon: ArrowUp,
      action: () => handleMenuAction('snap', 'top'),
      shortcut: '⊞+↑'
    },
    {
      label: 'Snap Bottom',
      icon: ArrowDown,
      action: () => handleMenuAction('snap', 'bottom'),
      shortcut: '⊞+↓'
    },
    { type: 'separator' },
    {
      label: 'Split Screen Horizontal',
      icon: PictureInPicture2,
      action: () => handleMenuAction('splitScreen', 'horizontal'),
      disabled: !canSplitScreen,
      submenu: canSplitScreen ? [
        {
          label: 'Split with Previous Window',
          action: () => handleMenuAction('splitScreen', 'horizontal', 'previous')
        },
        {
          label: 'Split with Next Window',
          action: () => handleMenuAction('splitScreen', 'horizontal', 'next')
        }
      ] : null
    },
    {
      label: 'Split Screen Vertical',
      icon: Layers,
      action: () => handleMenuAction('splitScreen', 'vertical'),
      disabled: !canSplitScreen,
      submenu: canSplitScreen ? [
        {
          label: 'Split with Previous Window',
          action: () => handleMenuAction('splitScreen', 'vertical', 'previous')
        },
        {
          label: 'Split with Next Window',
          action: () => handleMenuAction('splitScreen', 'vertical', 'next')
        }
      ] : null
    },
    { type: 'separator' },
    {
      label: 'Cascade All Windows',
      icon: Layers,
      action: () => handleMenuAction('cascadeAll'),
      shortcut: 'Ctrl+Alt+C'
    },
    {
      label: 'Tile All Windows',
      icon: Grid3X3,
      action: () => handleMenuAction('tileAll'),
      shortcut: 'Ctrl+Alt+T'
    },
    { type: 'separator' },
    {
      label: 'Always on Top',
      icon: ArrowUp,
      action: () => handleMenuAction('alwaysOnTop'),
      toggle: windowData?.alwaysOnTop
    },
    { type: 'separator' },
    {
      label: 'Close',
      icon: X,
      action: () => handleMenuAction('close'),
      shortcut: 'Alt+F4',
      danger: true
    }
  ];

  const MenuItem = ({ item, depth = 0 }) => {
    const [showSubmenu, setShowSubmenu] = React.useState(false);

    if (item.type === 'separator') {
      return <div className="h-px bg-white/10 my-1" />;
    }

    const Icon = item.icon;
    const hasSubmenu = item.submenu && item.submenu.length > 0;

    return (
      <div
        className="relative"
        onMouseEnter={() => hasSubmenu && setShowSubmenu(true)}
        onMouseLeave={() => hasSubmenu && setShowSubmenu(false)}
      >
        <button
          className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
            item.disabled 
              ? 'text-white/30 cursor-not-allowed' 
              : item.danger
              ? 'text-red-400 hover:bg-red-500/20 hover:text-red-300'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          } ${item.toggle ? 'bg-accent/20 text-accent' : ''}`}
          onClick={item.action}
          disabled={item.disabled}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className="w-4 h-4" />}
            <span>{item.label}</span>
          </div>
          <div className="flex items-center gap-2">
            {item.shortcut && (
              <span className="text-xs text-white/50 font-mono">{item.shortcut}</span>
            )}
            {hasSubmenu && <ArrowRight className="w-3 h-3" />}
          </div>
        </button>

        {/* Submenu */}
        <AnimatePresence>
          {hasSubmenu && showSubmenu && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute left-full top-0 ml-1 min-w-48 bg-black/90 backdrop-blur-lg rounded-lg border border-white/20 shadow-xl z-50"
            >
              {item.submenu.map((subItem, index) => (
                <MenuItem key={index} item={subItem} depth={depth + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="fixed z-[9999] min-w-64 bg-black/90 backdrop-blur-lg rounded-lg border border-white/20 shadow-xl py-2"
        style={{
          left: position.x,
          top: position.y
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItem key={index} item={item} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default WindowContextMenu;