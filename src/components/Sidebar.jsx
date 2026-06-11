import React from 'react'

export default function Sidebar({ favorites = [], recent = [], onSelectFavorite, onSelectRecent }) {
  const starterCities = ['Delhi, India', 'Mumbai, India', 'Bangalore, India']

  return (
    <div className="sidebar-panel">
      <div className="panel-block">
        <div className="panel-header">Favorite Locations</div>
        {favorites.length === 0 ? (
          <div className="chip-list">
            {starterCities.map(city => (
              <button key={city} className="panel-chip" onClick={() => onSelectRecent(city)}>
                {city}
              </button>
            ))}
            <span className="panel-chip muted">+ Add City</span>
          </div>
        ) : (
          <div className="chip-list">
            {favorites.map((item, index) => (
              <button key={index} className="panel-chip" onClick={() => onSelectFavorite(item)}>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="panel-block">
        <div className="panel-header">Recent Searches</div>
        {recent.length === 0 ? (
          <div className="chip-list">
            {starterCities.map(city => (
              <button key={city} className="panel-chip secondary" onClick={() => onSelectRecent(city)}>
                {city}
              </button>
            ))}
          </div>
        ) : (
          <div className="chip-list">
            {recent.map((label, index) => (
              <button key={index} className="panel-chip secondary" onClick={() => onSelectRecent(label)}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
