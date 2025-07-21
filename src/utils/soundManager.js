import { Howl } from 'howler';
import { useThemeStore } from '../stores/useStore';

// Sound files mapping
const soundFiles = {
  open: '/open.mp3',
  close: '/close.mp3',
  notification: '/notification.mp3',
  click: '/notification.mp3', // Using notification as click for now
  hover: '/notification.mp3',
  error: '/close.mp3',
  success: '/open.mp3',
  typing: '/notification.mp3'
};

class SoundManager {
  constructor() {
    this.sounds = {};
    this.volume = 0.3;
    this.enabled = true;
    this.initialized = false;
    
    this.init();
  }

  init() {
    // Load all sound files
    Object.entries(soundFiles).forEach(([key, src]) => {
      try {
        this.sounds[key] = new Howl({
          src: [src],
          volume: this.volume,
          preload: true,
          html5: false, // Use Web Audio API for better performance
          onloaderror: (id, error) => {
            console.warn(`Failed to load sound: ${key}`, error);
          }
        });
      } catch (error) {
        console.warn(`Error creating sound: ${key}`, error);
      }
    });
    
    this.initialized = true;
  }

  play(soundKey, options = {}) {
    // Check if sound is enabled
    const themeStore = useThemeStore.getState();
    if (!themeStore.soundEnabled || !this.enabled) return;

    const sound = this.sounds[soundKey];
    if (!sound) {
      console.warn(`Sound not found: ${soundKey}`);
      return;
    }

    try {
      // Apply options
      if (options.volume !== undefined) {
        sound.volume(options.volume);
      }
      if (options.rate !== undefined) {
        sound.rate(options.rate);
      }

      sound.play();
    } catch (error) {
      console.warn(`Error playing sound: ${soundKey}`, error);
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      if (sound) sound.volume(this.volume);
    });
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  // Convenience methods for common sounds
  playOpen(options) { this.play('open', options); }
  playClose(options) { this.play('close', options); }
  playNotification(options) { this.play('notification', options); }
  playClick(options) { this.play('click', { volume: 0.1, ...options }); }
  playHover(options) { this.play('hover', { volume: 0.05, ...options }); }
  playError(options) { this.play('error', options); }
  playSuccess(options) { this.play('success', options); }
  playTyping(options) { this.play('typing', { volume: 0.1, rate: 1.5, ...options }); }

  // Advanced features
  playSequence(sounds, delay = 100) {
    sounds.forEach((sound, index) => {
      setTimeout(() => {
        if (typeof sound === 'string') {
          this.play(sound);
        } else {
          this.play(sound.key, sound.options);
        }
      }, index * delay);
    });
  }

  fadeIn(soundKey, duration = 1000) {
    const sound = this.sounds[soundKey];
    if (!sound) return;

    sound.volume(0);
    sound.play();
    sound.fade(0, this.volume, duration);
  }

  fadeOut(soundKey, duration = 1000) {
    const sound = this.sounds[soundKey];
    if (!sound) return;

    sound.fade(sound.volume(), 0, duration);
    setTimeout(() => sound.stop(), duration);
  }

  // Cleanup
  destroy() {
    Object.values(this.sounds).forEach(sound => {
      if (sound) {
        sound.unload();
      }
    });
    this.sounds = {};
  }
}

// Create singleton instance
const soundManager = new SoundManager();

// Export convenience functions
export const playOpen = (options) => soundManager.playOpen(options);
export const playClose = (options) => soundManager.playClose(options);
export const playNotification = (options) => soundManager.playNotification(options);
export const playClick = (options) => soundManager.playClick(options);
export const playHover = (options) => soundManager.playHover(options);
export const playError = (options) => soundManager.playError(options);
export const playSuccess = (options) => soundManager.playSuccess(options);
export const playTyping = (options) => soundManager.playTyping(options);

export default soundManager;