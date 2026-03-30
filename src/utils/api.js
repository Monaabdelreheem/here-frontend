import { BASE_URL } from '../constants';

const USERS_KEY = 'here.mockUsers';
let backendIsAvailable = true;

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
    token: `mock-token-${Date.now()}`,
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

export function getUserInfo(token) {
  return fetch(`${BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(handleResponse)
    .catch((err) => {
      if (isNetworkError(err)) {
        const users = readMockUsers();
        const mockToken = localStorage.getItem('here.token') || '';
        const user = users.find((u) => mockToken.includes('mock-token')) || users[users.length - 1];
        if (user) return Promise.resolve({ name: user.name, email: user.email });
        return Promise.reject({ message: 'Could not load user info.' });
      }
      return Promise.reject(err);
    });
}

export function signIn({ email, password }) {
  if (!backendIsAvailable) {
    return fallbackSignIn({ email, password });
  }

  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
    .then(handleResponse)
    .catch((err) => {
      if (isNetworkError(err)) {
        backendIsAvailable = false;
        return fallbackSignIn({ email, password });
      }

      return Promise.reject(err);
    });
}

export function signUp({ name, email, password }) {
  if (!backendIsAvailable) {
    return fallbackSignUp({ name, email, password });
  }

  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
    .then(handleResponse)
    .catch((err) => {
      if (isNetworkError(err)) {
        backendIsAvailable = false;
        return fallbackSignUp({ name, email, password });
      }

      return Promise.reject(err);
    });
}
