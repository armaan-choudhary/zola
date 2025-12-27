// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import * as FaIcons from 'react-icons/fa'
import React, { useMemo } from 'react'
import { useTier } from './context/TierContext'

/**
 * Star Component
 * Renders an interactive star in the celestial sky.
 * Each star is unique in size, color, and twinkle delay.
 */
const Star = React.memo(({ star, setSelectedStar }) => {
  const { tier } = useTier()
  // Dynamically resolve the icon based on the star's shape property
  const IconComponent = FaIcons[star.shape] || FaIcons.FaCircle;

  // Helper for deterministic randomness based on IDs
  const getHash = (val) => {
    const str = String(val);
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
    return Math.abs(hash);
  }

  const starSeed = getHash(star.id);

  // Memoize random properties to prevent flickering on re-renders
  const starSize = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;
    const min = isMobile ? 8 : 10;
    const max = isMobile ? 14 : 20;
    return (starSeed % (max - min + 1)) + min;
  }, [starSeed]);
  
  const color = useMemo(() => {
    switch (star.style) {
      case 'classic': return '#fff'
      case 'gold': return '#fbbf24'
      case 'blue': return '#60a5fa'
      case 'fire': return '#f87171'
      case 'green': return '#4ade80'
      case 'purple': return '#a78bfa'
      default: return '#fff'
    }
  }, [star.style]);

  const deterministicDelay = (starSeed % 100) / 10;

  return (
    <motion.div
      key={star.id}
      className={`star ${star.style || 'classic'}`}
      initial={{ opacity: 0, scale: 0, filter: 'blur(10px)' }}
      animate={{ 
        opacity: 1, 
        scale: [0, 1.2, 1],
        filter: 'blur(0px)',
        // Twinkle sequence starts after entrance
        transitionEnd: {
          scale: 1,
        }
      }}
      whileHover={{ scale: 1.5 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.23, 1, 0.32, 1]
      }}
      style={{
        left: `${star.pos_x}%`,
        top: `${star.pos_y}%`,
        width: `${starSize}px`,
        height: `${starSize}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        x: '-50%',
        y: '-50%'
      }}
      onClick={() => setSelectedStar(star)}
    >
      {/* Continuous Twinkle Overlay */}
      <div 
        className="star-twinkle-layer"
        style={{ animationDelay: `${deterministicDelay}s` }}
      />
      {/* Infinite Galaxy Decorative Rings */}
      {tier === 4 && (
        <>
          {/* Inner Arcs */}
          <motion.div
            style={{
              position: 'absolute',
              width: '250%',
              height: '250%',
              borderRadius: '50%',
              border: `1.5px solid ${color}`,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              opacity: 0.5,
              zIndex: -1
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </>
      )}

      <div style={{
        position: 'absolute',
        inset: 0,
        filter: `drop-shadow(0 0 3px #fff) drop-shadow(0 0 6px ${color}80)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {IconComponent && <IconComponent size={starSize} color="white" />}
      </div>
    </motion.div>
  )
})

export default Star
