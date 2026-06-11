import React from 'react'

const Card = ({ icon, title, value, hint, tone }) => (
  <div className={`metric-card ${tone || ''}`} title={hint}>
    <div className="m-icon">{icon}</div>
    <div className="m-body">
      <div className="m-value">{value}</div>
      <div className="m-title">{title}</div>
    </div>
  </div>
)

function formatNumber(value, digits = 0) {
  return Number.isFinite(value) ? value.toFixed(digits) : '--'
}

function aqiInfo(airQuality) {
  const pm25 = airQuality?.pm2_5
  const epa = airQuality?.['us-epa-index']
  const labels = ['--', 'Good', 'Moderate', 'Unhealthy sensitive', 'Unhealthy', 'Very unhealthy', 'Hazardous']
  const label = labels[epa] || '--'
  const tone = epa <= 1 ? 'good' : epa === 2 ? 'moderate' : epa >= 3 ? 'unhealthy' : ''
  return {
    label,
    tone,
    value: Number.isFinite(pm25) ? Math.round(pm25) : '--'
  }
}

export default function Metrics({ data, units }) {
  const c = data?.current
  const aqi = aqiInfo(c?.air_quality)
  const windUnit = units === 'metric' ? 'km/h' : 'mph'
  const tempUnit = units === 'metric' ? 'C' : 'F'

  return (
    <section className="metrics">
      <Card icon="H" title="Humidity" value={c ? `${c.humidity}%` : '--'} />
      <Card icon="W" title="Wind" value={c ? `${formatNumber(c.wind_speed, 1)} ${windUnit}` : '--'} />
      <Card icon="P" title="Pressure" value={c ? `${c.pressure} hPa` : '--'} />
      <Card icon="UV" title="UV Index" value={c ? c.uvi : '--'} />
      <Card icon="V" title="Visibility" value={c ? `${formatNumber(c.visibility, 0)} km` : '--'} />
      <Card icon="AQ" title={aqi.label} value={c ? `AQI ${aqi.value}` : '--'} tone={aqi.tone} />
      <Card icon="D" title="Dew Point" value={c && Number.isFinite(c.dew_point) ? <>{Math.round(c.dew_point)}&deg;{tempUnit}</> : '--'} />
      <Card icon="C" title="Cloud Cover" value={c ? `${c.cloud}%` : '--'} />
    </section>
  )
}
