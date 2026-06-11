import axios from 'axios'

const KEY = import.meta.env.VITE_OPENWEATHER_KEY || ''
const BASE = 'https://api.weatherapi.com/v1'

function assertKey() {
  if (!KEY) {
    throw new Error('Missing WeatherAPI key. Add VITE_OPENWEATHER_KEY to .env and restart the dev server.')
  }
}

export async function geocode(query) {
  assertKey()
  const res = await axios.get(`${BASE}/search.json`, {
    params: { q: query, key: KEY }
  })
  if (res.status !== 200) {
    throw new Error(`Geocode request failed with status ${res.status}`)
  }
  return res.data
}

export async function reverseGeocode(lat, lon) {
  const res = await axios.get(`${BASE}/search.json`, {
    params: { q: `${lat},${lon}`, key: KEY }
  })
  return res.data
}

export async function fetchWeather(lat, lon, units = 'metric') {
  assertKey()
  const res = await axios.get(`${BASE}/forecast.json`, {
    params: { q: `${lat},${lon}`, days: 7, key: KEY, aqi: 'yes' }
  })
  
  const data = res.data
  const useMetric = units === 'metric'
  const today = data.forecast.forecastday[0]

  return {
    current: {
      temp: useMetric ? data.current.temp_c : data.current.temp_f,
      feels_like: useMetric ? data.current.feelslike_c : data.current.feelslike_f,
      humidity: data.current.humidity,
      pressure: data.current.pressure_mb,
      wind_speed: useMetric ? data.current.wind_kph : data.current.wind_mph,
      wind_deg: data.current.wind_degree,
      visibility: data.current.vis_km,
      uvi: data.current.uv,
      dew_point: useMetric ? data.current.dewpoint_c : data.current.dewpoint_f,
      cloud: data.current.cloud,
      is_day: data.current.is_day,
      air_quality: data.current.air_quality,
      weather: [{ main: data.current.condition.text, icon: data.current.condition.icon }],
      dt: data.current.last_updated_epoch,
      sunrise: today.astro.sunrise,
      sunset: today.astro.sunset,
      moon_phase: today.astro.moon_phase,
      high: useMetric ? today.day.maxtemp_c : today.day.maxtemp_f,
      low: useMetric ? today.day.mintemp_c : today.day.mintemp_f
    },
    hourly: today.hour.map(h => ({
      dt: h.time_epoch,
      temp: useMetric ? h.temp_c : h.temp_f,
      feels_like: useMetric ? h.feelslike_c : h.feelslike_f,
      humidity: h.humidity,
      wind_speed: useMetric ? h.wind_kph : h.wind_mph,
      uvi: h.uv,
      chance_of_rain: h.chance_of_rain,
      cloud: h.cloud,
      weather: [{ main: h.condition.text, icon: h.condition.icon }]
    })),
    daily: data.forecast.forecastday.map(d => ({
      dt: d.date_epoch,
      temp: {
        day: useMetric ? d.day.avgtemp_c : d.day.avgtemp_f,
        min: useMetric ? d.day.mintemp_c : d.day.mintemp_f,
        max: useMetric ? d.day.maxtemp_c : d.day.maxtemp_f
      },
      humidity: d.day.avghumidity,
      wind_speed: useMetric ? d.day.maxwind_kph : d.day.maxwind_mph,
      weather: [{ main: d.day.condition.text, icon: d.day.condition.icon }],
      sunrise: d.astro.sunrise,
      sunset: d.astro.sunset,
      moon_phase: d.astro.moon_phase,
      pop: d.day.daily_chance_of_rain
    })),
    alerts: data.alerts || []
  }
}
