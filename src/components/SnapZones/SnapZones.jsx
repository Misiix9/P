import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SnapZones = ({ isVisible, activeZone }) => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const taskbarHeight = 48;

  const zones = [
    // Half screen zones
    {
      id: 'left',
      x: 0,
      y: taskbarHeight,
      width: screenWidth / 2,
      height: screenHeight - taskbarHeight,
      label: 'Snap Left'
    },
    {
      id: 'right',
      x: screenWidth / 2,
      y: taskbarHeight,
      width: screenWidth / 2,
      height: screenHeight - taskbarHeight,
      label: 'Snap Right'
    },
    {
      id: 'top',
      x: 0,
      y: taskbarHeight,
      width: screenWidth,
      height: (screenHeight - taskbarHeight) / 2,
      label: 'Snap Top'
    },
    {
      id: 'bottom',
      x: 0,
      y: taskbarHeight + (screenHeight - taskbarHeight) / 2,
      width: screenWidth,
      height: (screenHeight - taskbarHeight) / 2,
      label: 'Snap Bottom'
    },
    // Quarter screen zones
    {
      id: 'top-left',
      x: 0,
      y: taskbarHeight,
      width: screenWidth / 2,
      height: (screenHeight - taskbarHeight) / 2,
      label: 'Snap Top Left'
    },
    {
      id: 'top-right',
      x: screenWidth / 2,
      y: taskbarHeight,
      width: screenWidth / 2,
      height: (screenHeight - taskbarHeight) / 2,
      label: 'Snap Top Right'
    },
    {
      id: 'bottom-left',
      x: 0,
      y: taskbarHeight + (screenHeight - taskbarHeight) / 2,
      width: screenWidth / 2,
      height: (screenHeight - taskbarHeight) / 2,
      label: 'Snap Bottom Left'
    },
    {
      id: 'bottom-right',
      x: screenWidth / 2,
      y: taskbarHeight + (screenHeight - taskbarHeight) / 2,
      width: screenWidth / 2,
      height: (screenHeight - taskbarHeight) / 2,
      label: 'Snap Bottom Right'
    },
    // Maximize zone
    {
      id: 'maximize',
      x: 0,
      y: taskbarHeight,
      width: screenWidth,
      height: screenHeight - taskbarHeight,
      label: 'Maximize'
    }
  ];

  const getZoneToShow = () => {
    if (!activeZone) return null;
    return zones.find(zone => zone.id === activeZone);
  };

  const zoneToShow = getZoneToShow();

  if (!isVisible || !zoneToShow) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-[9998] pointer-events-none"
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Active snap zone */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute border-4 border-accent bg-accent/20 rounded-lg backdrop-blur-sm"
          style={{
            left: zoneToShow.x,
            top: zoneToShow.y,
            width: zoneToShow.width,
            height: zoneToShow.height
          }}
        >
          {/* Zone label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/80 backdrop-blur-sm px-6 py-3 rounded-lg border border-accent/50">
              <div className="text-accent font-semibold text-lg text-center">
                {zoneToShow.label}
              </div>
              <div className="text-white/60 text-sm text-center mt-1">
                Release to snap
              </div>
            </div>
          </div>
        </motion.div>

        {/* Edge snap indicators */}
        {['left', 'right', 'top', 'bottom'].includes(activeZone) && (
          <>
            {/* Left edge indicator */}
            {activeZone === 'left' && (
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                className="absolute left-0 top-0 bottom-0 w-2 bg-accent shadow-lg shadow-accent/50"
              />
            )}

            {/* Right edge indicator */}
            {activeZone === 'right' && (
              <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 10, opacity: 0 }}
                className="absolute right-0 top-0 bottom-0 w-2 bg-accent shadow-lg shadow-accent/50"
              />
            )}

            {/* Top edge indicator */}
            {activeZone === 'top' && (
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="absolute top-0 left-0 right-0 h-2 bg-accent shadow-lg shadow-accent/50"
                style={{ top: taskbarHeight }}
              />
            )}

            {/* Bottom edge indicator */}
            {activeZone === 'bottom' && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 h-2 bg-accent shadow-lg shadow-accent/50"
              />
            )}
          </>
        )}

        {/* Corner indicators for quarter snaps */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(activeZone) && (
          <>
            {activeZone === 'top-left' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute w-4 h-4 bg-accent rounded-full"
                style={{ left: 8, top: taskbarHeight + 8 }}
              />
            )}

            {activeZone === 'top-right' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute w-4 h-4 bg-accent rounded-full"
                style={{ right: 8, top: taskbarHeight + 8 }}
              />
            )}

            {activeZone === 'bottom-left' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute w-4 h-4 bg-accent rounded-full"
                style={{ left: 8, bottom: 8 }}
              />
            )}

            {activeZone === 'bottom-right' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute w-4 h-4 bg-accent rounded-full"
                style={{ right: 8, bottom: 8 }}
              />
            )}
          </>
        )}

        {/* Maximize indicator */}
        {activeZone === 'maximize' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute inset-4 border-4 border-accent border-dashed rounded-lg"
            style={{ top: taskbarHeight + 16 }}
          />
        )}

        {/* Keyboard shortcuts hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-black/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
            <div className="text-white/80 text-sm text-center">
              <div className="flex items-center gap-4">
                <span>⊞+← Left</span>
                <span>⊞+→ Right</span>
                <span>⊞+↑ Top</span>
                <span>⊞+↓ Bottom</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SnapZones;