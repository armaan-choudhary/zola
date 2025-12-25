import React from 'react';
import * as FaIcons from 'react-icons/fa';

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

  const canvasStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontFamily: "'Space Grotesk', sans-serif",
    position: 'fixed',
    left: '-9999px',
    top: '-9999px',
    overflow: 'hidden',
    zIndex: '-1000',
    pointerEvents: 'none',
    background: 'transparent',
    visibility: 'hidden'
  };

  const tierBadgeStyle = {
    position: 'absolute',
    bottom: '20px',
    left: '25px',
    fontSize: '0.6rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    background: 'rgba(255,255,255,0.05)',
    padding: '4px 10px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)'
  };

  if (type === 'star') {
    const starColor = getStarColor(data.style);
    const isDarkText = ['classic', 'gold', 'green'].includes(data.style);

    return (
      <div ref={ref} style={{ ...canvasStyle, width: '400px', height: 'auto', minHeight: '300px', padding: '0' }}>
        <div style={{
          width: '100%',
          background: 'rgba(20, 20, 30, 0.95)',
          border: `1px solid ${starColor}40`,
          borderRadius: '24px',
          padding: '25px',
          position: 'relative',
          boxShadow: `0 0 50px 10px ${starColor}20, inset 0 0 30px ${starColor}15`,
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {/* Header Area */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '20px', marginLeft: '-25px', marginTop: '-25px' }}>
            <div style={{ 
              width: '100px', height: '100px', 
              borderRadius: '0 0 30px 0', 
              background: `${starColor}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3rem',
              borderRight: `1px solid ${starColor}40`,
              borderBottom: `1px solid ${starColor}40`,
              boxShadow: `inset 0 0 20px ${starColor}20`
            }}>
              {data.emoji}
            </div>
            <div style={{ flex: 1, paddingTop: '20px', textAlign: 'center', paddingRight: '40px' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 10px 0', opacity: 0.6 }}>ZOLA</p>
              <p style={{ margin: 0, fontSize: '1.3rem', color: '#f1f5f9', fontWeight: 500, letterSpacing: '-0.5px' }}>
                ~ {data.sender_name || 'Anonymous'}
              </p>
            </div>
          </div>

          <p style={{ textAlign: 'justify', lineHeight: '1.6', fontSize: '1rem', marginBottom: '25px', color: '#e2e8f0' }}>
            {data.message}
          </p>

          <div style={tierBadgeStyle}>
            RANK: {tier.name}
          </div>

          <div style={{ 
            height: '40px', 
            background: starColor, 
            margin: '0 -25px -25px -25px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: isDarkText ? '#020617' : '#ffffff',
            fontWeight: 700,
            fontSize: '0.8rem',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            From {creatorName}'s Sky
          </div>
        </div>
      </div>
    );
  }

  if (type === 'constellation') {
    return (
      <div ref={ref} style={{ ...canvasStyle, width: '500px', height: 'auto', padding: '0' }}>
        <div style={{
          width: '100%',
          background: 'rgba(20, 20, 30, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 30px',
          boxSizing: 'border-box',
          position: 'relative',
          boxShadow: '0 0 60px rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }}>
            {/* Tier-based Vignette in Image */}
            <div style={{ 
                position: 'absolute', inset: 0, 
                background: `radial-gradient(circle, transparent 40%, ${tier.id >= 3 ? '#fbbf24' : 'transparent'} 150%)`,
                opacity: tier.id >= 3 ? 0.2 : 0,
                zIndex: 1
            }} />

            {/* Background Faint Stars/Snow */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1 * tier.intensity }}>
                {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: '2px', height: '2px',
                        background: 'white', borderRadius: '50%'
                    }} />
                ))}
            </div>

            <div style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '8px', opacity: 0.8, color: tier.id >= 4 ? 'var(--accent)' : '#94a3b8', marginBottom: '40px', zIndex: 10 }}>ZOLA</div>
            
            <div style={{ position: 'relative', width: '400px', height: '400px', marginBottom: '40px', overflow: 'visible', zIndex: 10 }}>
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                    {lines && lines.map((line, i) => (
                        <line
                            key={i}
                            x1={`${line.p1.pos_x}%`}
                            y1={`${line.p1.pos_y}%`}
                            x2={`${line.p2.pos_x}%`}
                            y2={`${line.p2.pos_y}%`}
                            stroke="white"
                            strokeWidth={1.5 * tier.intensity}
                            strokeOpacity={0.2 * tier.intensity}
                        />
                    ))}
                </svg>
                {data.map((star) => {
                    const Icon = FaIcons[star.shape] || FaIcons.FaCircle;
                    const color = getStarColor(star.style);
                    return (
                        <div key={star.id} style={{
                            position: 'absolute',
                            left: `${star.pos_x}%`,
                            top: `${star.pos_y}%`,
                            transform: 'translate(-50%, -50%)',
                            color: 'white',
                            filter: `drop-shadow(0 0 5px ${color}80)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0.8
                        }}>
                            <Icon size={12 + tier.intensity} />
                        </div>
                    );
                })}
            </div>

            <div style={{ textAlign: 'center', zIndex: 10 }}>
                <div style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '8px' }}>{creatorName}'s Sky</div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8', letterSpacing: '3px', textTransform: 'uppercase' }}>
                    {tier.name}
                </div>
            </div>
        </div>
      </div>
    );
  }

  return null;
});

export default StoryCard;
