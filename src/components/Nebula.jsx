import { motion } from 'framer-motion'

/**
 * Nebula Component
 * Adds soft, blurred organic color clouds to the background.
 * Uses CSS variables for consistent theming.
 */
export default function Nebula({ intensity = 1 }) {
  const clouds = [
    { id: 1, color: 'var(--nebula-1)', size: '60vw', x: '5%', y: '10%' },
    { id: 2, color: 'var(--nebula-2)', size: '70vw', x: '40%', y: '40%' },
  ]

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
      opacity: Math.min(0.4 * intensity, 0.9)
    }}>
      {clouds.map(cloud => (
        <div
          key={cloud.id}
          style={{
            position: 'absolute',
            left: cloud.x,
            top: cloud.y,
            width: cloud.size,
            height: cloud.size,
            background: `radial-gradient(circle, ${cloud.color} 0%, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />
      ))}
    </div>
  )
}