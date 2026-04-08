import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './IntroPage.css';
import AnimatedHere from '../components/AnimatedHere/AnimatedHere';

let ambientAudio = null;

function getAmbientAudio() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!ambientAudio) {
    ambientAudio = new Audio(`${import.meta.env.BASE_URL}audio/ambient.mp3`);
    ambientAudio.loop = true;
    ambientAudio.preload = 'auto';
    ambientAudio.volume = 0.5;
  }

  return ambientAudio;
}

function playAmbientAudio() {
  const audio = getAmbientAudio();

  if (!audio) {
    return Promise.resolve();
  }

  return audio.play();
}

function setAmbientVolume(volume) {
  const audio = getAmbientAudio();

  if (!audio) {
    return;
  }

  const safeVolume = Math.max(0, Math.min(1, volume));
  audio.volume = safeVolume;
}

function IntroPage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [audioStatus, setAudioStatus] = useState('');
  const startedRef = useRef(false);

  useEffect(() => {
    document.body.style.backgroundColor = '#f6f0d7';
  }, []);

  const handleStart = useCallback(() => {
    if (startedRef.current) return;

    startedRef.current = true;

    setStarted(true);
    setAudioStatus('Starting sound...');

    setAmbientVolume(0.5);
    playAmbientAudio()
      .then(() => {
        setAudioStatus('Sound is on');
      })
      .catch((err) => {
        console.log('Audio play failed:', err);
        setAudioStatus('Sound was blocked on this tap');
      });

    setTimeout(() => {
      navigate('/mood');
    }, 4000);
  }, [navigate]);

  useEffect(() => {
    if (startedRef.current) return undefined;

    const onFirstInteraction = () => {
      handleStart();
    };

    window.addEventListener('pointerdown', onFirstInteraction, { once: true });
    window.addEventListener('touchstart', onFirstInteraction, { once: true });
    window.addEventListener('click', onFirstInteraction, { once: true });
    window.addEventListener('keydown', onFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
      window.removeEventListener('click', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
    };
  }, [handleStart]);

  return (
    <section className={`intro${started ? ' intro--started' : ''}`} onClick={handleStart}>
      <div className="intro__content">
        <h1 className="intro__title">
          <AnimatedHere variant="intro" />
        </h1>

        <p className="intro__text intro__text--fade">Breathe in. You're HERE.</p>
        {!started && <p className="intro__text intro__text--tap">Tap anywhere to begin</p>}
        {audioStatus && <p className="intro__audio-status">{audioStatus}</p>}
      </div>
    </section>
  );
}

export default IntroPage;