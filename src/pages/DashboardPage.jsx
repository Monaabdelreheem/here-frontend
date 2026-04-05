import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../utils/api';
import useMoodTheme from '../utils/useMoodTheme';
import AnimatedHere from '../components/AnimatedHere/AnimatedHere';
import './DashboardPage.css';

const MOOD_MESSAGES = {
  Happy: 'Glad to have you here today.',
  Calm: 'A peaceful moment starts now.',
  Sad: "It's okay — you don't have to be okay.",
  Anxious: "Breathe. You're doing better than you think.",
  Tired: 'Be gentle with yourself today.',
};

const JOURNAL_KEY = 'here.journalEntry';

const JOURNAL_PROMPTS = {
  Happy: 'Share something that made you smile today.',
  Calm: 'Stay with the part of today that felt calm.',
  Sad: 'Hold onto anything that felt comforting today.',
  Anxious: 'Come back to one small thing that helped you slow down.',
  Tired: 'Imagine what real rest would feel like right now.',
};

function DashboardPage() {
  const navigate = useNavigate();
  const theme = useMoodTheme();
  const [user, setUser] = useState(null);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [journalText, setJournalText] = useState('');
  const [journalStatus, setJournalStatus] = useState('');

  const moodData = (() => {
    try {
      const raw = localStorage.getItem('here.moodCheckin');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const token = localStorage.getItem('here.token');

    if (!token) {
      navigate('/signin');
      return;
    }

    getUserInfo(token)
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        setApiError(err.message || 'Could not load your profile.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(JOURNAL_KEY);

      if (!raw) return;

      const savedEntry = JSON.parse(raw);
      setJournalText(savedEntry.text || '');
    } catch {
      setJournalText('');
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('here.token');
    navigate('/');
  };

  const handleSaveJournal = () => {
    const trimmedText = journalText.trim();

    localStorage.setItem(
      JOURNAL_KEY,
      JSON.stringify({
        text: trimmedText,
        updatedAt: new Date().toISOString(),
      })
    );

    setJournalStatus(trimmedText ? 'Saved to your dashboard.' : 'Journal cleared.');
  };

  const journalPrompt = moodData?.label
    ? JOURNAL_PROMPTS[moodData.label] || 'What is on your mind today?'
    : 'What is on your mind today?';

  return (
    <div className="dashboard" style={{ background: theme.page }}>
      <header className="dashboard__header" style={{ borderBottomColor: theme.cardBorder }}>
        <p className="dashboard__logo"><AnimatedHere size="small" /></p>

        <div className="dashboard__user">
          {isLoading && <span className="dashboard__loading">Loading…</span>}
          {!isLoading && apiError && <span className="dashboard__error">{apiError}</span>}
          {!isLoading && user && (
            <div className="dashboard__name-group">
              <span className="dashboard__name">
                Welcome back, {user.name}
              </span>
              {moodData?.label && (
                <span className="dashboard__tagline">
                  {MOOD_MESSAGES[moodData.label] ?? 'We\'re glad you\'re here.'}
                </span>
              )}
            </div>
          )}
          <button
            type="button"
            className="dashboard__signout"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="dashboard__main">
        <div className="dashboard__grid">
          {moodData && (
            <section className="dashboard__mood-card" style={{ borderColor: theme.cardBorder }}>
              <p className="dashboard__mood-label">Today&apos;s check-in</p>
              <p className="dashboard__mood-value">
                {moodData.emoji} {moodData.label}
              </p>
            </section>
          )}

          <section className="dashboard__journal-card" style={{ borderColor: theme.cardBorder }}>
            <div className="dashboard__journal-head">
              <p className="dashboard__mood-label">Journal</p>
              <p className="dashboard__journal-prompt">{journalPrompt}</p>
            </div>

            <label className="dashboard__journal-field" htmlFor="journal-entry">
              <span className="dashboard__journal-label">A few honest words are enough.</span>
              <textarea
                id="journal-entry"
                className="dashboard__journal-input"
                placeholder="Write whatever feels true right now..."
                value={journalText}
                onChange={(evt) => {
                  setJournalText(evt.target.value);
                  if (journalStatus) {
                    setJournalStatus('');
                  }
                }}
                rows={6}
              />
            </label>

            <div className="dashboard__journal-footer">
              <p className="dashboard__journal-status">{journalStatus}</p>
              <button
                type="button"
                className="dashboard__journal-save"
                onClick={handleSaveJournal}
              >
                Save note
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
