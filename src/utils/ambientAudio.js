let ambientAudio = null;

function getAmbientAudio() {
  if (typeof window === 'undefined') return null;

  if (!ambientAudio) {
    ambientAudio = new Audio('/audio/ambient.mp3');
    ambientAudio.loop = true;
    ambientAudio.preload = 'auto';
    ambientAudio.volume = 0.5;
  }

  return ambientAudio;
}

export function playAmbientAudio() {
  const audio = getAmbientAudio();
  if (!audio) return Promise.resolve();

  return audio.play();
}

export function stopAmbientAudio() {
  const audio = getAmbientAudio();
  if (!audio) return;

  audio.pause();
  audio.currentTime = 0;
}

export function setAmbientVolume(volume) {
  const audio = getAmbientAudio();
  if (!audio) return;

  const safeVolume = Math.max(0, Math.min(1, volume));
  audio.volume = safeVolume;
}
