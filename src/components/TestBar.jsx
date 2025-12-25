import React from 'react';

/**
 * TestBar allows the developer to manually override CSS variables
 * to test combinations of Time Themes and Sky Tiers.
 */
export default function TestBar({ onTierOverride }) {
  const root = document.documentElement;

  const setTime = (hour) => {
    // Dawn
    if (hour === 6) {
      root.style.setProperty('--bg-light', '#1e1b4b');
      root.style.setProperty('--bg-dark', '#020617');
      root.style.setProperty('--accent', '#22d3ee');
      root.style.setProperty('--nebula-1', 'rgba(34, 211, 238, 0.06)');
      root.style.setProperty('--nebula-2', 'rgba(99, 102, 241, 0.06)');
    } 
    // Day
    else if (hour === 12) {
      root.style.setProperty('--bg-light', '#1e293b');
      root.style.setProperty('--bg-dark', '#020617');
      root.style.setProperty('--accent', '#fbbf24');
      root.style.setProperty('--nebula-1', 'rgba(96, 165, 250, 0.06)');
      root.style.setProperty('--nebula-2', 'rgba(167, 139, 250, 0.06)');
    } 
    // Dusk
    else if (hour === 18) {
      root.style.setProperty('--bg-light', '#2e1065');
      root.style.setProperty('--bg-dark', '#020617');
      root.style.setProperty('--accent', '#f472b6');
      root.style.setProperty('--nebula-1', 'rgba(244, 114, 182, 0.06)');
      root.style.setProperty('--nebula-2', 'rgba(139, 92, 246, 0.06)');
    } 
    // Night
    else {
      root.style.setProperty('--bg-light', '#0f172a');
      root.style.setProperty('--bg-dark', '#020617');
      root.style.setProperty('--accent', '#f1f5f9');
      root.style.setProperty('--nebula-1', 'rgba(148, 163, 184, 0.06)');
      root.style.setProperty('--nebula-2', 'rgba(30, 41, 59, 0.06)');
    }
  };

  const barStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    background: 'rgba(0,0,0,0.9)',
    padding: '10px',
    display: 'flex',
    gap: '10px',
    zIndex: 9999,
    fontSize: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  };

  const btnStyle = {
    padding: '4px 8px',
    background: '#333',
    color: 'white',
    border: '1px solid #555',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  return (
    <div style={barStyle}>
      <span style={{ color: '#aaa', alignSelf: 'center' }}>DEBUG:</span>
      <button style={btnStyle} onClick={() => setTime(6)}>🌅 DAWN</button>
      <button style={btnStyle} onClick={() => setTime(12)}>☀️ DAY</button>
      <button style={btnStyle} onClick={() => setTime(18)}>🌇 DUSK</button>
      <button style={btnStyle} onClick={() => setTime(0)}>🌃 NIGHT</button>
      <div style={{ width: '1px', background: '#555', margin: '0 5px' }} />
      <button style={btnStyle} onClick={() => onTierOverride(1)}>TIER 1</button>
      <button style={btnStyle} onClick={() => onTierOverride(2)}>TIER 2</button>
      <button style={btnStyle} onClick={() => onTierOverride(3)}>TIER 3</button>
      <button style={btnStyle} onClick={() => onTierOverride(4)}>TIER 4</button>
    </div>
  );
}
