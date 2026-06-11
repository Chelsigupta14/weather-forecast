import React, { useEffect, useState, useCallback } from 'react'
import { fetchWeather, geocode, reverseGeocode } from './api/weather'
import Header from './components/Header'
import Hero from './components/Hero'
import Metrics from './components/Metrics'
import Hourly from './components/Hourly'
import Daily from './components/Daily'
import Charts from './components/Charts'
import Alerts from './components/Alerts'
import Sidebar from './components/Sidebar'
import Summary from './components/Summary'
import WeatherMap from './components/WeatherMap'

export default function App() {
  const [location, setLocation] = useState({ name: 'Unknown', lat: 40.7128, lon: -74.0060 })
  const [units, setUnits] = useState('metric')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('dark')
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('wf:favs')||'[]'))
  const [recent, setRecent] = useState(() => JSON.parse(localStorage.getItem('wf:recent')||'[]'))

  const loadAt = useCallback(async (lat, lon, name) => {
    setLoading(true)
    try {
      const w = await fetchWeather(lat, lon, units)
      setData(w)
      setLocation(l => ({ ...l, lat, lon, name: name || l.name }))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [units])

  useEffect(() => {
    const id = setInterval(() => {
      loadAt(location.lat, location.lon)
    }, 1000 * 60 * 5)
    return () => clearInterval(id)
  }, [location.lat, location.lon, loadAt])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords
        const nameData = await reverseGeocode(latitude, longitude).catch(()=>null)
        const name = nameData && nameData[0] ? `${nameData[0].name}, ${nameData[0].country}` : 'Current Location'
        loadAt(latitude, longitude, name)
      }, () => {
        loadAt(location.lat, location.lon, location.name)
      })
    } else {
      loadAt(location.lat, location.lon, location.name)
    }
  }, [])

  const handleSearch = async (q) => {
    if (!q) return
    const res = await geocode(q)
    if (res && res[0]) {
      const label = `${res[0].name}${res[0].state? ', '+res[0].state:''}, ${res[0].country}`
      loadAt(res[0].lat, res[0].lon, label)
      const next = [label, ...recent.filter(r=>r!==label)].slice(0,8)
      setRecent(next)
      localStorage.setItem('wf:recent', JSON.stringify(next))
    }
  }

  const addFavorite = () => {
    const label = location.name
    if(!label) return
    const next = [{ name: label, lat: location.lat, lon: location.lon }, ...favorites.filter(f=>f.name!==label)].slice(0,12)
    setFavorites(next)
    localStorage.setItem('wf:favs', JSON.stringify(next))
  }

  const selectFavorite = (item) => {
    loadAt(item.lat, item.lon, item.name)
  }

  const selectRecent = (label) => {
    handleSearch(label)
  }

  const condition = data?.current?.weather?.[0]?.main?.toLowerCase() || ''
  const weatherTheme = data?.current?.is_day === 0
    ? 'weather-night'
    : condition.includes('thunder')
      ? 'weather-storm'
      : condition.includes('rain')
        ? 'weather-rain'
        : condition.includes('sunny') || condition.includes('clear')
          ? 'weather-sunny'
          : 'weather-calm'

  return (
    <div className={`app ${theme} ${weatherTheme}`}>
      <Header onSearch={handleSearch} onTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} onUseLocation={() => navigator.geolocation.getCurrentPosition(p=>loadAt(p.coords.latitude,p.coords.longitude,'Current Location'))} units={units} setUnits={setUnits} onAddFavorite={addFavorite} favorites={favorites} recent={recent} />
      <main className="container">
        <div className="dashboard-grid">
          <aside className="sidebar">
            <Summary data={data} units={units} />
            <Sidebar favorites={favorites} recent={recent} onSelectFavorite={selectFavorite} onSelectRecent={selectRecent} />
          </aside>
          <section className="dashboard-content">
            <Hero data={data} location={location} loading={loading} units={units} />
            <Metrics data={data} units={units} />
            <WeatherMap location={location} data={data} />
            <Charts data={data} units={units} />
            <Hourly data={data} units={units} />
            <Daily data={data} />
            <Alerts alerts={data?.alerts || []} />
          </section>
        </div>
      </main>
    </div>
  )
}
