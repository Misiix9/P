// Sound effect utilities
// Place your .mp3 or .wav files in src/assets and update the paths below

const openSound = new Audio('/assets/open.mp3');
const closeSound = new Audio('/assets/close.mp3');
const notificationSound = new Audio('/assets/notification.mp3');

export function playOpen() {
  openSound.currentTime = 0;
  openSound.play();
}
export function playClose() {
  closeSound.currentTime = 0;
  closeSound.play();
}
export function playNotification() {
  notificationSound.currentTime = 0;
  notificationSound.play();
} 