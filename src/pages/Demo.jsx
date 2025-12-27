import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import Star from '../Star'
import Logo from '../components/Logo'
import { FaChevronLeft, FaChevronRight, FaShareAlt, FaDownload, FaCode, FaTimes } from 'react-icons/fa'
import { useTier } from '../context/TierContext'
import StoryCard from '../components/StoryCard'

const getStarColor = (style) => {
  switch (style) {
    case 'classic': return '#ffffff'
    case 'gold': return '#fbbf24'
    case 'blue': return '#60a5fa'
    case 'fire': return '#f87171'
    case 'purple': return '#a78bfa'
    case 'green': return '#4ade80'
    default: return '#ffffff'
  }
}

const SHAPES = ['FaCircle', 'FaSquare', 'FaPlay', 'FaStar', 'FaHeart', 'FaGem'];
const STYLES = ['classic', 'gold', 'blue', 'fire', 'purple', 'green'];
const EMOJIS = ['✨', '❤️', '🔥', '🚀', '⭐', '🌈'];
const STARS_PER_PAGE = 10;

const backgroundStarsData = [
    { x: 10, y: 15, size: 2 }, { x: 85, y: 10, size: 3 }, { x: 30, y: 40, size: 2 },
    { x: 70, y: 60, size: 3 }, { x: 20, y: 80, size: 2 }, { x: 90, y: 90, size: 3 },
    { x: 50, y: 20, size: 2 }, { x: 15, y: 55, size: 3 }, { x: 80, y: 35, size: 2 },
    { x: 45, y: 75, size: 3 }, { x: 5, y: 95, size: 2 }, { x: 95, y: 5, size: 3 }
];

const MESSAGES = [
    "May your year be as bright as this star.",
    "To new beginnings and infinite possibilities.",
    "Sending love across the digital cosmos.",
    "A wish for peace, health, and happiness.",
    "Looking forward to a brilliant 2026!",
    "Keep shining, no matter the darkness.",
    "Connected by starlight, even from afar.",
    "The universe is wide, but we are together."
];

export default function Demo() {
    const { setTier } = useTier()
    const [allStars, setAllStars] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [lines, setLines] = useState([])
    const [selectedStar, setSelectedStar] = useState(null)
    const [toast, setToast] = useState("Initializing ZOLA Sequence...")

    const skyTier = useMemo(() => {
        const count = allStars.length
        if (count < 5) return { id: 1, name: "First Spark", intensity: 1, color: '#94a3b8', next: 5 }
        if (count < 15) return { id: 2, name: "Astral Awakening", intensity: 1.5, color: '#60a5fa', next: 15 }
        if (count < 30) return { id: 3, name: "Supernova Bloom", intensity: 2, color: '#fbbf24', next: 30 }
        return { id: 4, name: "Infinite Galaxy", intensity: 3, color: '#22d3ee', next: null }
    }, [allStars.length])

    const showToast = useCallback((message) => {
        setToast(message)
        setTimeout(() => setToast(null), 4000)
    }, [])

    const calculateConstellation = useCallback((starData) => {
        if (starData.length < 2) { setLines([]); return; }
        const edges = []
        for (let i = 0; i < starData.length; i++) {
            for (let j = i + 1; j < starData.length; j++) {
                const s1 = starData[i], s2 = starData[j]
                const realDist = Math.hypot(s1.pos_x - s2.pos_x, s1.pos_y - s2.pos_y)
                edges.push({ p1: s1, p2: s2, dist: realDist })
            }
        }
        const sortedEdges = edges.sort((a, b) => a.dist - b.dist)
        const parent = new Map()
        starData.forEach(s => parent.set(s.id, s.id))
        const find = (id) => {
            if (parent.get(id) === id) return id;
            const root = find(parent.get(id)); parent.set(id, root); return root;
        }
        const union = (id1, id2) => {
            const r1 = find(id1), r2 = find(id2);
            if (r1 !== r2) { parent.set(r1, r2); return true; }
            return false;
        }
        const valid = []
        for (let e of sortedEdges) {
            if (find(e.p1.id) !== find(e.p2.id)) {
                union(e.p1.id, e.p2.id);
                valid.push(e);
            }
        }
        setLines(valid)
    }, [])

    useEffect(() => {
        let count = 0;
        const interval = setInterval(() => {
            // Narrative Progression
            if (count === 1) setToast("Phase 01: The First Spark");
            if (count === 5) setToast("Phase 02: Astral Awakening - Connections forming");
            if (count === 15) setToast("Phase 03: Supernova Bloom - Complexity increasing");
            if (count === 25) setToast("Phase 04: Infinite Galaxy - Critical mass reached");

            if (count >= 30) {
                clearInterval(interval);
                setToast("Simulation Complete. Welcome to the Galaxy.");
                return;
            }
            
            const newStar = {
                id: `demo-${count}`,
                pos_x: Math.floor(Math.random() * 80) + 10,
                pos_y: Math.floor(Math.random() * 70) + 15,
                style: STYLES[count % STYLES.length],
                shape: SHAPES[count % SHAPES.length],
                emoji: EMOJIS[count % EMOJIS.length],
                sender_name: "ZOLA Voyager",
                message: MESSAGES[count % MESSAGES.length]
            };

            setAllStars(prev => {
                const updated = [...prev, newStar];
                const nextMaxPage = Math.ceil(updated.length / STARS_PER_PAGE);
                if (updated.length % STARS_PER_PAGE === 1 && updated.length > 1) {
                    setCurrentPage(nextMaxPage);
                }
                return updated;
            });
            
            count++;
        }, 1500);

        return () => clearInterval(interval);
    }, [showToast]);

    useEffect(() => {
        setTier(skyTier.id)
    }, [skyTier.id, setTier])

    const totalPages = useMemo(() => Math.max(1, Math.ceil(allStars.length / STARS_PER_PAGE)), [allStars.length])
    const displayedStars = useMemo(() => {
        const startIndex = (currentPage - 1) * STARS_PER_PAGE
        return allStars.slice(startIndex, startIndex + STARS_PER_PAGE)
    }, [allStars, currentPage])

    useEffect(() => {
        calculateConstellation(displayedStars)
    }, [displayedStars, calculateConstellation])

    return (
        <div className="sky-container">
            <motion.div 
                animate={skyTier.id === 4 ? { opacity: [0.25, 0.45, 0.25] } : { opacity: skyTier.id >= 3 ? 0.1 : 0 }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ 
                    position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
                    background: skyTier.id === 4 
                        ? `radial-gradient(circle at 15% 20%, rgba(34, 211, 238, 0.25) 0%, transparent 50%),
                           radial-gradient(circle at 85% 15%, rgba(167, 139, 250, 0.2) 0%, transparent 50%),
                           radial-gradient(circle at 50% 85%, rgba(236, 72, 153, 0.18) 0%, transparent 50%)`
                        : `radial-gradient(circle, transparent 60%, ${skyTier.id >= 3 ? skyTier.color : 'transparent'} 150%)`
                }} 
            />

            <AnimatePresence>{toast && (
                <motion.div 
                    initial={{ opacity: 0, y: 30, x: '-50%' }} 
                    animate={{ opacity: 1, y: 0, x: '-50%' }} 
                    exit={{ opacity: 0, y: 20, x: '-50%' }} 
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="toast"
                >
                    {toast}
                </motion.div>
            )}</AnimatePresence>

            <nav className="navbar" style={{ paddingRight: '15px', paddingLeft: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--nav-height)' }}>
                <Link to="/debug" className="brand" style={{ pointerEvents: 'auto', width: '100px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaCode size={18} color="var(--text-secondary)" />
                    <Logo size={24} />
                </Link>
                <div style={{ textAlign: 'center', flex: 1 }}>
                    <div className="sky-title" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Evolution Demo</div>
                    <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6 }}>
                        Page {currentPage} of {totalPages} • {allStars.length}/30 Stars
                    </div>
                </div>
                <div className="tier-container" style={{ width: '100px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: '0.5rem', letterSpacing: '2px', color: skyTier.color, fontWeight: 800 }}>PHASE 0{skyTier.id}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{skyTier.name}</div>
                    <div style={{ width: '40px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div 
                            animate={{ width: `${(allStars.length / 30) * 100}%`, background: skyTier.id >= 2 ? `linear-gradient(90deg, #fff, ${skyTier.color})` : '#94a3b8' }} 
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            style={{ height: '100%' }} 
                        />
                    </div>
                </div>
            </nav>

            <div className="sky-content" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    {lines.map((line) => (
                        <motion.line 
                            key={`${line.p1.id}-${line.p2.id}`} 
                            x1={`${line.p1.pos_x}%`} y1={`${line.p1.pos_y}%`} 
                            x2={`${line.p2.pos_x}%`} y2={`${line.p2.pos_y}%`} 
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.6 }}
                            transition={{ 
                                pathLength: { duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.3 }, 
                                opacity: { duration: 0.4, delay: 0.3 } 
                            }} 
                            stroke={skyTier.color} strokeWidth="1.5" vectorEffect="non-scaling-stroke"
                        />
                    ))}
                </svg>
                {displayedStars.map((star) => (
                    <Star key={star.id} star={star} setSelectedStar={setSelectedStar} />
                ))}
            </div>

            {selectedStar && (
                <div className="modal-overlay" onClick={() => setSelectedStar(null)}>
                    <div 
                        className="glass-card" 
                        onClick={(e) => e.stopPropagation()} 
                        style={{ 
                            width: 'calc(100% - 40px)',
                            maxWidth: '340px',
                            padding: 0,
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '24px',
                            border: `4px solid ${getStarColor(selectedStar.style)}`,
                            background: 'rgba(15, 23, 42, 0.9)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: `0 30px 60px rgba(0,0,0,0.5)`,
                            textAlign: 'left'
                        }}
                    >
                        {backgroundStarsData.map((s, i) => (
                            <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, background: 'white', borderRadius: '50%', opacity: 0.2 }} />
                        ))}
                        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle, transparent 40%, ${skyTier.id >= 3 ? '#fbbf24' : 'transparent'} 150%)`, opacity: skyTier.id >= 3 ? 0.1 : 0, pointerEvents: 'none' }} />
                        <button onClick={() => setSelectedStar(null)} style={{ position: 'absolute', top: '12px', left: '12px', background: 'transparent', width: 'auto', padding: '5px', margin: 0, border: 'none', color: 'var(--text-secondary)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '24px' }}><FaTimes size={16} /></button>
                        <div style={{ textAlign: 'center', opacity: 1, paddingTop: '25px', marginBottom: '-15px', position: 'relative', zIndex: 1 }}>
                            <Logo size={28} />
                        </div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px' }}>
                                <div style={{ 
                                    width: '60px', height: '60px', 
                                    borderRadius: '15px', 
                                    background: `${getStarColor(selectedStar.style)}20`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2rem',
                                    border: `1px solid ${getStarColor(selectedStar.style)}40`
                                }}>{selectedStar.emoji}</div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '1.1rem', color: '#f1f5f9', fontWeight: 500 }}>
                                        ~ {selectedStar.sender_name || 'Anonymous'}
                                    </p>
                                    <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: getStarColor(selectedStar.style), textTransform: 'uppercase', letterSpacing: '3px' }}>Sent a wish</p>
                                </div>
                            </div>
                            <div className="msg-text" style={{ padding: '0 20px 25px 20px', lineHeight: '1.5', fontSize: '1rem', color: '#e2e8f0', minHeight: '50px' }}>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                    {selectedStar.message}
                                </motion.div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', padding: '0 15px 15px 15px' }}>
                                <button className="story-btn" style={{ flex: 1, margin: 0, height: '40px', background: getStarColor(selectedStar.style), color: ['classic', 'gold', 'green'].includes(selectedStar.style) ? '#020617' : '#ffffff', boxShadow: `0 8px 15px ${getStarColor(selectedStar.style)}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem' }}>
                                    <FaShareAlt size={12} /> Share
                                </button>
                                <button className="story-btn" style={{ width: '40px', margin: 0, height: '40px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FaDownload size={12} />
                                </button>
                            </div>
                            <div style={{ 
                                background: getStarColor(selectedStar.style), 
                                height: '36px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                color: ['classic', 'gold', 'green'].includes(selectedStar.style) ? '#020617' : '#ffffff', 
                                fontWeight: 700, 
                                fontSize: '0.65rem', 
                                letterSpacing: '2px', 
                                textTransform: 'uppercase' 
                            }}>
                                From Demo's Sky
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ position: 'fixed', bottom: '30px', left: '0', right: 0, display: 'flex', gap: '15px', justifyContent: 'center', zIndex: 100, pointerEvents: 'none' }}>
                <div style={{ display: 'flex', gap: '10px', pointerEvents: 'auto' }}>
                    {totalPages > 1 && (
                        <>
                            <button className="pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} style={{ width: 36, height: 36 }}><FaChevronLeft size={12} /></button>
                            <button className="pagination-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} style={{ width: 36, height: 36 }}><FaChevronRight size={12} /></button>
                        </>
                    )}
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