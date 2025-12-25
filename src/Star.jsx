import { motion } from 'framer-motion'
import * as FaIcons from 'react-icons/fa'
import { useMemo } from 'react'

/**
 * Star Component
 * Renders an interactive star in the celestial sky.
 * Each star is unique in size, color, and twinkle delay.
 */
const Star = ({ star, setSelectedStar }) => {
  // Dynamically resolve the icon based on the star's shape property
  const IconComponent = FaIcons[star.shape] || FaIcons.FaCircle;

  // Memoize random properties to prevent flickering on re-renders
  const starSize = useMemo(() => Math.floor(Math.random() * (20 - 10 + 1)) + 10, []);
  
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
        filter: ["brightness(0.8)", "brightness(1.2)"],
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
        filter: {
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
      }}
      onClick={() => setSelectedStar(star)}
    >
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