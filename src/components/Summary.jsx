import React from 'react'

function buildSummary(data, units) {
  if (!data?.current) return 'Loading weather insights...'
  const c = data.current
  const weather = c.weather[0]?.main || 'current'
  const rainChance = data.hourly?.slice(0, 6).reduce((max, hour) => Math.max(max, hour.chance_of_rain || 0), 0) || 0
  const uv = c.uvi
  const temp = Math.round(c.temp)
  const unit = units === 'metric' ? 'C' : 'F'
  const notes = [`Today's weather is ${temp}\u00b0${unit} with ${weather.toLowerCase()} conditions.`]

  if (uv >= 8) {
    notes.push('The UV index is very high, so avoid direct sunlight between 12 PM and 3 PM.')
  } else if (uv >= 6) {
    notes.push('Use sunscreen and shade breaks during the brightest hours.')
  }

  if (temp >= (units === 'metric' ? 38 : 100)) {
    notes.push('Carry water if you are traveling outdoors.')
  }

  if (rainChance >= 60) {
    notes.push('Rain is likely soon, so keep an umbrella nearby.')
  } else if (c.humidity >= 70) {
    notes.push('Humidity is elevated, which may make the day feel warmer.')
  }

  if (c.wind_speed >= (units === 'metric' ? 30 : 18)) {
    notes.push('Winds are strong enough to affect outdoor plans.')
  }

  return notes.join(' ')
}

export default function Summary({ data, units }) {
  const tempUnit = units === 'metric' ? 'C' : 'F'

  return (
    <div className="summary-card">
      <div className="summary-title">AI Weather Insights</div>
      <p>{buildSummary(data, units)}</p>
      <div className="summary-grid">
        <div>
          <span>Feels like</span>
          <strong>{data?.current ? <>{Math.round(data.current.feels_like)}&deg;{tempUnit}</> : '--'}</strong>
        </div>
        <div>
          <span>Dew point</span>
          <strong>{data?.current && Number.isFinite(data.current.dew_point) ? <>{Math.round(data.current.dew_point)}&deg;{tempUnit}</> : '--'}</strong>
        </div>
      </div>
    </div>
  )
}
