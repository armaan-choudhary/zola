import React from 'react';
import StoryCard from '../components/StoryCard';

const mockStars = [
  { id: 1, pos_x: 20, pos_y: 20, shape: 'FaStar', style: 'classic' },
  { id: 2, pos_x: 40, pos_y: 30, shape: 'FaCircle', style: 'gold' },
  { id: 3, pos_x: 60, pos_y: 20, shape: 'FaStar', style: 'classic' },
  { id: 4, pos_x: 30, pos_y: 50, shape: 'FaCircle', style: 'blue' },
  { id: 5, pos_x: 50, pos_y: 60, shape: 'FaStar', style: 'purple' },
  { id: 6, pos_x: 70, pos_y: 50, shape: 'FaCircle', style: 'fire' },
  { id: 7, pos_x: 25, pos_y: 75, shape: 'FaStar', style: 'green' },
  { id: 8, pos_x: 50, pos_y: 85, shape: 'FaCircle', style: 'gold' },
  { id: 9, pos_x: 75, pos_y: 75, shape: 'FaStar', style: 'classic' },
  { id: 10, pos_x: 45, pos_y: 40, shape: 'FaStar', style: 'gold' },
];

const mockLines = [
  { p1: mockStars[0], p2: mockStars[1] },
  { p1: mockStars[1], p2: mockStars[2] },
  { p1: mockStars[1], p2: mockStars[3] },
  { p1: mockStars[3], p2: mockStars[4] },
  { p1: mockStars[4], p2: mockStars[5] },
  { p1: mockStars[3], p2: mockStars[6] },
  { p1: mockStars[4], p2: mockStars[7] },
  { p1: mockStars[5], p2: mockStars[8] },
  { p1: mockStars[1], p2: mockStars[9] },
];

const tiers = [
  { id: 1, name: "First Spark", intensity: 1 },
  { id: 2, name: "Astral Awakening", intensity: 1.5 },
  { id: 3, name: "Supernova Bloom", intensity: 2 },
  { id: 4, name: "Infinite Galaxy", intensity: 3 },
];

export default function PreviewTiers() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#020617',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: "'Space Grotesk', sans-serif",
      padding: '20px',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <h1 style={{ fontSize: '1.2rem', fontWeight: 300, letterSpacing: '6px', marginBottom: '20px', opacity: 0.6 }}>
        SYSTEM COMPARISON • ALL TIERS
      </h1>

      {/* Grid Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        transform: 'scale(0.5)', // Scale down to fit standard screen height
        transformOrigin: 'center center',
        width: 'max-content'
      }}>
        {/* StoryCard off-screen override */}
        <style>{`
          .card-wrapper > div {
            position: relative !important;
            left: 0 !important;
            top: 0 !important;
            pointer-events: auto !important;
            z-index: 1 !important;
            margin: 0 !important;
          }
        `}</style>

        {tiers.map((t) => (
          <div key={t.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="card-wrapper">
              <StoryCard 
                type="constellation" 
                data={mockStars} 
                creatorName="Sample User" 
                lines={mockLines} 
                skyTier={t} 
                totalStars={t.id === 1 ? 5 : t.id === 2 ? 15 : t.id === 3 ? 35 : 120}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}