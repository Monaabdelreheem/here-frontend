import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './IntroPage.css';
import { playAmbientAudio, setAmbientVolume } from '../utils/ambientAudio';

function AnimatedHere() {
  return (
    <span className="here-animated">
      <span className="here-letter" style={{ animationDelay: '0.2s' }}>H</span>
      <span className="here-letter" style={{ animationDelay: '1.2s' }}>E</span>
      <span className="here-letter" style={{ animationDelay: '2.2s' }}>R</span>
      <span className="here-letter here-letter--flip" style={{ animationDelay: '3.2s' }}>E</span>
    </span>
  );
}

function IntroPage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);

  const handleStart = useCallback(() => {
    if (startedRef.current) return;

    startedRef.current = true;

    setStarted(true);

    setAmbientVolume(0.5);
    playAmbientAudio().catch((err) => {
      console.log('Audio play failed:', err);
    });

    setTimeout(() => {
      navigate('/mood');
    }, 12000);
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
    <section className="intro" onClick={handleStart}>
      <div className="intro__content">
        <h1 className="intro__title">
          <AnimatedHere />
        </h1>

        <p className="intro__text intro__text--fade">Breathe in. You're HERE.</p>
        {!started && <p className="intro__text intro__text--tap">Tap anywhere to start</p>}
      </div>
    </section>
  );
}

export default IntroPage;