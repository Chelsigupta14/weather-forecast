import React from 'react'

function iconUrl(icon) {
  if (!icon) return ''
  return icon.startsWith('//') ? `https:${icon}` : icon
}

export default function Hero({ data, location, loading, units }) {
  const current = data?.current
  const temp = current ? Math.round(current.temp) : '--'
  const feels = current ? Math.round(current.feels_like) : '--'
  const condition = current?.weather?.[0]?.main || ''
  const condKey = condition.toLowerCase()
  const unit = units === 'metric' ? 'C' : 'F'
  const bgClass = current?.is_day === 0
    ? 'night'
    : condKey.includes('thunder')
      ? 'thunder'
      : condKey.includes('rain')
        ? 'rainy'
        : condKey.includes('snow')
          ? 'snowy'
          : condKey.includes('cloud')
            ? 'cloudy'
            : condKey.includes('sunny') || condKey.includes('clear')
              ? 'sunny'
              : 'calm'
  const animationClass = condKey.includes('thunder')
    ? 'with-lightning'
    : condKey.includes('rain')
      ? 'with-rain'
      : condKey.includes('cloud')
        ? 'with-clouds'
        : 'with-particles'

  return (
    <section className={`hero ${bgClass} ${animationClass}`} aria-live="polite">
      <div className="weather-animation" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="hero-card">
        <div className="hero-left">
          <div className="location">{location.name}</div>
          <div className="datetime">{current ? new Date(current.dt * 1000).toLocaleString() : '--'}</div>
          <div className="condition">{condition}</div>
          <div className="temp-row">
            <div className="temp">{temp}&deg;{unit}</div>
            {current?.weather?.[0]?.icon && (
              <img className="hero-weather-icon" src={iconUrl(current.weather[0].icon)} alt={condition} />
            )}
          </div>
          <div className="feels">Feels like {feels}&deg;{unit}</div>
          <div className="hero-range">
            High {current ? Math.round(current.high) : '--'}&deg; | Low {current ? Math.round(current.low) : '--'}&deg;
          </div>
          <div className="sun">Sunrise: {current?.sunrise || '--'} | Sunset: {current?.sunset || '--'}</div>
        </div>
        <div className="hero-right">
          <div className="hero-stat">
            <span>Cloud cover</span>
            <strong>{current ? `${current.cloud}%` : '--'}</strong>
          </div>
          <div className="hero-stat">
            <span>Moon</span>
            <strong>{current?.moon_phase || '--'}</strong>
          </div>
        </div>
      </div>
      {loading && (
        <div className="skeleton">
          <div className="s-line s-title" />
          <div className="s-line s-large" />
        </div>
      )}
    </section>
  )
}
