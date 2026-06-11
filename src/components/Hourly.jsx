import React from 'react'

function iconUrl(icon) {
  if (!icon) return ''
  return icon.startsWith('//') ? `https:${icon}` : icon
}

export default function Hourly({ data, units }) {
  const hours = data?.hourly?.slice(0, 24) || []
  return (
    <section className="hourly">
      <h3>Hourly</h3>
      <div className="hourly-scroll">
        {hours.map(h => (
          <div className="hour-card" key={h.dt}>
            <div className="t">{new Date(h.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            {h.weather[0].icon && <img src={iconUrl(h.weather[0].icon)} alt={h.weather[0].main} />}
            <div className="temp">{Math.round(h.temp)}&deg;{units === 'metric' ? 'C' : 'F'}</div>
            <div className="rain">{h.chance_of_rain}% rain</div>
          </div>
        ))}
      </div>
    </section>
  )
}
