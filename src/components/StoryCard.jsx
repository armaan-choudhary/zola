import React from 'react';
import * as FaIcons from 'react-icons/fa';
import Logo from './Logo';

const StoryCard = React.forwardRef(({ type, data, creatorName, lines, skyTier, totalStars }, ref) => {
  // Check if we are on a small screen to apply a scale factor for the PREVIEW only
  // The actual capture is handled by html-to-image on the off-screen 500px element.
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 600;
  
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

  // Dynamic Background Stars Generator
  const generateBackgroundStars = (count) => {
    const stars = [];
    const seed = 123; // Use a fixed seed for static share images
    const pseudoRandom = (i) => {
      const x = Math.sin(seed + i) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < count; i++) {
      stars.push({
        x: pseudoRandom(i * 1) * 100,
        y: pseudoRandom(i * 2) * 100,
        size: pseudoRandom(i * 3) * 3 + 1
      });
    }
    return stars;
  };

  const starCount = 15 + (tier.id * 15); // Tier 1: 30, Tier 2: 45, Tier 3: 60, Tier 4: 75
  const backgroundStars = generateBackgroundStars(starCount);

  const wrapperStyle = {
    position: 'absolute',
    left: '-5000px',
    top: '0',
    pointerEvents: 'none',
    zIndex: -1000,
    background: 'transparent'
  };

  const modalBaseStyle = {
    background: 'rgba(20, 20, 30, 0.98)',
    borderRadius: '40px',
    boxShadow: '0 50px 100px rgba(0,0,0,0.8)',
    boxSizing: 'border-box',
    fontFamily: "'Space Grotesk', sans-serif",
    color: 'white',
    overflow: 'hidden'
  };

  const GOLD = "#fbbf24";
  const CARD_WIDTH = '500px';
  const CARD_HEIGHT = '750px';
  const MODAL_BG = 'rgba(20, 20, 30, 0.98)';

  const StarCounter = ({ color = 'white' }) => (
    <div style={{
      position: 'absolute',
      top: '25px',
      right: '25px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '6px 12px',
      borderRadius: '12px',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      opacity: 0.9,
      zIndex: 10
    }}>
      <span style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '1px', color: '#f1f5f9' }}>{totalStars || 0}</span>
      <FaIcons.FaStar size={12} style={{ color }} />
    </div>
  );

  if (type === 'star') {
    const starColor = getStarColor(data.style);

    return (
      <div style={wrapperStyle}>
        <div ref={ref} style={{ 
          ...modalBaseStyle, 
          width: CARD_WIDTH, 
          border: `3px solid ${starColor}60`, 
          paddingTop: '30px', 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          background: MODAL_BG
        }}>
            {backgroundStars.map((s, i) => (
              <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, background: 'white', borderRadius: '50%', opacity: 0.3 }} />
            ))}
            
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle, transparent 40%, ${tier.id >= 3 ? GOLD : 'transparent'} 150%)`, opacity: tier.id >= 3 ? 0.15 : 0, pointerEvents: 'none' }} />

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

            <div style={{ position: 'relative', zIndex: 1, padding: '0 30px 40px 30px' }}>
              <p style={{ textAlign: 'left', lineHeight: '1.5', fontSize: '1.4rem', margin: 0, color: '#e2e8f0', fontWeight: 300 }}>
                "{data.message}"
              </p>
            </div>

            <div style={{ 
                background: starColor, 
                height: '60px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: ['classic', 'gold', 'green'].includes(data.style) ? '#020617' : '#ffffff', 
                fontWeight: 700, 
                fontSize: '1rem', 
                letterSpacing: '3px', 
                textTransform: 'uppercase',
                borderBottomLeftRadius: '38px',
                borderBottomRightRadius: '38px'
            }}>
              From {creatorName}'s Sky
            </div>
        </div>
      </div>
    );
  }

  if (type === 'constellation') {
    const keystoneStarId = data[0]?.id;
    const tierId = tier.id;
    const AMBER = "rgba(251, 191, 36, 0.1)"; 
    
    let config = {
      label: "FIRST SPARK",
      phase: "01",
      themeColor: "#94a3b8",
      labelColor: "#ffffff",
      labelSize: "1.4rem",
      labelWeight: 700,
      labelSpacing: "8px",
      keystoneGlow: "none",
      haloInset: "0px",
      lineColor: "rgba(148, 163, 184, 0.15)",
      lineGlow: "none",
      bgOverlay: "none",
      subtitleColor: "#ffffff",
      narrative: "A constellation of wishes"
    };

    if (tierId === 2) {
      config = {
        label: "ASTRAL AWAKENING",
        phase: "02",
        themeColor: "#ffffff", 
        labelColor: "#ffffff", 
        labelSize: "1.8rem",
        labelWeight: 800,
        labelSpacing: "6px",
        keystoneGlow: `radial-gradient(circle, rgba(96, 165, 250, 0.4) 0%, transparent 70%)`,
        haloInset: "-6px", 
        lineColor: "rgba(96, 165, 250, 0.2)",
        lineGlow: "none",
        bgOverlay: `radial-gradient(circle at 50% 50%, rgba(96, 165, 250, 0.05) 0%, transparent 80%)`,
        subtitleColor: "#ffffff",
        narrative: "A constellation of wishes"
      };
    } else if (tierId === 3) {
      config = {
        label: "SUPERNOVA BLOOM",
        phase: "03",
        themeColor: GOLD,
        labelColor: GOLD,
        labelSize: "2.4rem",
        labelWeight: 900,
        labelSpacing: "4px",
        keystoneGlow: `radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)`,
        haloInset: "-10px", 
        lineColor: "rgba(255, 255, 255, 0.3)",
        lineGlow: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.3))",
        bgOverlay: `radial-gradient(circle at 50% 45%, ${AMBER} 0%, transparent 65%)`,
        subtitleColor: GOLD,
        narrative: "A constellation of wishes"
      };
    } else if (tierId === 4) {
      config = {
        label: "INFINITE GALAXY",
        phase: "04",
        themeColor: "#22d3ee", 
        labelColor: "#22d3ee", 
        labelSize: "3rem", // Slightly reduced from 3.4rem to ensure no overflow
        labelWeight: 900, 
        labelSpacing: "1px",
        keystoneGlow: `radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 80%)`,
        haloInset: "-12px",
        lineColor: "rgba(255, 255, 255, 0.15)",
        lineGlow: "none",
        // Enhanced Multi-colored Nebula Clouds
        bgOverlay: `
          radial-gradient(circle at 20% 30%, rgba(34, 211, 238, 0.12) 0%, transparent 60%),
          radial-gradient(circle at 80% 20%, rgba(167, 139, 250, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 60%),
          radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(21, 94, 117, 0.05) 0%, transparent 100%)
        `,
        subtitleColor: "#ffffff",
        narrative: "A galaxy shaped by shared light"
      };
    }

    const storageKey = `zola_boost_${creatorName}_${tierId}`;
    let boostActive = false;
    if (!localStorage.getItem(storageKey)) {
      boostActive = true;
      localStorage.setItem(storageKey, 'true');
    }

    return (
      <div style={wrapperStyle}>
        <div ref={ref} style={{ 
          ...modalBaseStyle, 
          width: CARD_WIDTH, 
          height: CARD_HEIGHT,
          display: 'flex', 
          flexDirection: 'column', 
          border: `3px solid ${config.themeColor}${tierId === 1 ? '40' : '60'}`, 
          position: 'relative',
          background: MODAL_BG,
        }}>
            <StarCounter color={config.themeColor} />
            {/* Ambient Background Stars */}
            {backgroundStars.map((s, i) => (
              <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, background: 'white', borderRadius: '50%', opacity: 0.2 }} />
            ))}
            
            {/* Localized Atmospheric Overlay */}
            <div style={{ position: 'absolute', inset: 0, background: config.bgOverlay, pointerEvents: 'none' }} />

            <div style={{ textAlign: 'center', paddingTop: '40px', opacity: 1, zIndex: 1 }}>
              <Logo size={48} />
            </div>

            <div style={{ position: 'relative', flex: 1, margin: '10px 40px', zIndex: 1 }}>
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                  {tierId === 4 && (
                    <defs>
                      <radialGradient id="lineFade" cx="50%" cy="50%" r="50%">
                        <stop offset="70%" stopColor="white" stopOpacity="1" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                      </radialGradient>
                      <mask id="lineMask">
                        <rect x="0" y="0" width="100%" height="100%" fill="url(#lineFade)" />
                      </mask>
                    </defs>
                  )}
                  <g mask={tierId === 4 ? "url(#lineMask)" : "none"}>
                    {lines && lines.map((line, i) => (
                        <line 
                          key={i} 
                          x1={`${line.p1.pos_x}%`} 
                          y1={`${line.p1.pos_y}%`} 
                          x2={`${line.p2.pos_x}%`} 
                          y2={`${line.p2.pos_y}%`} 
                          stroke="white" 
                          strokeWidth={1.2} 
                          strokeOpacity={0.2}
                          filter={config.lineGlow}
                        />
                    ))}
                  </g>
                </svg>
                {data.map((star, idx) => {
                  const isKeystone = star.id === keystoneStarId;
                  const Icon = FaIcons[star.shape] || FaIcons.FaCircle;
                  
                  return (
                    <div 
                      key={star.id} 
                      style={{ 
                        position: 'absolute', 
                        left: `${star.pos_x}%`, 
                        top: `${star.pos_y}%`, 
                        transform: 'translate(-50%, -50%)', 
                        color: 'white',
                        zIndex: isKeystone ? 10 : 1
                      }}
                    >
                      {isKeystone ? (
                        <div style={{ position: 'relative' }}>
                          {config.keystoneGlow !== "none" && (
                            <div style={{
                              position: 'absolute',
                              inset: boostActive ? `calc(${config.haloInset} - 4px)` : config.haloInset,
                              background: config.keystoneGlow,
                              filter: 'blur(6px)',
                              transform: 'translate(2px, -1px)',
                              opacity: boostActive ? 1 : 0.7,
                              zIndex: -1
                            }} />
                          )}
                          <Icon size={22} style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))' }} />
                        </div>
                      ) : (
                        <Icon 
                          size={9} 
                          style={{ 
                            opacity: idx % 2 === 0 ? 0.7 : 0.3,
                            filter: idx % 2 === 0 ? 'drop-shadow(0 0 3px rgba(255,255,255,0.3))' : 'none' 
                          }} 
                        />
                      )}
                    </div>
                  );
                })}
            </div>

            <div style={{ textAlign: 'center', padding: '0 40px 45px 40px', zIndex: 1 }}>
                {/* Elevated Tier Branding */}
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ 
                    fontSize: '0.85rem', 
                    color: config.labelColor, 
                    letterSpacing: '12px', 
                    textTransform: 'uppercase', 
                    margin: '0 0 8px 0', 
                    fontWeight: 900,
                    opacity: 1
                  }}>
                    PHASE {config.phase}
                  </p>
                  <h3 style={{ 
                    fontSize: config.labelSize, 
                    color: config.labelColor, 
                    letterSpacing: config.labelSpacing, 
                    textTransform: 'uppercase', 
                    margin: 0, 
                    fontWeight: config.labelWeight,
                    textShadow: tierId >= 2 ? `0 0 30px ${config.labelColor}80, 0 0 10px ${config.labelColor}` : 'none',
                    lineHeight: 1
                  }}>
                    {config.label}
                  </h3>
                </div>

                <div style={{ opacity: 0.6 }}>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: '#f1f5f9', 
                    letterSpacing: '4px', 
                    textTransform: 'uppercase', 
                    margin: '0 0 10px 0', 
                    fontWeight: 500,
                  }}>
                    {config.narrative}
                  </p>
                  <h2 style={{ 
                    fontSize: '1.4rem', 
                    fontWeight: 300, 
                    margin: 0, 
                    color: '#94a3b8',
                    letterSpacing: '1px'
                  }}>
                    {creatorName}’s sky
                  </h2>
                </div>
            </div>

            <div style={{ 
                background: config.themeColor, 
                height: '60px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#020617', 
                fontWeight: 700, 
                fontSize: '1rem', 
                letterSpacing: '3px', 
                textTransform: 'uppercase',
                borderBottomLeftRadius: '38px',
                borderBottomRightRadius: '38px'
            }}>
              Explore on ZOLA
            </div>
        </div>
      </div>
    );
  }

  if (type === 'link-only') {
    return (
      <div style={wrapperStyle}>
        <div ref={ref} style={{ 
          ...modalBaseStyle, 
          width: CARD_WIDTH, 
          padding: '30px 40px 0 40px', 
          textAlign: 'center', 
          border: `3px solid rgba(255, 255, 255, 0.4)`, 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          background: MODAL_BG
        }}>
            {/* Background Stars Decoration */}
            {backgroundStars.map((s, i) => (
              <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, background: 'white', borderRadius: '50%', opacity: 0.25 }} />
            ))}

            <div style={{ textAlign: 'center', opacity: 0.7, marginBottom: '30px', position: 'relative', zIndex: 1 }}>
              <Logo size={32} />
            </div>
            <p style={{ fontSize: '1rem', color: GOLD, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px', margin: 0, position: 'relative', zIndex: 1 }}>Join My Galaxy</p>
            <h2 style={{ fontSize: '3rem', fontWeight: 300, marginBottom: '25px', lineHeight: '1.1', margin: '15px 0' }}>Add a Star to my Sky</h2>
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '40px' }}>Send an anonymous message or wish for the new year. ✨</p>
            
            <div style={{ 
                border: `3px dashed ${GOLD}`, 
                borderRadius: '30px', 
                padding: '30px', 
                background: 'rgba(251, 191, 36, 0.05)',
                marginBottom: '40px'
            }}>
              <p style={{ fontSize: '1.4rem', color: GOLD, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '2px', margin: 0 }}>Tap to Add a Star</p>
            </div>

            <div style={{ flex: 1 }} />

            <div style={{ 
                background: '#ffffff', 
                height: '60px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#020617', 
                fontWeight: 700, 
                fontSize: '1rem', 
                letterSpacing: '3px', 
                textTransform: 'uppercase',
                margin: '0 -40px',
                borderBottomLeftRadius: '38px',
                borderBottomRightRadius: '38px'
            }}>
              Start Your Sky
            </div>
        </div>
      </div>
    );
  }

  return null;
});

export default StoryCard;