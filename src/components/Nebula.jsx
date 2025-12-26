import { motion } from 'framer-motion'
import { useTier } from '../context/TierContext'

/**
 * Nebula Component
 * Adds soft, blurred organic color clouds to the background.
 * Uses CSS variables for consistent theming.
 */
export default function Nebula({ intensity = 1 }) {
  return null;
  const { tier } = useTier()
  
  const clouds = [
    { id: 1, color: 'var(--nebula-1)', size: '60vw', x: '5%', y: '10%' },
    { id: 2, color: 'var(--nebula-2)', size: '70vw', x: '40%', y: '40%' },
  ]

  // Add more vibrant clouds for Tier 4 (Infinite Galaxy)
  if (tier >= 4) {
    clouds.push(
      { id: 3, color: 'rgba(34, 211, 238, 0.12)', size: '80vw', x: '-10%', y: '-10%' }, // Cyan
      { id: 4, color: 'rgba(236, 72, 153, 0.08)', size: '70vw', x: '60%', y: '50%' },  // Pink
      { id: 5, color: 'rgba(167, 139, 250, 0.1)', size: '65vw', x: '20%', y: '60%' }   // Purple
    )
  } else if (tier === 3) {
    clouds.push(
      { id: 6, color: 'rgba(251, 191, 36, 0.08)', size: '80vw', x: '10%', y: '20%' }   // Amber
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
      opacity: Math.min((tier >= 4 ? 0.6 : 0.4) * intensity, 0.9)
    }}>
      {clouds.map(cloud => (
        <motion.div
          key={cloud.id}
          style={{
            position: 'absolute',
            left: cloud.x,
            top: cloud.y,
            width: cloud.size,
            height: cloud.size,
            background: `radial-gradient(circle, ${cloud.color} 0%, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(60px)',
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}