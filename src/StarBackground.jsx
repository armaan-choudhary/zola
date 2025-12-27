/* eslint-disable react-hooks/purity */
import { useEffect, useState, useMemo } from 'react'
import { useTier } from './context/TierContext'

/**
 * ShootingStars Component
 * Renders occasional shooting star animations for atmospheric depth.
 */
function ShootingStars({ tier }) {
  const [shootingStars, setShootingStars] = useState([])

  useEffect(() => {
    const createStar = () => {
      const id = Math.random()
      const newStar = {
        id,
        left: Math.random() * 80 + 20 + "%",
        top: Math.random() * 50 + "%",
        duration: Math.random() * 1 + 1 + "s"
      }
      setShootingStars(prev => [...prev, newStar])
      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== id))
      }, 2000)
    }

    // Determine frequency based on tier
    let probability = 0.5
    let intervalTime = 2000

    if (tier === 2) { probability = 0.6; intervalTime = 1500; }
    if (tier === 3) { probability = 0.8; intervalTime = 1000; }
    if (tier === 4) { probability = 0.95; intervalTime = 800; }

    const interval = setInterval(() => {
      if (Math.random() < probability) createStar()
    }, intervalTime)

    return () => clearInterval(interval)
  }, [tier])

  return (
    <>
      {shootingStars.map(star => (
        <div 
          key={star.id} 
          className="shooting-star" 
          style={{ 
            left: star.left, 
            top: star.top, 
            animation: `shooting-star ${star.duration} ease-out forwards` 
          }} 
        />
      ))}
    </>
  )
}

/**
 * StarBackground Component
 * Renders the drifting, twinkling stars that form the deep background layer.
 */
export default function StarBackground() {
  const { tier, isModalOpen } = useTier()
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600
  
  // Use a static seed for deterministic background stars
  const stars = useMemo(() => {
    let targetCount = isMobile ? 120 : 250
    if (tier === 2) targetCount = isMobile ? 150 : 350
    if (tier === 3) targetCount = isMobile ? 200 : 450
    if (tier === 4) targetCount = isMobile ? 250 : 600

    return Array.from({ length: targetCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.2 + 0.5,
      opacity: Math.random() * 0.3 + 0.1,
      twinkleSpeed: Math.random() * 3 + 2
    }))
  }, [tier, isMobile])

  return (
    <div className={`star-bg-layer ${isModalOpen ? 'paused' : ''}`}>
      <ShootingStars tier={tier} />
      <div className="bg-star-container">
        {stars.map((star) => (
          <div
            key={star.id}
            className="bg-star-decoration"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              '--speed': `${star.twinkleSpeed}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}