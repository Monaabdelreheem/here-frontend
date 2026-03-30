import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import IntroPage from './pages/IntroPage'
import MoodCheckPage from './pages/MoodCheckPage'
import DashboardPage from './pages/DashboardPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import './index.css';

function App() {
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('here.moodTheme')
      if (!raw) return

      const theme = JSON.parse(raw)
      if (theme?.page) {
        document.body.style.backgroundColor = theme.page
      }
    } catch {
      // keep default background on invalid session data
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/mood" element={<MoodCheckPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  )
}

export default App