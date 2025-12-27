import React, { useMemo } from 'react'
import StoryCard from '../components/StoryCard'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { FaChevronLeft, FaCode } from 'react-icons/fa'

const MOCK_STAR = {
    id: 'preview-star',
    sender_name: 'Celestial Voyager',
    message: 'May your journey through the stars be filled with light and wonder.',
    emoji: '✨',
    style: 'gold',
    shape: 'FaStar',
    pos_x: 50,
    pos_y: 50
};

const MOCK_STARS = [
    { id: 1, pos_x: 20, pos_y: 20, style: 'classic', shape: 'FaCircle' },
    { id: 2, pos_x: 80, pos_y: 30, style: 'gold', shape: 'FaStar' },
    { id: 3, pos_x: 40, pos_y: 70, style: 'purple', shape: 'FaHeart' },
    { id: 4, pos_x: 70, pos_y: 80, style: 'blue', shape: 'FaGem' },
    { id: 5, pos_x: 50, pos_y: 50, style: 'fire', shape: 'FaSquare' }
];

const MOCK_LINES = [
    { p1: MOCK_STARS[0], p2: MOCK_STARS[4] },
    { p1: MOCK_STARS[1], p2: MOCK_STARS[4] },
    { p1: MOCK_STARS[2], p2: MOCK_STARS[4] },
    { p1: MOCK_STARS[3], p2: MOCK_STARS[4] }
];

const TIERS = [
    { id: 1, name: "First Spark", color: '#94a3b8' },
    { id: 2, name: "Astral Awakening", color: '#60a5fa' },
    { id: 3, name: "Supernova Bloom", color: '#fbbf24' },
    { id: 4, name: "Infinite Galaxy", color: '#22d3ee' }
];

export default function CardsPreview() {
    // Memoize the gallery layout to prevent recalculation on parent re-renders
    const galleryContent = useMemo(() => (
        <div style={{ width: '100%', maxWidth: '1600px', marginTop: '40px' }}>
            <section style={{ marginBottom: '100px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '40px', opacity: 0.5 }}>
                    — Celestial Progression —
                </h2>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '30px',
                    justifyItems: 'center'
                }}>
                    {TIERS.map(tier => (
                        <div key={tier.id} style={{ width: '300px' }}>
                            <div style={{ fontSize: '0.6rem', color: tier.color, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '15px' }}>
                                Phase 0{tier.id}: {tier.name}
                            </div>
                            <div style={{ 
                                width: '300px', 
                                height: '450px', 
                                overflow: 'hidden', 
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(0,0,0,0.3)'
                            }}>
                                <div style={{ transform: 'scale(0.6)', transformOrigin: 'top left' }}>
                                    <StoryCard 
                                        isGallery={true}
                                        type="constellation" 
                                        data={MOCK_STARS} 
                                        lines={MOCK_LINES} 
                                        creatorName="ZOLA" 
                                        skyTier={tier} 
                                        totalStars={tier.id * 8} 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '40px', opacity: 0.5 }}>
                    — Interaction Artifacts —
                </h2>
                <div style={{ 
                    display: 'flex', 
                    gap: '50px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'flex-start'
                }}>
                    <div style={{ width: '300px' }}>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '15px' }}>Invite Artifact</div>
                        <div style={{ width: '300px', height: '450px', overflow: 'hidden', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)' }}>
                            <div style={{ transform: 'scale(0.6)', transformOrigin: 'top left' }}>
                                <StoryCard isGallery={true} type="link-only" creatorName="ZOLA" totalStars={12} />
                            </div>
                        </div>
                    </div>

                    <div style={{ width: '300px' }}>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '15px' }}>Message Artifact</div>
                        <div style={{ width: '300px', height: '210px', overflow: 'hidden', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)' }}>
                            <div style={{ transform: 'scale(0.6)', transformOrigin: 'top left' }}>
                                <StoryCard isGallery={true} type="star" data={MOCK_STAR} creatorName="ZOLA" totalStars={1} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    ), []);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', padding: 'var(--nav-height) 20px 100px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Standard App Navbar */}
            <nav className="navbar" style={{ paddingRight: '15px', paddingLeft: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--nav-height)' }}>
                <Link to="/debug" className="brand" style={{ pointerEvents: 'auto', width: '120px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaCode size={18} color="var(--text-secondary)" />
                    <Logo size={24} />
                </Link>
                <div style={{ textAlign: 'center', flex: 1 }}>
                    <div className="sky-title" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Artifact Gallery</div>
                    <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6 }}>Internal Design Audit</div>
                </div>
                <div style={{ width: '120px', textAlign: 'right' }}>
                    <div style={{ fontSize: '0.5rem', color: 'var(--text-secondary)', fontWeight: 800 }}>V1.0</div>
                </div>
            </nav>

            {galleryContent}

            <div style={{ position: 'fixed', bottom: '30px', left: '0', right: 0, display: 'flex', gap: '15px', justifyContent: 'center', zIndex: 100, pointerEvents: 'none' }}>
                <div style={{ display: 'flex', gap: '10px', pointerEvents: 'auto' }}>
                    <Link to="/debug">
                        <button style={{ height: 36, padding: '0 20px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: '#fff', fontWeight: 700 }}>
                            <FaCode style={{ marginRight: '8px' }} /> BACK TO DEMOS
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}