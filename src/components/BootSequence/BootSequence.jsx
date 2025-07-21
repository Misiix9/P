import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Shield, 
  CheckCircle, 
  Loader2,
  Power,
  Terminal,
  Database,
  Server,
  Globe,
  Lock,
  Zap
} from 'lucide-react';
import { playSuccess, playNotification } from '../../utils/soundManager';

const BootSequence = ({ onComplete }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [systemChecks, setSystemChecks] = useState([]);
  const [showLogo, setShowLogo] = useState(true);
  const [bootComplete, setBootComplete] = useState(false);

  const bootStages = [
    {
      id: 'power',
      name: 'System Power On',
      icon: Power,
      duration: 800,
      checks: [
        'Power supply: OK',
        'Motherboard: OK', 
        'Memory: 16GB OK'
      ]
    },
    {
      id: 'hardware',
      name: 'Hardware Initialization',
      icon: Cpu,
      duration: 1200,
      checks: [
        'CPU: Intel Core i7 (8 cores)',
        'GPU: NVIDIA GeForce RTX',
        'Storage: 1TB NVMe SSD'
      ]
    },
    {
      id: 'system',
      name: 'System Checks',
      icon: Monitor,
      duration: 1000,
      checks: [
        'Operating System: Portfolio OS v1.0',
        'Kernel: React 19 Engine',
        'Display: 1920x1080 @ 60Hz'
      ]
    },
    {
      id: 'network',
      name: 'Network Configuration',
      icon: Wifi,
      duration: 800,
      checks: [
        'Ethernet: Connected',
        'Wi-Fi: Available',
        'DNS: Configured'
      ]
    },
    {
      id: 'services',
      name: 'Starting Services',
      icon: Server,
      duration: 1000,
      checks: [
        'Desktop Environment: Loaded',
        'Window Manager: Active',
        'Audio System: Ready'
      ]
    },
    {
      id: 'security',
      name: 'Security Initialization',
      icon: Shield,
      duration: 600,
      checks: [
        'Firewall: Enabled',
        'Antivirus: Active',
        'Encryption: Ready'
      ]
    },
    {
      id: 'applications',
      name: 'Loading Applications',
      icon: Database,
      duration: 1200,
      checks: [
        'System Applications: 12 loaded',
        'User Preferences: Restored',
        'Themes: Applied'
      ]
    },
    {
      id: 'final',
      name: 'System Ready',
      icon: CheckCircle,
      duration: 500,
      checks: [
        'All systems operational',
        'Desktop ready',
        'Welcome to Portfolio OS!'
      ]
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStage < bootStages.length) {
        const stage = bootStages[currentStage];
        
        // Add checks for current stage
        stage.checks.forEach((check, index) => {
          setTimeout(() => {
            setSystemChecks(prev => [...prev, {
              id: `${stage.id}-${index}`,
              text: check,
              status: 'completed'
            }]);
            
            if (index === 0) {
              playNotification();
            }
          }, index * 200);
        });

        // Progress through the stage
        const progressTimer = setInterval(() => {
          setProgress(prev => {
            const newProgress = prev + (100 / (stage.duration / 50));
            if (newProgress >= 100) {
              clearInterval(progressTimer);
              
              // Move to next stage
              setTimeout(() => {
                if (currentStage === bootStages.length - 1) {
                  setBootComplete(true);
                  playSuccess();
                  setTimeout(() => {
                    onComplete();
                  }, 1500);
                } else {
                  setCurrentStage(prev => prev + 1);
                  setProgress(0);
                }
              }, 300);
              
              return 100;
            }
            return newProgress;
          });
        }, 50);

        return () => clearInterval(progressTimer);
      }
    }, currentStage === 0 ? 1500 : 500); // Longer delay for first stage

    return () => clearTimeout(timer);
  }, [currentStage, onComplete]);

  const currentStageData = bootStages[currentStage];
  const CurrentIcon = currentStageData?.icon || Power;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-[10000] flex items-center justify-center"
      >
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,255,208,0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative w-full max-w-2xl mx-auto px-8">
          {/* Logo Section */}
          <AnimatePresence>
            {showLogo && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="text-center mb-12"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-24 h-24 bg-accent rounded-xl mb-6"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                >
                  <Monitor className="w-12 h-12 text-black" />
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-4xl font-bold text-white mb-2"
                >
                  Portfolio OS
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-accent text-lg"
                >
                  Advanced Desktop Experience
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current Stage */}
          {currentStageData && (
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="flex-shrink-0">
                <motion.div
                  className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center"
                  animate={bootComplete ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.6 }}
                >
                  {currentStage === bootStages.length - 1 && progress === 100 ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <CurrentIcon className="w-6 h-6 text-accent" />
                    </motion.div>
                  )}
                </motion.div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2">
                  {currentStageData.name}
                </h2>
                
                {/* Progress Bar */}
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent to-accent/60 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-white/60 mt-1">
                  <span>Stage {currentStage + 1} of {bootStages.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* System Checks */}
          <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-6 max-h-80 overflow-auto">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-accent" />
              System Initialization
            </h3>
            
            <div className="space-y-2 font-mono text-sm">
              <AnimatePresence>
                {systemChecks.map((check, index) => (
                  <motion.div
                    key={check.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </motion.div>
                    <span className="text-white/80">{check.text}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Cursor blink */}
              {!bootComplete && (
                <motion.div
                  className="flex items-center gap-2"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Loader2 className="w-4 h-4 text-accent animate-spin" />
                  <span className="text-accent">Processing...</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Boot Complete Message */}
          <AnimatePresence>
            {bootComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-8"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-6 py-3 rounded-lg border border-green-500/30"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">System Ready!</span>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/60 mt-3"
                >
                  Welcome to your Portfolio Desktop Experience
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Version Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-8 text-white/40 text-sm font-mono"
          >
            <div>Portfolio OS v1.0.0</div>
            <div>Build: React 19.0.0</div>
            <div>© 2024 Professional Portfolio</div>
          </motion.div>

          {/* System Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 right-8 text-white/40 text-sm font-mono text-right"
          >
            <div className="flex items-center gap-2 justify-end">
              <Zap className="w-4 h-4" />
              <span>Powered by Modern Web Tech</span>
            </div>
            <div className="flex items-center gap-2 justify-end mt-1">
              <Globe className="w-4 h-4" />
              <span>Browser Compatible</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BootSequence;