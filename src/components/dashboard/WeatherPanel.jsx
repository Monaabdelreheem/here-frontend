import { useState } from 'react';
import { formatDashboardDate, mapWeatherCode, toFahrenheit } from './weatherUtils';
import './WeatherPanel.css';

function WeatherPanel({ weatherData, weatherLocation, weatherError, temperatureUnit, onToggleUnit }) {
  const [failedAsset, setFailedAsset] = useState('');

  const weatherMeta = mapWeatherCode(weatherData?.weathercode ?? -1, weatherData?.is_day !== 0);
  const weatherTemperature = weatherData
    ? temperatureUnit === 'C'
      ? `${Math.round(weatherData.temperature)}°C`
      : `${toFahrenheit(weatherData.temperature)}°F`
    : '--';
  const showWeatherAsset = failedAsset !== weatherMeta.asset;

  return (
    <aside className="dashboard__weather-panel">
      <div className="dashboard__weather-top">
        <p className="dashboard__weather-label">Local weather</p>
        <button
          type="button"
          className="dashboard__weather-unit"
          onClick={onToggleUnit}
        >
          °{temperatureUnit}
        </button>
      </div>

      <div className="dashboard__weather-body">
        <p className="dashboard__weather-date">{formatDashboardDate()}</p>
        <div className="dashboard__weather-hero">
          {showWeatherAsset ? (
            <img
              key={weatherMeta.asset}
              className="dashboard__weather-media"
              src={weatherMeta.asset}
              alt={weatherMeta.label}
              onError={() => setFailedAsset(weatherMeta.asset)}
            />
          ) : (
            <span className="dashboard__weather-icon" aria-hidden="true">{weatherMeta.icon}</span>
          )}
          <div className="dashboard__weather-copy">
            <p className="dashboard__weather-temp">{weatherTemperature}</p>
            <p className="dashboard__weather-summary">{weatherMeta.label}</p>
          </div>
        </div>
        <p className="dashboard__weather-place">{weatherLocation || 'Finding your location...'}</p>
        {weatherError && <p className="dashboard__weather-error">{weatherError}</p>}
      </div>

      <div className="dashboard__weather-glow dashboard__weather-glow--one" aria-hidden="true" />
      <div className="dashboard__weather-glow dashboard__weather-glow--two" aria-hidden="true" />
    </aside>
  );
}

export default WeatherPanel;