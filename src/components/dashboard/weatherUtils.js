const WEATHER_ASSETS = {
  clearDay: '/weather/clear-day.svg',
  clearNight: '/weather/clear-night.svg',
  cloudyDay: '/weather/partly-cloudy-day.svg',
  cloudyNight: '/weather/partly-cloudy-night.svg',
  mist: '/weather/mist.svg',
  rain: '/weather/rain.svg',
  snow: '/weather/snow.svg',
  stormDay: '/weather/thunderstorms-day-rain.svg',
  stormNight: '/weather/thunderstorms-night-rain.svg',
  default: '/weather/cloudy.svg',
};

export function formatDashboardDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function mapWeatherCode(code, isDaytime) {
  if (code === 0) {
    return {
      icon: isDaytime ? '☀️' : '🌙',
      label: isDaytime ? 'Clear skies' : 'Clear night',
      asset: isDaytime ? WEATHER_ASSETS.clearDay : WEATHER_ASSETS.clearNight,
    };
  }

  if (code >= 1 && code <= 3) {
    return {
      icon: '⛅',
      label: 'Soft clouds',
      asset: isDaytime ? WEATHER_ASSETS.cloudyDay : WEATHER_ASSETS.cloudyNight,
    };
  }

  if (code >= 45 && code <= 48) {
    return { icon: '🌫️', label: 'Misty air', asset: WEATHER_ASSETS.mist };
  }

  if (code >= 51 && code <= 67) {
    return { icon: '🌧️', label: 'Rain nearby', asset: WEATHER_ASSETS.rain };
  }

  if (code >= 71 && code <= 77) {
    return { icon: '❄️', label: 'Cold and wintry', asset: WEATHER_ASSETS.snow };
  }

  if (code >= 80 && code <= 82) {
    return { icon: '🌦️', label: 'Passing showers', asset: WEATHER_ASSETS.rain };
  }

  if (code >= 95) {
    return {
      icon: '⛈️',
      label: 'Stormy weather',
      asset: isDaytime ? WEATHER_ASSETS.stormDay : WEATHER_ASSETS.stormNight,
    };
  }

  return { icon: '🌤️', label: 'Current conditions', asset: WEATHER_ASSETS.default };
}

export function toFahrenheit(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}