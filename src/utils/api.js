import { BASE_URL } from '../constants';

function handleResponse(res) {
  return res.ok
    ? res.json()
    : res.json().then((err) => Promise.reject(err));
}

export function signIn({ email, password }) {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
    .then(handleResponse)
    .catch((err) => Promise.reject(err));
}

export function signUp({ name, email, password }) {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
    .then(handleResponse)
    .catch((err) => Promise.reject(err));
}
