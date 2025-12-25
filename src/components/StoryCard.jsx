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

  const backgroundStars = [
    { x: 10, y: 15, size: 4 }, { x: 85, y: 10, size: 3 }, { x: 30, y: 40, size: 5 },
    { x: 70, y: 60, size: 3 }, { x: 20, y: 80, size: 4 }, { x: 90, y: 90, size: 5 },
    { x: 50, y: 20, size: 3 }, { x: 15, y: 55, size: 4 }, { x: 80, y: 35, size: 3 },
    { x: 45, y: 75, size: 5 }, { x: 5, y: 95, size: 3 }, { x: 95, y: 5, size: 4 }
  ];

  // This wrapper keeps it in the DOM but off-screen.
  // It no longer defines the size of the capture.
  const wrapperStyle = {
    position: 'absolute',
    left: '-5000px',
    top: '0',
    pointerEvents: 'none',
    zIndex: -1000,
    background: '#020617'
  };

  // This is the actual element being captured (The Modal)
  const modalBaseStyle = {
    background: 'rgba(20, 20, 30, 0.98)',
    borderRadius: '40px',
    boxShadow: '0 50px 100px rgba(0,0,0,0.8)',
    boxSizing: 'border-box',
    fontFamily: "'Space Grotesk', sans-serif",
    color: 'white',
    overflow: 'hidden'
  };

  if (type === 'star') {
    const starColor = getStarColor(data.style);
    const isDarkText = ['classic', 'gold', 'green'].includes(data.style);

    return (
      <div style={wrapperStyle}>
        <div ref={ref} style={{ ...modalBaseStyle, width: '500px', border: `2px solid ${starColor}40`, paddingTop: '30px', position: 'relative' }}>
            {/* Background Stars Decoration */}
            {backgroundStars.map((s, i) => (
              <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, background: 'white', borderRadius: '50%', opacity: 0.15 }} />
            ))}
            
            {/* Tier-based vignette overlay */}
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle, transparent 40%, ${tier.id >= 3 ? '#fbbf24' : 'transparent'} 150%)`, opacity: tier.id >= 3 ? 0.15 : 0, pointerEvents: 'none' }} />

            <div style={{ textAlign: 'center', opacity: 0.7, marginBottom: '-5px', position: 'relative', zIndex: 1 }}>
              <Logo size={32} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px', padding: '30px', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '100px', height: '100px', 
                borderRadius: '25px', 
                background: `${starColor}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3.5rem',
                border: `1px solid ${starColor}40`
              }}>
                {data.emoji}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '1.8rem', color: '#f1f5f9', fontWeight: 500 }}>
                  ~ {data.sender_name || 'Anonymous'}
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: starColor, textTransform: 'uppercase', letterSpacing: '4px' }}>Sent a wish</p>
              </div>
            </div>

            <p style={{ textAlign: 'left', lineHeight: '1.5', fontSize: '1.4rem', padding: '0 30px 40px 30px', margin: 0, color: '#e2e8f0', fontWeight: 300 }}>
              "{data.message}"
            </p>

            <div style={{ 
                background: starColor, 
                height: '60px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: isDarkText ? '#020617' : '#ffffff', 
                fontWeight: 700, 
                fontSize: '1rem', 
                letterSpacing: '3px', 
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
      <div style={wrapperStyle}>
        <div ref={ref} style={{ ...modalBaseStyle, width: '600px', padding: '30px 40px 60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative' }}>
            {/* Background Stars Decoration */}
            {backgroundStars.map((s, i) => (
              <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, background: 'white', borderRadius: '50%', opacity: 0.15 }} />
            ))}
            
            {/* Tier-based vignette overlay */}
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle, transparent 40%, ${tier.id >= 3 ? '#fbbf24' : 'transparent'} 150%)`, opacity: tier.id >= 3 ? 0.2 : 0, pointerEvents: 'none' }} />

            <div style={{ textAlign: 'center', opacity: 0.7, marginBottom: '30px', position: 'relative', zIndex: 1 }}>
              <Logo size={32} />
            </div>
            <div style={{ position: 'relative', width: '500px', height: '500px', marginBottom: '40px', zIndex: 1 }}>
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                {lines && lines.map((line, i) => (
                    <line key={i} x1={`${line.p1.pos_x}%`} y1={`${line.p1.pos_y}%`} x2={`${line.p2.pos_x}%`} y2={`${line.p2.pos_y}%`} stroke="white" strokeWidth={3} strokeOpacity={0.2} />
                ))}
                </svg>
                {data.map((star) => {
                const Icon = FaIcons[star.shape] || FaIcons.FaCircle;
                const color = getStarColor(star.style);
                return (
                    <div key={star.id} style={{ position: 'absolute', left: `${star.pos_x}%`, top: `${star.pos_y}%`, transform: 'translate(-50%, -50%)', color: 'white', filter: `drop-shadow(0 0 10px ${color}80)`, opacity: 0.9 }}>
                    <Icon size={18} />
                    </div>
                );
                })}
            </div>

            <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '10px', margin: 0 }}>{creatorName}'s Sky</h2>
                <div style={{ fontSize: '1rem', color: '#fbbf24', letterSpacing: '6px', textTransform: 'uppercase' }}>
                    {tier.name}
                </div>
            </div>
        </div>
      </div>
    );
  }

  if (type === 'link-only') {
    return (
      <div style={wrapperStyle}>
        <div ref={ref} style={{ ...modalBaseStyle, width: '500px', padding: '30px 40px 60px 40px', textAlign: 'center', border: '2px solid #fbbf2440', position: 'relative' }}>
            {/* Background Stars Decoration */}
            {backgroundStars.map((s, i) => (
              <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, background: 'white', borderRadius: '50%', opacity: 0.15 }} />
            ))}

            <div style={{ textAlign: 'center', opacity: 0.7, marginBottom: '30px', position: 'relative', zIndex: 1 }}>
              <Logo size={32} />
            </div>
            <p style={{ fontSize: '1rem', color: '#fbbf24', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px', margin: 0, position: 'relative', zIndex: 1 }}>Join My Galaxy</p>
            <h2 style={{ fontSize: '3rem', fontWeight: 300, marginBottom: '25px', lineHeight: '1.1', margin: '15px 0' }}>Add a Star to my Sky</h2>
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '40px' }}>Send an anonymous message or wish for the new year. ✨</p>
            
            <div style={{ 
                border: '3px dashed #fbbf24', 
                borderRadius: '30px', 
                padding: '30px', 
                background: 'rgba(251, 191, 36, 0.05)' 
            }}>
              <p style={{ fontSize: '1.4rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '2px', margin: 0 }}>Tap to Add a Star</p>
            </div>
        </div>
      </div>
    );
  }

  return null;
});

export default StoryCard;