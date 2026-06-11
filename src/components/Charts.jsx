import React from 'react'
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler)

export default function Charts({ data, units }) {
  const hours = data?.hourly?.slice(0, 24) || []
  const labels = hours.map(h => new Date(h.dt * 1000).getHours() + ':00')
  const temps = hours.map(h => h.temp)
  const hums = hours.map(h => h.humidity)
  const winds = hours.map(h => h.wind_speed)
  const uv = hours.map(h => h.uvi)
  const rain = hours.map(h => h.chance_of_rain)
  const windUnit = units === 'metric' ? 'km/h' : 'mph'

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { tooltip: { enabled: true, mode: 'nearest' }, legend: { display: false } },
    interaction: { intersect: false, mode: 'index' },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: 'rgba(230,238,246,0.72)' } },
      y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: 'rgba(230,238,246,0.72)' } }
    }
  }

  return (
    <section className="charts">
      <div className="chart-card">
        <h4>Temperature - Last 24 Hours</h4>
        <Line options={commonOptions} data={{ labels, datasets: [{ label: `Temp (${units === 'metric' ? 'C' : 'F'})`, data: temps, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.16)', fill: true, tension: 0.35, pointRadius: 2 }] }} />
      </div>
      <div className="chart-card">
        <h4>Humidity - Last 24 Hours</h4>
        <Bar options={commonOptions} data={{ labels, datasets: [{ label: 'Humidity %', data: hums, backgroundColor: 'rgba(56,189,248,0.65)' }] }} />
      </div>
      <div className="chart-card">
        <h4>Wind Speed Trend</h4>
        <Line options={commonOptions} data={{ labels, datasets: [{ label: `Wind ${windUnit}`, data: winds, borderColor: '#34d399', backgroundColor: 'rgba(52,211,153,0.14)', fill: true, tension: 0.35, pointRadius: 2 }] }} />
      </div>
      <div className="chart-card">
        <h4>UV Index - Morning to Evening</h4>
        <Line options={commonOptions} data={{ labels, datasets: [{ label: 'UV Index', data: uv, borderColor: '#fb7185', backgroundColor: 'rgba(251,113,133,0.14)', fill: true, tension: 0.35, pointRadius: 2 }] }} />
      </div>
      <div className="chart-card chart-wide">
        <h4>Rain Probability</h4>
        <Bar options={commonOptions} data={{ labels, datasets: [{ label: 'Rain %', data: rain, backgroundColor: 'rgba(129,140,248,0.7)' }] }} />
      </div>
    </section>
  )
}
