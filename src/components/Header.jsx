import React, { useEffect, useRef, useState } from 'react'
import { geocode } from '../api/weather'
import debounce from '../utils/debounce'

export default function Header({ onSearch, onTheme, onUseLocation, units, setUnits, onAddFavorite }) {
  const [q, setQ] = useState('')
  const [suggests, setSuggests] = useState([])
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  const doSuggest = debounce(async (val) => {
    if (!val) return setSuggests([])
    try {
      const res = await geocode(val)
      setSuggests(res.slice(0, 6))
      setOpen(true)
    } catch (e) {
      setSuggests([])
    }
  }, 300)

  useEffect(() => {
    doSuggest(q)
  }, [q])

  const submit = () => {
    onSearch(q)
    setQ('')
    setOpen(false)
  }

  const choose = (item) => {
    const label = `${item.name}${item.state ? ', ' + item.state : ''}, ${item.country}`
    setQ('')
    setSuggests([])
    setOpen(false)
    onSearch(label)
  }

  return (
    <header className="header" ref={ref}>
      <div className="brand">
        <div className="logo" aria-hidden>☀</div>
        <div className="title">Weather Forecast</div>
      </div>
      <div className="search" role="search">
        <input
          aria-label="Search city or ZIP"
          placeholder="Search city, country, or ZIP"
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
        />
        <button onClick={submit} aria-label="Search">Search</button>
        <button onClick={onUseLocation} aria-label="Use my location">My Location</button>

        {open && suggests.length > 0 && (
          <ul className="suggestions" role="listbox">
            {suggests.map((s, i) => (
              <li key={i} role="option" onClick={() => choose(s)}>
                {s.name}{s.state ? `, ${s.state}` : ''} - {s.country}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="controls">
        <select aria-label="Units" value={units} onChange={e => setUnits(e.target.value)}>
          <option value="metric">C</option>
          <option value="imperial">F</option>
        </select>
        <button onClick={onTheme} className="theme-toggle" aria-pressed="false">Theme</button>
        <div className="fav">
          <button onClick={() => onAddFavorite && onAddFavorite()} title="Add current to favorites">★</button>
        </div>
      </div>
    </header>
  )
}
