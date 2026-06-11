import React, { useState } from 'react'

export default function Alerts({ alerts }){
  if (!alerts || alerts.length===0) return null
  return (
    <section className="alerts" aria-label="Weather alerts">
      <h3>Weather Alerts</h3>
      {alerts.map((a,i)=> (
        <details className="alert-card" key={i}>
          <summary aria-expanded="false" style={{color: 'var(--accent)'}}>{a.event} — {a.sender_name}</summary>
          <div>
            <p><strong>From:</strong> {a.sender_name}</p>
            <p>{a.description}</p>
            <p><em>Effective:</em> {new Date(a.start*1000).toLocaleString()} — <em>Ends:</em> {new Date(a.end*1000).toLocaleString()}</p>
          </div>
        </details>
      ))}
    </section>
  )
}
