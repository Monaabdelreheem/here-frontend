import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../constants';
import { getLocationName, getUserInfo, getWeather } from '../utils/api';
import useMoodTheme from '../utils/useMoodTheme';
import AnimatedHere from '../components/AnimatedHere/AnimatedHere';
import WeatherPanel from '../components/dashboard/WeatherPanel';
import TaskCard from '../components/dashboard/TaskCard';
import JournalCard from '../components/dashboard/JournalCard';
import './DashboardPage.css';

const MOOD_MESSAGES = {
  Happy: 'Glad to have you here today.',
  Calm: 'A peaceful moment starts now.',
  Sad: "It's okay. You don't have to be okay.",
  Anxious: "Breathe. You're doing better than you think.",
  Tired: 'Be gentle with yourself today.',
};

const JOURNAL_PROMPTS = {
  Happy: 'Share something that made you smile today.',
  Calm: 'Stay with the part of today that felt calm.',
  Sad: 'Hold onto anything that felt comforting today.',
  Anxious: 'Come back to one small thing that helped you slow down.',
  Tired: 'Imagine what real rest would feel like right now.',
};

const DEFAULT_TASKS = [
  'Carry one good moment with you.',
  'Send a kind message to someone.',
  'Take a short pause and enjoy it.',
];

function readStoredJournalText() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.journalEntry);

    if (!raw) {
      return '';
    }

    const savedEntry = JSON.parse(raw);
    return savedEntry.text || '';
  } catch {
    return '';
  }
}

function createTask(text, index) {
  return {
    id: `${Date.now()}-${index}-${text.slice(0, 12)}`,
    text,
    done: false,
  };
}

function createStarterTasks() {
  return DEFAULT_TASKS.map((task, index) => createTask(task, index));
}

function readStoredTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.dashboardTasks);

    if (!raw) {
      return createStarterTasks();
    }

    const savedTasks = JSON.parse(raw);
    return Array.isArray(savedTasks) && savedTasks.length > 0 ? savedTasks : createStarterTasks();
  } catch {
    return createStarterTasks();
  }
}

function getInitialWeatherError() {
  return typeof navigator !== 'undefined' && !navigator.geolocation
    ? 'Location is unavailable on this device.'
    : '';
}

function DashboardPage() {
  const navigate = useNavigate();
  const theme = useMoodTheme();
  const [user, setUser] = useState(null);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [journalText, setJournalText] = useState(readStoredJournalText);
  const [journalStatus, setJournalStatus] = useState('');
  const [tasks, setTasks] = useState(readStoredTasks);
  const [taskInput, setTaskInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLocation, setWeatherLocation] = useState('');
  const [weatherError, setWeatherError] = useState(getInitialWeatherError);
  const [temperatureUnit, setTemperatureUnit] = useState('C');

  const moodData = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.moodCheckin);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  function persistTasks(nextTasks) {
    localStorage.setItem(STORAGE_KEYS.dashboardTasks, JSON.stringify(nextTasks));
  }

  useEffect(() => {
    persistTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.token);

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
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        Promise.allSettled([
          getWeather(coords.latitude, coords.longitude),
          getLocationName(coords.latitude, coords.longitude),
        ])
          .then(([weatherResult, locationResult]) => {
            if (weatherResult.status === 'fulfilled') {
              setWeatherData(weatherResult.value.current_weather || null);
              setWeatherError('');
            } else {
              setWeatherData(null);
              setWeatherError('Live weather is unavailable right now.');
            }

            if (locationResult.status === 'fulfilled') {
              const locationResponse = locationResult.value;
              const placeName = locationResponse.city
                || locationResponse.locality
                || locationResponse.principalSubdivision
                || locationResponse.countryName
                || '';

              setWeatherLocation(placeName);
            }
          });
      },
      () => {
        setWeatherError('Location access is off, so weather is hidden for now.');
      }
    );
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem(STORAGE_KEYS.token);
    navigate('/');
  };

  const handleSaveJournal = () => {
    const trimmedText = journalText.trim();

    localStorage.setItem(
      STORAGE_KEYS.journalEntry,
      JSON.stringify({
        text: trimmedText,
        updatedAt: new Date().toISOString(),
      })
    );

    setJournalStatus(trimmedText ? 'Saved to your dashboard.' : 'Journal cleared.');
  };

  const handleToggleTask = (taskId) => {
    setTasks((currentTasks) => {
      const nextTasks = currentTasks.map((task) => (
        task.id === taskId ? { ...task, done: !task.done } : task
      ));

      persistTasks(nextTasks);
      return nextTasks;
    });
  };

  const handleDeleteTask = (taskId) => {
    setTasks((currentTasks) => {
      const nextTasks = currentTasks.filter((task) => task.id !== taskId);
      persistTasks(nextTasks);
      return nextTasks;
    });
  };

  const handleAddTask = () => {
    const trimmedTask = taskInput.trim();

    if (!trimmedTask) return;

    setTasks((currentTasks) => {
      const nextTasks = [...currentTasks, createTask(trimmedTask, currentTasks.length)];
      persistTasks(nextTasks);
      return nextTasks;
    });

    setTaskInput('');
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
        <div className="dashboard__layout">
          <WeatherPanel
            weatherData={weatherData}
            weatherLocation={weatherLocation}
            weatherError={weatherError}
            temperatureUnit={temperatureUnit}
            onToggleUnit={() => setTemperatureUnit((currentUnit) => (currentUnit === 'C' ? 'F' : 'C'))}
          />

          <div className="dashboard__content">
            {moodData && (
              <section className="dashboard__mood-card" style={{ borderColor: theme.cardBorder }}>
                <p className="dashboard__mood-label">Today&apos;s check-in</p>
                <p className="dashboard__mood-value">
                  {moodData.emoji} {moodData.label}
                </p>
              </section>
            )}

            <div className="dashboard__grid">
              <TaskCard
                theme={theme}
                tasks={tasks}
                taskInput={taskInput}
                setTaskInput={setTaskInput}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onAddTask={handleAddTask}
              />

              <JournalCard
                theme={theme}
                journalPrompt={journalPrompt}
                journalText={journalText}
                journalStatus={journalStatus}
                setJournalText={(value) => {
                  setJournalText(value);
                  if (journalStatus) {
                    setJournalStatus('');
                  }
                }}
                onSaveJournal={handleSaveJournal}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="dashboard__footer">
        <p className="dashboard__footer-text">Take what helps. Leave the rest. Come back whenever you need.</p>
        <p className="dashboard__copyright">Copyright © 2026 Mona Abdelreheem. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default DashboardPage;
