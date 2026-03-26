import { Routes, Route } from 'react-router-dom'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import MoodCheckPage from './pages/MoodCheckPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <div>
      <h1>HERE</h1>
      <p>Breathe in. You're Here.</p>

      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/mood" element={<MoodCheckPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  )
}

export default App