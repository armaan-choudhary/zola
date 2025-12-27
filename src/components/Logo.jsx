import React from 'react';

const Logo = ({ size = 40, color = "white", className = "" }) => {
  const strokeWidth = 8;
  const starRadius = 8;
  
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
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="1"
        />
        {points.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={starRadius}
            fill={color}
          />
        ))}
      </svg>
      <span style={{ 
        fontSize: size * 0.6, 
        fontWeight: 800, 
        letterSpacing: '2px', 
        color: color,
        textTransform: 'uppercase',
        fontFamily: "'Space Grotesk', sans-serif",
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
