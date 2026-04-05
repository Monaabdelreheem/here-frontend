# HERE Frontend

HERE is a small wellness app frontend built with React and Vite.

The idea behind it is simple: instead of dropping the user straight into a dashboard, the app starts with a short intro, asks how they are feeling, and then carries that mood into the rest of the experience. From there, the user can sign in or sign up and land on a dashboard with weather, a journal space, and a short task list.

## Features

- Intro screen with animated branding
- Mood check-in before authentication
- Mood-based theme carried across pages
- Sign In and Sign Up forms
- Dashboard with local weather and location
- Temperature toggle between Celsius and Fahrenheit
- Small daily task list saved in local storage
- Journal section saved in local storage
- Fallback local auth flow when the backend is unavailable

## Tech Stack

- React 19
- Vite 8
- React Router 7
- Plain CSS split by page and component
- Open-Meteo API for weather data
- BigDataCloud reverse geocoding for location names

## Project Flow

The current flow through the app is:

1. Intro page
2. Mood check-in
3. Sign In or Sign Up
4. Dashboard

The selected mood is stored and reused to theme later screens.

## Getting Started

### Requirements

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Backend Notes

The frontend is currently set up to talk to the backend at:

```txt
http://localhost:3001
```

This is configured in `src/constants.js`.

If the backend is not running, the auth flow falls back to local storage so the frontend can still be tested and demoed. That fallback is there to make development easier, not to replace a real backend in production.

## Scripts

- `npm run dev` starts the Vite development server
- `npm run build` creates a production build
- `npm run preview` previews the production build locally
- `npm run lint` runs ESLint

## Project Structure

```txt
src/
  components/
    AnimatedHere/
    dashboard/
  pages/
    IntroPage.jsx
    MoodCheckPage.jsx
    SignInPage.jsx
    SignUpPage.jsx
    DashboardPage.jsx
  utils/
    api.js
    ambientAudio.js
    useMoodTheme.js
public/
  audio/
  weather/
```

## Weather Assets

The animated SVG weather icons used by the dashboard live in `public/weather`.

## Current Status

The frontend builds successfully and the main user flow is working from the intro screen all the way to the dashboard.

At this point, the main work left is final polish: deployment, backend consistency, and a last cleanup pass before submission.

## Coming Updates

Some features I still want to add next are:

- music integration through an API
- supportive quotes through an API

The goal is to make the dashboard feel more comforting and more personal instead of just functional.
