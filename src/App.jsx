import { Routes, Route } from 'react-router-dom'
import IntroPage from './pages/IntroPage'
import MoodCheckPage from './pages/MoodCheckPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/mood" element={<MoodCheckPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  )
}

export default App