/**
 * Audio utility for generating attendance notification sounds
 * Uses Web Audio API to generate a simple beep tone
 */

export function playAttendanceSound() {
  try {
    // Create audio context (use webkit prefix for Safari compatibility)
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    // Create oscillator for the tone
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Connect nodes: oscillator → gainNode → speakers
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configure sound parameters
    oscillator.frequency.value = 1000; // Hz (A4 note - pleasant beep frequency)
    oscillator.type = 'sine'; // Smooth sine wave tone

    // Volume envelope: fade in/out to prevent clicks and pops
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Initial volume (0.3 = not jarring)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5); // Fade out over 0.5 seconds

    // Play the tone for 0.5 seconds
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    // Silently fail if audio context is not available
    console.warn('Could not play attendance sound:', error);
  }
}
