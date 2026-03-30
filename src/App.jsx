import { Routes, Route } from 'react-router-dom'
import IntroPage from './pages/IntroPage'
import MoodCheckPage from './pages/MoodCheckPage'
import DashboardPage from './pages/DashboardPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import './index.css';

function App() {

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