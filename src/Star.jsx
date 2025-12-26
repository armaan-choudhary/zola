import { motion } from 'framer-motion'
import * as FaIcons from 'react-icons/fa'
import { useMemo } from 'react'
import { useTier } from './context/TierContext'

/**
 * Star Component
 * Renders an interactive star in the celestial sky.
 * Each star is unique in size, color, and twinkle delay.
 */
const Star = ({ star, setSelectedStar }) => {
  const { tier } = useTier()
  // Dynamically resolve the icon based on the star's shape property
  const IconComponent = FaIcons[star.shape] || FaIcons.FaCircle;

  // Memoize random properties to prevent flickering on re-renders
  const starSize = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;
    const min = isMobile ? 8 : 10;
    const max = isMobile ? 14 : 20;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }, []);
  
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

  const randomDelay = useMemo(() => Math.random() * 10, []);

  return (
    <motion.div
      key={star.id}
      className={`star ${star.style || 'classic'}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        scale: [0.85, 1],
        opacity: 1
      }}
      transition={{ 
        scale: {
          duration: 5,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: randomDelay
        },
        opacity: { duration: 1 }
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
}

export default Star