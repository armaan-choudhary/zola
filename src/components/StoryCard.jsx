import React from 'react';
import * as FaIcons from 'react-icons/fa';
import Logo from './Logo';

const StarCounter = ({ totalStars, color = 'white' }) => (
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

const StoryCard = React.forwardRef(({ type, data, creatorName, lines, skyTier, totalStars, isGallery = false }, ref) => {
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

  const generateBackgroundStars = (count) => {
    const stars = [];
    const seed = 123; 
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

  const starCount = 15 + (tier.id * 15);
  const backgroundStars = generateBackgroundStars(starCount);

  const modalBaseStyle = {
    background: 'rgba(20, 20, 30, 0.98)',
    borderRadius: '0',
    border: '6px solid #000',
    boxShadow: '0 50px 100px rgba(0,0,0,0.8)',
    boxSizing: 'border-box',
    fontFamily: "'Space Grotesk', sans-serif",
    color: 'white',
    overflow: 'hidden'
  };

  const CARD_WIDTH = '500px';
  const CARD_HEIGHT = '750px';
  const GOLD = "#fbbf24";
  const AMBER = "rgba(251, 191, 36, 0.1)"; 
  const footerTextColorDefault = '#020617';

  // Static Shooting Stars Config
  let shootingStars = [];
  if (tier.id === 3) {
      shootingStars = [
          { top: '10%', left: '20%', width: '70px', rotate: '-35deg', opacity: 0.5 },
          { top: '80%', left: '60%', width: '90px', rotate: '-45deg', opacity: 0.3 },
      ];
  } else if (tier.id === 4) {
      shootingStars = [
          { top: '15%', left: '75%', width: '80px', rotate: '-45deg', opacity: 0.6 },
          { top: '50%', left: '5%', width: '100px', rotate: '-25deg', opacity: 0.4 },
          { top: '85%', left: '25%', width: '80px', rotate: '-40deg', opacity: 0.5 },
      ];
  }

  let cardContent;

  switch (type) {
    case 'star': {
      const starColor = getStarColor(data.style);
      const footerTextColor = ['classic', 'gold', 'green'].includes(data.style) ? '#020617' : '#ffffff';

      cardContent = (
        <div ref={ref} style={{ 
          ...modalBaseStyle, 
          width: CARD_WIDTH, 
          height: 'auto', 
          minHeight: '350px',
          paddingTop: '20px', 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(20, 20, 30, 0.98)'
        }}>
            {backgroundStars.map((s, i) => (
              <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, background: 'white', borderRadius: '50%', opacity: 0.3 }} />
            ))}

            {[
                { top: '10%', left: '70%', width: '80px', rotate: '-45deg', opacity: 0.4 },
                { top: '60%', left: '10%', width: '90px', rotate: '-35deg', opacity: 0.3 },
            ].map((s, i) => (
              <div key={i} style={{
                position: 'absolute',
                top: s.top,
                left: s.left,
                width: s.width,
                height: '2px',
                background: 'linear-gradient(90deg, white, transparent)',
                transform: `rotate(${s.rotate})`,
                opacity: s.opacity,
                zIndex: 0
              }}>
                <div style={{ position: 'absolute', left: 0, top: '-1px', width: '4px', height: '4px', background: 'white', borderRadius: '50%', boxShadow: '0 0 10px white' }} />
              </div>
            ))}
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '25px 30px', position: 'relative', zIndex: 1 }}>
                <div style={{ 
                    width: '80px', height: '80px', 
                    borderRadius: '20px', 
                    background: `${starColor}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '3rem',
                    border: `1px solid ${starColor}40`
                }}>{data.emoji}</div>
                <div>
                    <p style={{ margin: 0, fontSize: '1.6rem', color: '#f1f5f9', fontWeight: 500 }}>
                    ~ {data.sender_name || 'Anonymous'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: starColor, textTransform: 'uppercase', letterSpacing: '1px' }}>Sent a wish on</p>
                        <Logo size={18} color={starColor} />
                    </div>
                </div>
                </div>

                <div style={{ position: 'relative', zIndex: 1, padding: '0 30px 40px 30px' }}>
                <p style={{ textAlign: 'left', lineHeight: '1.5', fontSize: '1.3rem', margin: 0, color: '#e2e8f0', fontWeight: 300 }}>
                    "{data.message}"
                </p>
                </div>
            </div>

            <div style={{ 
                background: starColor, 
                height: '60px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '0 20px',
                color: footerTextColor, 
                fontWeight: 700, 
                fontSize: '0.85rem', 
                letterSpacing: '2px', 
                textTransform: 'uppercase',
                borderRadius: 0,
                marginTop: 'auto',
                position: 'relative',
                zIndex: 1
            }}>
              <span>From {creatorName}'s sky</span>
            </div>
        </div>
      );
      break;
    }

    case 'constellation': {
      const tierId = tier.id;
      const narratives = {
        1: ["The first spark of 2026", "A quiet sky awaits", "The beginning of light"],
        2: ["The constellation forms", "Blue light finding its way", "A web of wishes"],
        3: ["A supernova of love", "Golden light everywhere", "The sky is blooming"],
        4: ["Infinite galaxy of us", "Colors beyond time", "The universe is ours"]
      };

      const getNarrative = (tId, name) => {
          const str = (name || "ZOLA") + tId;
          let hash = 0;
          for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
          const options = narratives[tId] || narratives[1];
          return options[Math.abs(hash) % options.length];
      };

      const narrative = getNarrative(tierId, creatorName);
      
      let config = {
        label: "FIRST SPARK",
        phase: "01",
        themeColor: "#94a3b8",
        labelColor: "#ffffff",
        labelWeight: 700,
        labelSpacing: "8px",
        bgOverlay: "none",
        narrative: narrative
      };

      if (tierId === 2) {
        config = { ...config, label: "ASTRAL AWAKENING", phase: "02", themeColor: "#ffffff", labelWeight: 800, labelSpacing: "6px", bgOverlay: `radial-gradient(circle at 50% 50%, rgba(96, 165, 250, 0.05) 0%, transparent 80%)` };
      } else if (tierId === 3) {
        config = { ...config, label: "SUPERNOVA BLOOM", phase: "03", themeColor: GOLD, labelColor: GOLD, labelWeight: 900, labelSpacing: "4px", bgOverlay: `radial-gradient(circle at 50% 45%, ${AMBER} 0%, transparent 65%)` };
      } else if (tierId === 4) {
        config = { ...config, label: "INFINITE GALAXY", phase: "04", themeColor: "#22d3ee", labelColor: "#22d3ee", labelWeight: 900, labelSpacing: "1px", bgOverlay: `radial-gradient(circle at 50% 50%, rgba(21, 94, 117, 0.05) 0%, transparent 100%)` };
      }

      cardContent = (
        <div ref={ref} style={{ 
          ...modalBaseStyle, 
          width: CARD_WIDTH, 
          height: CARD_HEIGHT,
          display: 'flex', 
          flexDirection: 'column', 
          position: 'relative',
          background: 'rgba(20, 20, 30, 0.98)',
        }}>
            <StarCounter totalStars={totalStars} color={config.themeColor} />
            {backgroundStars.map((s, i) => (
              <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, background: 'white', borderRadius: '50%', opacity: 0.2 }} />
            ))}

            {(tierId === 3 || tierId === 4) && shootingStars.map((s, i) => (
              <div key={i} style={{ position: 'absolute', top: s.top, left: s.left, width: s.width, height: '2px', background: 'linear-gradient(90deg, white, transparent)', transform: `rotate(${s.rotate})`, opacity: s.opacity, zIndex: 0 }}>
                <div style={{ position: 'absolute', left: 0, top: '-1px', width: '4px', height: '4px', background: 'white', borderRadius: '50%', boxShadow: '0 0 10px white' }} />
              </div>
            ))}
            
            <div style={{ position: 'absolute', inset: 0, background: config.bgOverlay, pointerEvents: 'none' }} />

            <div style={{ textAlign: 'center', paddingTop: '40px', opacity: 1, zIndex: 1 }}>
              <Logo size={48} />
            </div>

            <div style={{ position: 'relative', flex: 1, margin: '10px 40px', zIndex: 1 }}>
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                  <defs>
                    <radialGradient id="lineFade" cx="50%" cy="50%" r="50%">
                      <stop offset="70%" stopColor="white" stopOpacity="1" />
                      <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                    <mask id="lineMask"><rect x="0" y="0" width="100%" height="100%" fill="url(#lineFade)" /></mask>
                  </defs>
                  <g mask={tierId === 4 ? "url(#lineMask)" : "none"}>
                    {lines && lines.map((line, i) => (
                        <line 
                          key={i} 
                          x1={`${line.p1.pos_x}%`} y1={`${line.p1.pos_y}%`} 
                          x2={`${line.p2.pos_x}%`} y2={`${line.p2.pos_y}%`} 
                          stroke={tierId === 4 ? "#22d3ee" : tierId === 3 ? GOLD : tierId === 2 ? "#60a5fa" : "white"}
                          strokeWidth={tierId === 4 ? 3 : tierId === 3 ? 1.8 : 1.2} 
                          strokeOpacity={tierId === 1 ? 0.2 : 1}
                        />
                    ))}
                  </g>
                </svg>
                {data.map((star) => {
                  const Icon = FaIcons[star.shape] || FaIcons.FaCircle;
                  return (
                    <div key={star.id} style={{ position: 'absolute', left: `${star.pos_x}%`, top: `${star.pos_y}%`, transform: 'translate(-50%, -50%)', color: 'white', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {tierId === 4 && (
                        <div style={{ position: 'absolute', width: '40px', height: '40px', borderRadius: '50%', border: `1.5px solid ${getStarColor(star.style)}`, borderLeftColor: 'transparent', borderRightColor: 'transparent', opacity: 0.5, zIndex: -1, transform: 'rotate(45deg)' }} />
                      )}
                      <Icon size={12} style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))' }} />
                    </div>
                  );
                })}
            </div>

            <div style={{ textAlign: 'center', padding: '0 40px 45px 40px', zIndex: 1 }}>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '0.85rem', color: config.labelColor, letterSpacing: '12px', textTransform: 'uppercase', margin: '0 0 12px 0', fontWeight: 900 }}>PHASE {config.phase}</p>
                  <div style={{ color: config.labelColor, textTransform: 'uppercase', fontWeight: config.labelWeight, lineHeight: 0.9, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    {config.label.split(" ").map((word, i) => (
                      <span key={i} style={{ display: 'block', fontSize: tierId === 4 ? '3.6rem' : '3.2rem', letterSpacing: config.labelSpacing }}>{word}</span>
                    ))}
                  </div>
                </div>
                <div style={{ opacity: 0.8 }}>
                  <p style={{ fontSize: '0.75rem', color: '#f1f5f9', letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 10px 0', fontWeight: 500 }}>{config.narrative}</p>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#94a3b8', letterSpacing: '1px' }}>{creatorName}’s sky</h2>
                </div>
            </div>

            <div style={{ background: config.themeColor, height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', color: footerTextColorDefault, fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', borderRadius: 0, gap: '6px' }}>
                <span>Get your own on</span><Logo size={24} color={footerTextColorDefault} />
            </div>
        </div>
      );
      break;
    }

    case 'link-only': {
      cardContent = (
        <div ref={ref} style={{ 
          ...modalBaseStyle, width: CARD_WIDTH, height: CARD_HEIGHT,
          padding: '40px 40px 0 40px', textAlign: 'center', position: 'relative',
          display: 'flex', flexDirection: 'column', background: 'rgba(20, 20, 30, 0.98)',
          justifyContent: 'space-between'
        }}>
            {generateBackgroundStars(70).map((s, i) => (
              <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, background: 'white', borderRadius: '50%', opacity: 0.25 }} />
            ))}
            <div style={{ opacity: 1, position: 'relative', zIndex: 1 }}><Logo size={48} /></div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
                <div style={{ marginBottom: '10px' }}>
                    <p style={{ fontSize: '0.9rem', color: GOLD, letterSpacing: '6px', textTransform: 'uppercase', margin: '0 0 10px 0' }}>Join My Galaxy</p>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 300, lineHeight: '1.1', margin: 0, whiteSpace: 'nowrap' }}>Add a Star to my Sky</h2>
                </div>
                <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>Send an anonymous message or wish for the new year. ✨</p>
                <div style={{ border: `3px dashed ${GOLD}`, borderRadius: '24px', padding: '25px', background: 'rgba(251, 191, 36, 0.05)', marginTop: '10px' }}>
                  <p style={{ fontSize: '1.4rem', color: GOLD, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '2px', margin: 0 }}>Add Link Here</p>
                </div>
            </div>
            <div style={{ background: '#ffffff', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', color: footerTextColorDefault, fontWeight: 700, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 -40px', borderRadius: 0, position: 'relative', zIndex: 1 }}>
              <span>From {creatorName}'s sky</span>
            </div>
        </div>
      );
      break;
    }
    default: cardContent = null;
  }

  if (isGallery) return cardContent;

  return (
    <div style={{ position: 'absolute', left: '-5000px', top: '0', pointerEvents: 'none', zIndex: -1000 }}>
      {cardContent}
    </div>
  );
});

export default StoryCard;