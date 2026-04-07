import { BASE_URL } from '../constants';

const USERS_KEY = 'here.mockUsers';
const WEATHER_API_BASE = import.meta.env.DEV ? '/weather-api' : 'https://api.open-meteo.com';
const BACKEND_AVAILABILITY_KEY = 'here.backendAvailable';

function readBackendAvailability() {
  try {
    return localStorage.getItem(BACKEND_AVAILABILITY_KEY) !== 'false';
  } catch {
    return true;
  }
}

function writeBackendAvailability(isAvailable) {
  try {
    localStorage.setItem(BACKEND_AVAILABILITY_KEY, String(isAvailable));
  } catch {
    // Ignore storage failures and keep runtime behavior only.
  }
}

let backendIsAvailable = readBackendAvailability();

function handleResponse(res) {
  return res.ok
    ? res.json()
    : res.json().then((err) => Promise.reject(err));
}

function readMockUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeMockUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function fallbackSignUp({ name, email, password }) {
  const users = readMockUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((user) => user.email === normalizedEmail)) {
    return Promise.reject({ message: 'This email is already in use. Try signing in instead.' });
  }

  users.push({ name: name.trim(), email: normalizedEmail, password });
  writeMockUsers(users);

  return Promise.resolve({ ok: true });
}

function fallbackSignIn({ email, password }) {
  const users = readMockUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((item) => item.email === normalizedEmail);

  if (!user || user.password !== password) {
    return Promise.reject({ message: 'That email or password does not match. Please try again.' });
  }

  return Promise.resolve({
    token: `mock-token-${encodeURIComponent(normalizedEmail)}-${Date.now()}`,
    user: { name: user.name, email: user.email },
  });
}

function isNetworkError(err) {
  if (err instanceof TypeError) return true;

  const message = String(err?.message || '').toLowerCase();
  return message.includes('failed to fetch')
    || message.includes('networkerror')
    || message.includes('load failed')
    || message.includes('connection refused');
}

function getFallbackUserFromToken(token) {
  const users = readMockUsers();

  if (!token || !token.includes('mock-token')) {
    return null;
  }

  const tokenParts = token.split('-');
  const encodedEmail = tokenParts.length >= 4 ? tokenParts.slice(2, -1).join('-') : '';
  const decodedEmail = encodedEmail ? decodeURIComponent(encodedEmail) : '';
  const user = users.find((item) => item.email === decodedEmail) || users[users.length - 1];

  return user ? { name: user.name, email: user.email } : null;
}

function shouldUseLocalAuth() {
  if (!backendIsAvailable) {
    return true;
  }

  if (getFallbackUserFromToken(localStorage.getItem('here.token') || '')) {
    return true;
  }

  return readMockUsers().length > 0;
}

export function getUserInfo(token) {
  const fallbackUser = getFallbackUserFromToken(token);

  if (fallbackUser) {
    return Promise.resolve(fallbackUser);
  }

  return fetch(`${BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(handleResponse)
    .catch((err) => {
      if (isNetworkError(err)) {
        const recoveredUser = getFallbackUserFromToken(localStorage.getItem('here.token') || '');
        if (recoveredUser) return Promise.resolve(recoveredUser);
        return Promise.reject({ message: 'Could not load user info.' });
      }
      return Promise.reject(err);
    });
}

export function signIn({ email, password }) {
  if (shouldUseLocalAuth()) {
    return fallbackSignIn({ email, password });
  }

  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
    .then(handleResponse)
    .then((data) => {
      backendIsAvailable = true;
      writeBackendAvailability(true);
      return data;
    })
    .catch((err) => {
      if (isNetworkError(err)) {
        backendIsAvailable = false;
        writeBackendAvailability(false);
        return fallbackSignIn({ email, password });
      }

      return Promise.reject(err);
    });
}

export function signUp({ name, email, password }) {
  if (shouldUseLocalAuth()) {
    return fallbackSignUp({ name, email, password });
  }

  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
    .then(handleResponse)
    .then((data) => {
      backendIsAvailable = true;
      writeBackendAvailability(true);
      return data;
    })
    .catch((err) => {
      if (isNetworkError(err)) {
        backendIsAvailable = false;
        writeBackendAvailability(false);
        return fallbackSignUp({ name, email, password });
      }

      return Promise.reject(err);
    });
}

export function getWeather(latitude, longitude) {
  return fetch(
    `${WEATHER_API_BASE}/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
  ).then(handleResponse);
}

export function getLocationName(latitude, longitude) {
  return fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  ).then(handleResponse);
}
