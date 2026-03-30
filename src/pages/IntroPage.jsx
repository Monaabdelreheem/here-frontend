import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './IntroPage.css';
import { playAmbientAudio, setAmbientVolume } from '../utils/ambientAudio';
import AnimatedHere from '../components/AnimatedHere/AnimatedHere';

const ENABLE_AMBIENT_AUDIO = false;

function IntroPage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    document.body.style.backgroundColor = '#f6f0d7';
  }, []);

  const handleStart = useCallback(() => {
    if (startedRef.current) return;

    startedRef.current = true;

    setStarted(true);

    if (ENABLE_AMBIENT_AUDIO) {
      setAmbientVolume(0.5);
      playAmbientAudio().catch((err) => {
        console.log('Audio play failed:', err);
      });
    }

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
        {!started && <p className="intro__text intro__text--tap">Tap anywhere to start</p>}
      </div>
    </section>
  );
}

export default IntroPage;