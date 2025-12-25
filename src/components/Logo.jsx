import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ size = 40, className = "" }) => {
  const strokeWidth = 2.5;
  const starRadius = 3.5;
  
  // Normalized coordinates for a 'Z' shape
  const points = [
    { x: 25, y: 25 }, // Top Left
    { x: 75, y: 25 }, // Top Right
    { x: 25, y: 75 }, // Bottom Left
    { x: 75, y: 75 }, // Bottom Right
  ];

  return (
    <div className={`logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))', flexShrink: 0, display: 'block', marginBottom: '3px' }}
      >
        {/* Constellation Lines */}
        <motion.path
          d="M 25 25 L 75 25 L 25 75 L 75 75"
          fill="transparent"
          stroke="white"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Stars at corners */}
        {points.map((pt, i) => (
          <motion.circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={starRadius}
            fill="white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1], 
              opacity: [0, 1, 0.8],
              filter: ['blur(0px)', 'blur(1px)', 'blur(0px)']
            }}
            transition={{ 
              delay: i * 0.2, 
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: Math.random() * 2
            }}
          />
        ))}
      </svg>
      <span style={{ 
        fontSize: size * 0.6, 
        fontWeight: 300, 
        letterSpacing: '2px', 
        color: 'white',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-main)',
        marginLeft: `-${(size * 0.25) - 8}px`, // 8px gap from the 'Z' constellation edge
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center'
      }}>
        ola
      </span>
    </div>
  );
};

export default Logo;
