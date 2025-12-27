import React from 'react'
import { Link } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import Logo from '../components/Logo'
import { FaCode, FaRocket, FaImages, FaChevronLeft } from 'react-icons/fa'

export default function Debug() {
    return (
        <div className="container" style={{ minHeight: '100dvh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '3rem', textAlign: 'center' }}
            >
                <Logo size={80} />
                <h1 style={{ fontSize: '1.2rem', marginTop: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '4px' }}>
                    Engine Demos
                </h1>
            </motion.div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '20px', 
                width: '100%', 
                maxWidth: '800px' 
            }}>
                {/* 1. Evolution Simulation */}
                <Link to="/demo" style={{ textDecoration: 'none' }}>
                    <div className="glass-card" style={{ 
                        padding: '30px', 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: '15px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '20px'
                    }}>
                        <FaRocket size={30} color="var(--accent)" />
                        <h2 style={{ fontSize: '1.1rem', margin: 0, color: '#fff' }}>Evolution Demo</h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, textAlign: 'center' }}>
                            Simulate star growth from Phase 01 to 04 with auto-pagination.
                        </p>
                    </div>
                </Link>

                {/* 2. Artifact Gallery */}
                <Link to="/cards-preview" style={{ textDecoration: 'none' }}>
                    <div className="glass-card" style={{ 
                        padding: '30px', 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: '15px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '20px'
                    }}>
                        <FaImages size={30} color="#22d3ee" />
                        <h2 style={{ fontSize: '1.1rem', margin: 0, color: '#fff' }}>Artifact Gallery</h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, textAlign: 'center' }}>
                            Audit all shareable cards and interactive modal designs.
                        </p>
                    </div>
                </Link>
            </div>

            <Link to="/" style={{ marginTop: '40px' }}>
                <button style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '10px 20px', fontSize: '0.8rem' }}>
                    <FaChevronLeft style={{ marginRight: '8px' }} /> Return to Home
                </button>
            </Link>
        </div>
    )
}
