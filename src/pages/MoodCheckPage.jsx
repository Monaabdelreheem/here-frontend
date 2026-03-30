import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MoodCheckPage.css';

const THEME_KEY = 'here.moodTheme';

const DEFAULT_THEME = {
  page: '#f6f0d7',
  cardBorder: '#d7ddcd',
  accent: '#6f8161',
};

const moods = [
  {
    label: 'Happy',
    emoji: '\u{1F60A}',
    note: 'Warm, open, and positive.',
    palette: { page: '#fff3d6', cardBorder: '#ffcf9a', accent: '#f3a34b' },
  },
  {
    label: 'Calm',
    emoji: '\u{1F60C}',
    note: 'Steady and grounded.',
    palette: { page: '#f6f0d7', cardBorder: '#b7c79d', accent: '#7f956f' },
  },
  {
    label: 'Sad',
    emoji: '\u{1F614}',
    note: 'Low energy and heavy feelings.',
    palette: { page: '#e8f0fa', cardBorder: '#b5c8e2', accent: '#7e9cc3' },
  },
  {
    label: 'Anxious',
    emoji: '\u{1F630}',
    note: 'Fast thoughts and tension.',
    palette: { page: '#eef2f6', cardBorder: '#c3ced8', accent: '#8ea1b0' },
  },
  {
    label: 'Tired',
    emoji: '\u{1F634}',
    note: 'Drained and ready to rest.',
    palette: { page: '#f1ecf7', cardBorder: '#d0c4e6', accent: '#9c8abf' },
  },
];

function MoodCheckPage() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState('');
  const selectedMoodData = moods.find((mood) => mood.label === selectedMood);
  const savedTheme = (() => {
    try {
      const raw = sessionStorage.getItem(THEME_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const activeTheme = selectedMoodData?.palette || savedTheme || DEFAULT_THEME;

  const handleSelectMood = (mood) => {
    setSelectedMood(mood.label);

    document.body.style.backgroundColor = mood.palette.page;
    sessionStorage.setItem(THEME_KEY, JSON.stringify(mood.palette));
  };

  const handleAuthChoice = (mode) => {
    if (!selectedMoodData) return;

    const payload = {
      label: selectedMoodData.label,
      emoji: selectedMoodData.emoji,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('here.moodCheckin', JSON.stringify(payload));
    navigate(`/${mode}`);
  };

  return (
    <main
      className="mood-checkin"
      style={{ background: activeTheme.page }}
    >
      <section
        className="mood-checkin__card"
        style={{ borderColor: activeTheme.cardBorder }}
      >
        <p className="mood-checkin__eyebrow">Mood Check-In</p>
        <h1 className="mood-checkin__title">How are you feeling right now?</h1>
        <p className="mood-checkin__subtitle">Pick your mood. Sign In and Sign Up will show up below.</p>

        <div className="mood-checkin__grid" role="radiogroup" aria-label="Mood options">
          {moods.map((mood) => {
            const isSelected = selectedMood === mood.label;

            return (
              <button
                key={mood.label}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`mood-chip${isSelected ? ' mood-chip--selected' : ''}`}
                onClick={() => handleSelectMood(mood)}
              >
                <span className="mood-chip__emoji" aria-hidden="true">{mood.emoji}</span>
                <span className="mood-chip__label">{mood.label}</span>
                <span className="mood-chip__desc">{mood.note}</span>
              </button>
            );
          })}
        </div>

        <div className="mood-checkin__footer">
          <p className="mood-checkin__selection">
            {selectedMoodData
              ? `Selected: ${selectedMoodData.label}. Choose Sign In or Sign Up to continue.`
              : 'Select a mood to unlock Sign In and Sign Up.'}
          </p>

          {selectedMoodData && (
            <div className="mood-checkin__actions mood-checkin__actions--visible">
              <button
                type="button"
                className="mood-checkin__action"
                onClick={() => handleAuthChoice('signin')}
              >
                Sign In
              </button>
              <button
                type="button"
                className="mood-checkin__action mood-checkin__action--selected"
                onClick={() => handleAuthChoice('signup')}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default MoodCheckPage;