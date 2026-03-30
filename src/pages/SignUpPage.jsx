import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp, signIn } from '../utils/api';
import useMoodTheme from '../utils/useMoodTheme';
import './AuthForm.css';

function SignUpPage() {
  const navigate = useNavigate();
  const theme = useMoodTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setError('');
    setIsLoading(true);

    signUp({ name, email, password })
      .then((data) => {
        if (data?.token) {
          localStorage.setItem('here.token', data.token);
          navigate('/dashboard');
          return null;
        }

        return signIn({ email, password }).then((signinData) => {
          localStorage.setItem('here.token', signinData.token);
          navigate('/dashboard');
        });
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <main className="auth-form-page" style={{ background: theme.page }}>
      <section
        className="auth-form__card"
        style={{ borderColor: theme.cardBorder, '--form-accent': theme.accent }}
      >
        <p className="auth-form__eyebrow">Create your account</p>
        <h1 className="auth-form__title">Sign Up</h1>

        <form className="auth-form__fields" onSubmit={handleSubmit} noValidate>
          <label className="auth-form__label">
            Name
            <input
              className="auth-form__input"
              type="text"
              name="name"
              placeholder="Your name"
              required
              value={name}
              onChange={(evt) => setName(evt.target.value)}
            />
          </label>

          <label className="auth-form__label">
            Email
            <input
              className="auth-form__input"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(evt) => setEmail(evt.target.value)}
            />
          </label>

          <label className="auth-form__label">
            Password
            <input
              className="auth-form__input"
              type="password"
              name="password"
              placeholder="Create a password"
              required
              minLength={8}
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
            />
          </label>

          {error && <p className="auth-form__error">{error}</p>}

          <button
            type="submit"
            className="auth-form__submit"
            disabled={isLoading || !name || !email || !password}
          >
            {isLoading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-form__switch">
          Already have an account?{' '}
          <Link to="/signin" className="auth-form__switch-link">Sign In</Link>
        </p>
      </section>
    </main>
  );
}

export default SignUpPage;