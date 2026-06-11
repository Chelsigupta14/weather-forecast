import React from 'react'

function iconUrl(icon) {
  if (!icon) return ''
  return icon.startsWith('//') ? `https:${icon}` : icon
}

export default function Daily({ data }) {
  const days = data?.daily?.slice(0, 7) || []
  return (
    <section className="daily">
      <h3>7-Day Forecast</h3>
      <div className="daily-grid">
        {days.map(d => (
          <div className="day-card" key={d.dt}>
            <div className="day">{new Date(d.dt * 1000).toLocaleDateString(undefined, { weekday: 'short' })}</div>
            {d.weather[0].icon && <img src={iconUrl(d.weather[0].icon)} alt={d.weather[0].main} />}
            <div className="minmax">{Math.round(d.temp.max)}&deg; / {Math.round(d.temp.min)}&deg;</div>
            <div className="rain">{Math.round(d.pop || 0)}% rain</div>
          </div>
        ))}
      </div>
    </section>
  )
}
