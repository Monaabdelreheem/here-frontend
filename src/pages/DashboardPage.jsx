import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../utils/api';
import useMoodTheme from '../utils/useMoodTheme';
import AnimatedHere from '../components/AnimatedHere/AnimatedHere';
import './DashboardPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  const theme = useMoodTheme();
  const [user, setUser] = useState(null);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  const handleSignOut = () => {
    localStorage.removeItem('here.token');
    navigate('/');
  };

  return (
    <div className="dashboard" style={{ background: theme.page }}>
      <header className="dashboard__header" style={{ borderBottomColor: theme.cardBorder }}>
        <p className="dashboard__logo"><AnimatedHere size="small" /></p>

        <div className="dashboard__user">
          {isLoading && <span className="dashboard__loading">Loading…</span>}
          {!isLoading && apiError && <span className="dashboard__error">{apiError}</span>}
          {!isLoading && user && (
            <span className="dashboard__name">
              {moodData?.emoji && <span aria-hidden="true">{moodData.emoji}</span>} Welcome back, {user.name}
            </span>
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
        {moodData && (
          <section className="dashboard__mood-card" style={{ borderColor: theme.cardBorder }}>
            <p className="dashboard__mood-label">Today&apos;s check-in</p>
            <p className="dashboard__mood-value">
              {moodData.emoji} {moodData.label}
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;
