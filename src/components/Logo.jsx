import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ size = 40, className = "" }) => {
  const strokeWidth = 2.5;
  const starRadius = 3.5;
  
  const points = [
    { x: 25, y: 25 },
    { x: 75, y: 25 },
    { x: 25, y: 75 },
    { x: 75, y: 75 },
  ];

  return (
    <div className={`logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        style={{ flexShrink: 0, display: 'block', marginBottom: '3px' }}
      >
        <path
          d="M 25 25 L 75 25 L 25 75 L 75 75"
          fill="transparent"
          stroke="white"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
        {points.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={starRadius}
            fill="white"
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
        marginLeft: `-${(size * 0.25) - 8}px`,
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
