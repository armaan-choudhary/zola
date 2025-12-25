import React from 'react';
import * as FaIcons from 'react-icons/fa';
import Logo from './Logo';

const StoryCard = React.forwardRef(({ type, data, creatorName, lines, skyTier }, ref) => {
  const getStarColor = (style) => {
    switch (style) {
      case 'classic': return '#ffffff'
      case 'gold': return '#fbbf24'
      case 'blue': return '#60a5fa'
      case 'fire': return '#f87171'
      case 'purple': return '#a78bfa'
      case 'green': return '#4ade80'
      default: return '#ffffff'
    }
  }

  const tier = skyTier || { id: 1, name: "First Spark", intensity: 1 };

  // 9:16 Aspect Ratio Styles (Instagram Story Standard)
  const canvasStyle = {
    width: '1080px',
    height: '1920px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontFamily: "'Space Grotesk', sans-serif",
    position: 'fixed',
    left: '-9999px',
    top: '-9999px',
    zIndex: '-1000',
    pointerEvents: 'none',
    background: 'radial-gradient(circle at 50% 100%, #1e293b 0%, #020617 100%)',
    visibility: 'hidden'
  };

  const containerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '120px 60px',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden'
  };

  if (type === 'star') {
    const starColor = getStarColor(data.style);
    return (
      <div ref={ref} style={canvasStyle}>
        <div style={containerStyle}>
          {/* Top Branding */}
          <div style={{ textAlign: 'center' }}>
            <Logo size={140} />
            <p style={{ marginTop: '20px', letterSpacing: '10px', opacity: 0.5, textTransform: 'uppercase', fontSize: '1.2rem' }}>New Year 2026</p>
          </div>

          {/* Center Message Card */}
          <div style={{
            width: '100%',
            background: 'rgba(20, 20, 30, 0.9)',
            border: `2px solid ${starColor}40`,
            borderRadius: '60px',
            padding: '80px 60px',
            position: 'relative',
            boxShadow: `0 40px 100px rgba(0,0,0,0.5), 0 0 60px ${starColor}20`,
            backdropFilter: 'blur(30px)'
          }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '40px', marginBottom: '60px' }}>
                <div style={{ 
                  width: '160px', height: '160px', 
                  borderRadius: '40px', 
                  background: `${starColor}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '5rem',
                  border: `1px solid ${starColor}40`
                }}>
                  {data.emoji}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '2.5rem', color: '#f1f5f9', fontWeight: 500 }}>~ {data.sender_name || 'Anonymous'}</p>
                  <p style={{ margin: '10px 0 0 0', color: starColor, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '1rem' }}>Sent a Star</p>
                </div>
             </div>
             <p style={{ fontSize: '2.2rem', lineHeight: '1.5', color: '#e2e8f0', margin: 0, textAlign: 'left' }}>
               "{data.message}"
             </p>
          </div>

          {/* Bottom Link Placeholder Area */}
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{ 
              border: '4px dashed rgba(255,255,255,0.2)', 
              borderRadius: '40px', 
              padding: '40px', 
              marginBottom: '30px',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <p style={{ fontSize: '1.4rem', letterSpacing: '2px', opacity: 0.6, textTransform: 'uppercase' }}>Place Link Sticker Here</p>
            </div>
            <p style={{ fontSize: '1.2rem', opacity: 0.4 }}>Create your own sky at zola.app</p>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'constellation') {
    return (
      <div ref={ref} style={canvasStyle}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center' }}>
            <Logo size={140} />
            <p style={{ marginTop: '20px', letterSpacing: '10px', opacity: 0.5, textTransform: 'uppercase', fontSize: '1.2rem' }}>The Full Constellation</p>
          </div>

          {/* Constellation View */}
          <div style={{ position: 'relative', width: '900px', height: '900px', margin: '40px 0' }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                {lines && lines.map((line, i) => (
                    <line
                        key={i}
                        x1={`${line.p1.pos_x}%`} y1={`${line.p1.pos_y}%`}
                        x2={`${line.p2.pos_x}%`} y2={`${line.p2.pos_y}%`}
                        stroke="white" strokeWidth={4} strokeOpacity={0.15}
                    />
                ))}
            </svg>
            {data.map((star) => {
                const Icon = FaIcons[star.shape] || FaIcons.FaCircle;
                const color = getStarColor(star.style);
                return (
                    <div key={star.id} style={{
                        position: 'absolute',
                        left: `${star.pos_x}%`, top: `${star.pos_y}%`,
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        filter: `drop-shadow(0 0 10px ${color}80)`,
                        opacity: 0.9
                    }}>
                        <Icon size={24} />
                    </div>
                );
            })}
          </div>

          <div style={{ textAlign: 'center', width: '100%' }}>
             <h2 style={{ fontSize: '3.5rem', fontWeight: 300, marginBottom: '10px' }}>{creatorName}'s Sky</h2>
             <p style={{ fontSize: '1.4rem', color: '#fbbf24', letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '80px' }}>{tier.name}</p>
             
             <div style={{ 
              border: '4px dashed rgba(255,255,255,0.2)', 
              borderRadius: '40px', 
              padding: '40px', 
              background: 'rgba(255,255,255,0.02)'
            }}>
              <p style={{ fontSize: '1.4rem', letterSpacing: '2px', opacity: 0.6, textTransform: 'uppercase' }}>Place Link Sticker Here</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
});

export default StoryCard;