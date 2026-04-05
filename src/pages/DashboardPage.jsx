import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Sad: "It's okay — you don't have to be okay.",
  Anxious: "Breathe. You're doing better than you think.",
  Tired: 'Be gentle with yourself today.',
};

const JOURNAL_KEY = 'here.journalEntry';
const TASKS_KEY = 'here.dashboardTasks';

const JOURNAL_PROMPTS = {
  Happy: 'Share something that made you smile today.',
  Calm: 'Stay with the part of today that felt calm.',
  Sad: 'Hold onto anything that felt comforting today.',
  Anxious: 'Come back to one small thing that helped you slow down.',
  Tired: 'Imagine what real rest would feel like right now.',
};

function createTask(text, index) {
  return {
    id: `${Date.now()}-${index}-${text.slice(0, 12)}`,
    text,
    done: false,
  };
}

function DashboardPage() {
  const navigate = useNavigate();
  const theme = useMoodTheme();
  const [user, setUser] = useState(null);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [journalText, setJournalText] = useState('');
  const [journalStatus, setJournalStatus] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLocation, setWeatherLocation] = useState('');
  const [weatherError, setWeatherError] = useState('');
  const [temperatureUnit, setTemperatureUnit] = useState('C');

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

  useEffect(() => {
    try {
      const raw = localStorage.getItem(TASKS_KEY);
      if (!raw) {
        setTasks([]);
        return;
      }

      const savedTasks = JSON.parse(raw);
      setTasks(Array.isArray(savedTasks) ? savedTasks : []);
    } catch {
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setWeatherError('Location is unavailable on this device.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        Promise.all([
          getWeather(coords.latitude, coords.longitude),
          getLocationName(coords.latitude, coords.longitude),
        ])
          .then(([weatherResponse, locationResponse]) => {
            setWeatherData(weatherResponse.current_weather || null);

            const placeName = locationResponse.city
              || locationResponse.locality
              || locationResponse.principalSubdivision
              || locationResponse.countryName
              || '';

            setWeatherLocation(placeName);
            setWeatherError('');
          })
          .catch(() => {
            setWeatherError('Could not load the weather right now.');
          });
      },
      () => {
        setWeatherError('Location access is off, so weather is hidden for now.');
      }
    );
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

  const persistTasks = (nextTasks) => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(nextTasks));
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
