import React, { useEffect, useRef, useState } from 'react'

export default function WeatherMap({ location, data }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const [hasLeaflet, setHasLeaflet] = useState(false)
  const { lat, lon, name } = location
  const condition = data?.current?.weather?.[0]?.main || 'Current weather'
  const temp = data?.current ? `${Math.round(data.current.temp)}&deg;` : '--'
  const bbox = `${lon - 0.08},${lat - 0.05},${lon + 0.08},${lat + 0.05}`

  useEffect(() => {
    const L = window.L
    setHasLeaflet(Boolean(L))
    if (!L || !mapRef.current) return

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, { zoomControl: true }).setView([lat, lon], 10)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current)
      mapInstance.current.marker = L.marker([lat, lon]).addTo(mapInstance.current)
    } else {
      mapInstance.current.setView([lat, lon], 10)
      mapInstance.current.marker.setLatLng([lat, lon])
    }

    mapInstance.current.marker.bindPopup(`<strong>${name}</strong><br>${condition}<br>${temp}`).openPopup()
  }, [lat, lon, name, condition, temp])

  return (
    <section className="map-card">
      <div className="section-heading">
        <h3>Weather Map</h3>
        <span>{condition}</span>
      </div>
      <div className="map-shell">
        <div ref={mapRef} className="leaflet-map" />
        {!hasLeaflet && (
          <iframe
            title={`OpenStreetMap view of ${name}`}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`}
          />
        )}
      </div>
    </section>
  )
}
