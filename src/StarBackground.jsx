import { useEffect, useState } from 'react'

/**
 * ShootingStars Component
 * Renders occasional shooting star animations for atmospheric depth.
 */
function ShootingStars() {
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

    // Spawn a shooting star randomly every 3 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7) createStar()
    }, 3000)

    return () => clearInterval(interval)
  }, [])

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
  const [stars, setStars] = useState([])

  useEffect(() => {
    const isMobile = window.innerWidth < 600
    // Dynamic star count for performance vs aesthetics
    const starCount = isMobile ? 30 : 100
    const newStars = Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      duration: Math.random() * 40 + 40, 
      delay: Math.random() * 5,
      opacity: Math.random() * 0.3 + 0.1
    }))
    setStars(newStars)
  }, [])

  return (
    <div className="star-bg-layer">
      <style>
        {`
          @keyframes shooting-star {
            0% { transform: translateX(0) translateY(0) rotate(-45deg) scale(0); opacity: 1; }
            70% { opacity: 1; }
            100% { transform: translateX(-500px) translateY(500px) rotate(-45deg) scale(1); opacity: 0; }
          }
          .shooting-star {
            position: absolute;
            width: 100px;
            height: 2px;
            background: linear-gradient(90deg, white, transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
          }
        `}
      </style>
      <ShootingStars />
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
            animationDuration: `${star.duration}s`,
            animationDelay: `-${star.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
