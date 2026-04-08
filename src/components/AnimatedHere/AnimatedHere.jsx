import './AnimatedHere.css';

function AnimatedHere({ size, variant }) {
  const sizeClass = size === 'small' ? 'here-animated--small' : '';
  const isIntro = variant === 'intro';

  const delays = isIntro
    ? ['0.2s', '1.2s', '2.2s', '3.2s']
    : ['0s', '0.15s', '0.3s', '0.45s'];

  const letterClass = isIntro ? 'here-letter here-letter--intro' : 'here-letter';
  const flipClass = isIntro
    ? 'here-letter here-letter--intro here-letter--flip-intro'
    : 'here-letter here-letter--flip';

  return (
    <span className={`here-animated ${sizeClass}`}>
      <span className={letterClass} style={{ animationDelay: delays[0] }}>H</span>
      <span className={letterClass} style={{ animationDelay: delays[1] }}>E</span>
      <span className={letterClass} style={{ animationDelay: delays[2] }}>R</span>
      <span className={flipClass} style={{ animationDelay: delays[3] }}>E</span>
    </span>
  );
}

export default AnimatedHere;
