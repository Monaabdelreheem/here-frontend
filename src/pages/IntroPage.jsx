import { useNavigate } from 'react-router-dom'
import './IntroPage.css'

function IntroPage() {
  const navigate = useNavigate()

  return (
    <section className="intro">
      <div className="intro__content">
        <h1 className="intro__title">HERE</h1>
        <p className="intro__text">Breathe in. You're here.</p>
        <button
          className="intro__button"
          onClick={() => navigate('/mood')}
        >
          Continue
        </button>
      </div>
    </section>
  )
}

export default IntroPage