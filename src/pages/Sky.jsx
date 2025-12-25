import { useEffect, useState, useRef } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Star from '../Star'
import JSConfetti from 'js-confetti'
import { toPng, toBlob } from 'html-to-image'
import StoryCard from '../components/StoryCard'
import Loader from '../components/Loader'
import Logo from '../components/Logo'
import { FaTimes, FaChevronLeft, FaChevronRight, FaShareAlt, FaDownload } from 'react-icons/fa'

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

export default function Sky() {
    const { slug } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [allStars, setAllStars] = useState([])
    const currentPage = parseInt(searchParams.get('page') || '1')
    const setCurrentPage = (page) => setSearchParams({ page: page.toString() })

    const [lines, setLines] = useState([])
    const [selectedStar, setSelectedStar] = useState(null)
    const [creatorName, setCreatorName] = useState('')
    const [loading, setLoading] = useState(true)
    const [needsRefresh, setNeedsRefresh] = useState(false)
    const [toast, setToast] = useState(null)
    const [timeLeft, setTimeLeft] = useState('')

    const skyRef = useRef(null)
    const skyCardRef = useRef(null)
    const starCardRef = useRef(null)
    const linkCardRef = useRef(null)
    const chimeRef = useRef(null)
    const jsConfettiRef = useRef(null)
    const lastTriggeredStarId = useRef(null)

    const NEW_YEAR = new Date('2026-01-01T00:00:00')
    const isRevealed = new Date() >= NEW_YEAR

    const getSkyTier = () => {
        const count = allStars.length
        if (count < 10) return { id: 1, name: "First Spark", intensity: 1 }
        if (count < 25) return { id: 2, name: "Astral Awakening", intensity: 1.5 }
        if (count < 50) return { id: 3, name: "Supernova Bloom", intensity: 2 }
        return { id: 4, name: "Infinite Galaxy", intensity: 3 }
    }
    const skyTier = getSkyTier()

    const backgroundStars = [
        { x: 10, y: 15, size: 2 }, { x: 85, y: 10, size: 3 }, { x: 30, y: 40, size: 2 },
        { x: 70, y: 60, size: 3 }, { x: 20, y: 80, size: 2 }, { x: 90, y: 90, size: 3 },
        { x: 50, y: 20, size: 2 }, { x: 15, y: 55, size: 3 }, { x: 80, y: 35, size: 2 },
        { x: 45, y: 75, size: 3 }, { x: 5, y: 95, size: 2 }, { x: 95, y: 5, size: 3 }
    ];

    const getSkyMood = () => {
        const count = allStars.length
        if (count === 0) return "A silent void awaits your light"
        if (count < 5) return "The first lights are gathering"
        if (count < 10) return "A vibrant cluster is forming"
        return "A magnificent galaxy of wishes"
    }

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "A morning view of"
        if (hour < 18) return "An afternoon glimpse of"
        return "An evening sky for"
    }

    useEffect(() => {
        if (isRevealed) return
        const timer = setInterval(() => {
            const now = new Date().getTime()
            const distance = NEW_YEAR.getTime() - now
            if (distance < 0) { clearInterval(timer); return; }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24))
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)
            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        }, 1000)
        return () => clearInterval(timer)
    }, [isRevealed])

    const showToast = (message) => {
        setToast(message)
        setTimeout(() => setToast(null), 3000)
    }

    const playChime = () => {
        if (chimeRef.current) {
            chimeRef.current.currentTime = 0
            chimeRef.current.volume = 0.2
            chimeRef.current.play().catch(() => {})
        }
    }

    const STARS_PER_PAGE = 12

    useEffect(() => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3')
        audio.load(); chimeRef.current = audio
        const unlock = () => {
            if (chimeRef.current) {
                chimeRef.current.play().then(() => { chimeRef.current.pause(); chimeRef.current.currentTime = 0; }).catch(() => {})
            }
            window.removeEventListener('click', unlock)
        }
        window.addEventListener('click', unlock)
        return () => window.removeEventListener('click', unlock)
    }, [])

    useEffect(() => {
        let lastWidth = window.innerWidth
        const handleResize = () => {
            if (Math.abs(window.innerWidth - lastWidth) > 50) {
                setNeedsRefresh(true)
                lastWidth = window.innerWidth
            }
        }
        window.addEventListener('resize', handleResize)
        const channel = supabase.channel('sky-realtime').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'stars' }, (payload) => {
            if (payload.new && payload.new.sky_slug === slug) window.location.reload()
        }).subscribe()
        return () => { window.removeEventListener('resize', handleResize); supabase.removeChannel(channel); }
    }, [slug])

    const handleShareLink = async () => {
        if (sharing) return
        const url = `${window.location.origin}/send/${slug}`
        
        try {
            await navigator.clipboard.writeText(url)
        } catch { /* ignore clipboard errors */ }

        if (navigator.share && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            setSharing(true)
            try {
                // Wait a bit to ensure fonts and layout are ready
                await new Promise(r => setTimeout(r, 300))
                
                const blob = await toBlob(linkCardRef.current, { 
                    cacheBust: true, 
                    pixelRatio: 2, // High quality
                })
                
                if (!blob) throw new Error("Blob generation failed")
                const file = new File([blob], `zola-invite.png`, { type: 'image/png' })
                
                await navigator.share({
                    files: [file],
                    title: 'ZOLA',
                    text: `Add a star to my sky! ✨`,
                    url: url
                })
                showToast("Link copied & card shared! ✨")
            } catch (err) {
                console.error("Link share failed:", err)
                await navigator.share({
                    title: 'ZOLA',
                    text: `Check out my sky on ZOLA! ✨`,
                    url: url
                })
            } finally {
                setSharing(false)
            }
        } else {
            showToast("Link copied! 🔗")
        }
    }

    const [sharing, setSharing] = useState(false)
    const [showTutorial, setShowTutorial] = useState(() => {
        return localStorage.getItem('sky_tutorial_seen') !== 'true'
    })

    const dismissTutorial = () => {
        setShowTutorial(false)
        localStorage.setItem('sky_tutorial_seen', 'true')
    }

    const handleShareStory = async (type, mode = 'share') => {
        if (sharing) return
        const ref = type === 'star' ? starCardRef : skyCardRef
        if (!ref || !ref.current) {
            showToast("Still preparing... try again in a second ✨")
            return
        }
        
        setSharing(true)
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const url = `${window.location.origin}/send/${slug}`
        const shareTitle = `ZOLA ${type === 'star' ? 'Star' : 'Sky'}`
        const shareText = `Check out this ${type === 'star' ? 'wish' : 'sky'} on ZOLA! ✨`

        try {
            // Small delay for stability
            await new Promise(r => setTimeout(r, 300))

            if (mode === 'download') {
                const dataUrl = await toPng(ref.current, { 
                    cacheBust: true, 
                    pixelRatio: 2
                })
                const link = document.createElement('a')
                link.download = `zola-${type}.png`; link.href = dataUrl; link.click()
                showToast("Image saved! 📸")
            } else {
                // Share mode
                if (navigator.share) {
                    try {
                        try {
                            await navigator.clipboard.writeText(url)
                            showToast("Link copied! Paste it as a sticker in your story ✨")
                        } catch { /* fallback if clipboard fails */ }

                        const blob = await toBlob(ref.current, { 
                            cacheBust: true, 
                            pixelRatio: 2
                        })
                        
                        if (!blob) throw new Error("Blob generation failed")
                        const file = new File([blob], `zola-${type}.png`, { type: 'image/png' })
                        
                        const shareData = {
                            files: [file],
                            title: shareTitle,
                            text: shareText,
                            url: url
                        }

                        if (navigator.canShare && navigator.canShare(shareData)) {
                            await navigator.share(shareData)
                        } else {
                            await navigator.share({ title: shareTitle, text: shareText, url: url })
                        }
                    } catch {
                        // If file sharing fails, try sharing just the link
                        await navigator.share({ title: shareTitle, text: shareText, url: url })
                    }
                } else {
                    if (isMobile) {
                        showToast("Share unavailable (needs HTTPS). Use 📥 to save & share! ✨")
                    } else {
                        showToast("Native sharing is only available on mobile. Use 📥 to save! ✨")
                    }
                }
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error("Operation failed:", err)
                showToast("Could not complete operation ✨")
            }
        } finally {
            setSharing(false)
        }
    }

    useEffect(() => { jsConfettiRef.current = new JSConfetti() }, [])

    useEffect(() => {
        const fetchSky = async () => {
            setLoading(true)
            const { data: skyData } = await supabase.from('skies').select('creator_name').eq('slug', slug).single()
            if (skyData) setCreatorName(skyData.creator_name)
            const { data: starsData } = await supabase.from('stars').select('*').eq('sky_slug', slug).order('created_at', { ascending: true })
            if (starsData) setAllStars(starsData)
            setLoading(false)
        }
        fetchSky()
    }, [slug])

    useEffect(() => {
        if (allStars.length === 0) return
        const startIndex = (currentPage - 1) * STARS_PER_PAGE
        const pageStars = allStars.slice(startIndex, startIndex + STARS_PER_PAGE)
        calculateConstellation(pageStars)
    }, [allStars, currentPage])

    useEffect(() => {
        if (selectedStar && isRevealed) {
            if (lastTriggeredStarId.current === selectedStar.id) return;
            lastTriggeredStarId.current = selectedStar.id;
            const emoji = selectedStar.emoji || '✨';
            setTimeout(() => { if (jsConfettiRef.current) jsConfettiRef.current.addConfetti({ emojis: [emoji], emojiSize: 50, confettiNumber: 20 }) }, 400);
        } else if (!selectedStar) { lastTriggeredStarId.current = null; }
    }, [selectedStar, isRevealed]);

    const calculateConstellation = (starData) => {
        if (starData.length < 2) { setLines([]); return; }
        const edges = []
        for (let i = 0; i < starData.length; i++) {
            for (let j = i + 1; j < starData.length; j++) {
                const s1 = starData[i], s2 = starData[j]
                edges.push({ p1: s1, p2: s2, dist: Math.hypot(s1.pos_x - s2.pos_x, s1.pos_y - s2.pos_y) })
            }
        }
        edges.sort((a, b) => a.dist - b.dist)
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
        const degrees = new Map(), valid = []
        for (let e of edges) {
            const d1 = degrees.get(e.p1.id) || 0, d2 = degrees.get(e.p2.id) || 0
            if (find(e.p1.id) !== find(e.p2.id) && d1 < 2 && d2 < 2) {
                union(e.p1.id, e.p2.id); degrees.set(e.p1.id, d1+1); degrees.set(e.p2.id, d2+1); valid.push(e)
            }
        }
        let groups = new Set(starData.map(s => find(s.id))).size
        if (groups > 1) {
            for (let e of edges) {
                if (find(e.p1.id) !== find(e.p2.id)) { union(e.p1.id, e.p2.id); valid.push(e); groups--; if (groups === 1) break; }
            }
        }
        setLines(valid)
    }

    if (loading) return <Loader />

    const totalPages = Math.ceil(allStars.length / STARS_PER_PAGE)
    const startIndex = (currentPage - 1) * STARS_PER_PAGE
    const displayedStars = allStars.slice(startIndex, startIndex + STARS_PER_PAGE)

    return (
        <div className="sky-container">
            <div style={{ position: 'fixed', inset: 0, background: `radial-gradient(circle, transparent 40%, ${skyTier.id >= 3 ? 'var(--accent)' : 'transparent'} 150%)`, opacity: skyTier.id >= 3 ? 0.15 : 0, pointerEvents: 'none', zIndex: 1, transition: 'opacity 3s ease' }} />
            {skyTier.id >= 3 && (
                <motion.div animate={{ opacity: [0, 0.08, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, background: 'var(--accent)' }} />
            )}
            <AnimatePresence>{toast && (
                <motion.div initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 50, x: '-50%' }} className="toast">{toast}</motion.div>
            )}</AnimatePresence>

            <nav className="navbar" style={{ paddingRight: '20px', paddingLeft: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--nav-height)', pointerEvents: 'none' }}>
                <Link to="/" className="brand" style={{ display: 'flex', alignItems: 'center', height: '100%', width: '80px', justifyContent: 'flex-start', pointerEvents: 'auto' }}>
                    <Logo size={32} />
                </Link>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', flex: 1 }}>
                    <div className="sky-title" style={{ padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.65rem', opacity: 0.6, display: 'block', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: 1 }}>{getGreeting()}</span>
                        <span style={{ lineHeight: 1.2 }}>{creatorName}'s Sky</span>
                    </div>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', opacity: 0.5, marginTop: '2px', lineHeight: 1 }}>
                        {isRevealed ? getSkyMood() : `Revealing in ${timeLeft}`}
                    </div>
                </div>
                <div className="tier-container" title={`${allStars.length} Stars Received`} style={{ width: '80px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', cursor: 'help', pointerEvents: 'auto' }}>
                    <div style={{ fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6, marginBottom: '8px', textAlign: 'right', lineHeight: 1 }}>{skyTier.name}</div>
                    <div style={{ width: '46px', height: '3px', background: 'var(--glass-border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div animate={{ width: `${Math.min((allStars.length / 50) * 100, 100)}%` }} style={{ height: '100%', background: skyTier.id >= 3 ? 'linear-gradient(90deg, #fff, var(--accent))' : 'linear-gradient(90deg, #94a3b8, #fff)', boxShadow: skyTier.id >= 3 ? '0 0 8px var(--accent)' : 'none' }} />
                    </div>
                    <div className="tier-count" style={{ fontSize: '0.45rem', opacity: 0, transition: 'opacity 0.2s', marginTop: '2px', color: 'var(--accent)', lineHeight: 1 }}>{allStars.length} STARS</div>
                </div>
            </nav>

            <motion.div ref={skyRef} className="sky-content" animate={skyTier.id >= 4 ? { y: [0, -10, 0], x: [0, 5, 0], rotate: [0, 0.5, 0] } : {}} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {allStars.length === 0 ? (
                    <div style={{ textAlign: 'center', zIndex: 10 }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--text-secondary)' }}>
                            <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>🌑</div>
                            <p style={{ letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem', opacity: 0.8 }}>This sky is waiting for its first star.</p>
                        </motion.div>
                    </div>
                ) : (
                    <>
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                            {lines.map((line, i) => (
                                <motion.line key={`${line.p1.id}-${line.p2.id}`} x1={`calc(${line.p1.pos_x}% + 6px)`} y1={`calc(${line.p1.pos_y}% + 6px)`} x2={`calc(${line.p2.pos_x}% + 6px)`} y2={`calc(${line.p2.pos_y}% + 6px)`} stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }} />
                            ))}
                        </svg>
                        {displayedStars.map((star) => (
                            <Star key={star.id} star={star} setSelectedStar={(s) => { setSelectedStar(s); playChime(); }} />
                        ))}
                    </>
                )}
            </motion.div>

            <AnimatePresence>
                {showTutorial && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, x: '-50%' }}
                        style={{
                            position: 'fixed',
                            bottom: '100px',
                            left: '50%',
                            zIndex: 100,
                            width: 'calc(100% - 40px)',
                            maxWidth: '320px',
                            background: 'rgba(15, 23, 42, 0.9)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '20px',
                            padding: '20px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                            textAlign: 'center'
                        }}
                    >
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--accent)' }}>✨ Quick Guide</h3>
                        <div style={{ textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <p style={{ margin: 0 }}>🔗 <b>Link:</b> Copy & send to friends to invite them.</p>
                            <p style={{ margin: 0 }}>📱 <b>Story:</b> Share this sky to your social media.</p>
                            <p style={{ margin: 0 }}>📥 <b>Download:</b> Save the sky as a high-quality image.</p>
                            <p style={{ margin: 0 }}>⭐ <b>Tap a Star:</b> Read the secret message hidden within.</p>
                        </div>
                        <button 
                            onClick={dismissTutorial}
                            style={{ 
                                marginTop: '16px', 
                                padding: '8px 24px', 
                                background: 'var(--accent)', 
                                color: 'var(--bg-dark)',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                width: '100%'
                            }}
                        >
                            Got it!
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bottom-controls" style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 50, alignItems: 'center' }}>
                {totalPages > 1 && (
                    <><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button className="pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}><FaChevronLeft size={12} /></button>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', minWidth: 30, textAlign: 'center' }}>{currentPage}/{totalPages}</span>
                        <button className="pagination-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}><FaChevronRight size={12} /></button>
                    </div><div style={{ width: 1, height: 20, background: 'var(--glass-border)', margin: '0 2px' }}></div></>
                )}
                <button className="share-btn" onClick={handleShareLink}>Link 🔗</button>
                <button className="share-btn" onClick={() => handleShareStory('sky', 'share')} disabled={sharing}>
                    {sharing ? '...' : <><FaShareAlt style={{ marginRight: '5px' }} /> Story</>}
                </button>
                <button className="share-btn" onClick={() => handleShareStory('sky', 'download')} disabled={sharing} style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {sharing ? '...' : <FaDownload />}
                </button>
            </div>

            {selectedStar && (
                <div className="modal-overlay" onClick={() => setSelectedStar(null)}>
                    <motion.div 
                        className="glass-card" 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        onClick={(e) => e.stopPropagation()} 
                        style={{ 
                            width: '100%',
                            maxWidth: '400px',
                            padding: 0,
                            position: 'relative',
                            overflow: 'hidden',
                            border: `2px solid ${getStarColor(selectedStar.style)}40`,
                            background: 'rgba(20, 20, 30, 0.98)',
                            boxShadow: `0 30px 60px rgba(0,0,0,0.5), 0 0 40px ${getStarColor(selectedStar.style)}15`,
                            textAlign: 'left'
                        }}
                    >
                        {/* Background Stars Decoration */}
                        {backgroundStars.map((s, i) => (
                            <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, background: 'white', borderRadius: '50%', opacity: 0.15 }} />
                        ))}
                        
                        {/* Tier-based vignette overlay */}
                        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle, transparent 40%, ${skyTier.id >= 3 ? '#fbbf24' : 'transparent'} 150%)`, opacity: skyTier.id >= 3 ? 0.1 : 0, pointerEvents: 'none' }} />

                        <button onClick={() => setSelectedStar(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', width: 'auto', padding: '5px', margin: 0, border: 'none', color: 'var(--text-secondary)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '24px' }}><FaTimes size={18} /></button>
                        
                        <div style={{ textAlign: 'center', opacity: 0.5, paddingTop: '20px', marginBottom: '-10px', position: 'relative', zIndex: 1 }}>
                            <Logo size={24} />
                        </div>

                        {isRevealed ? (
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '25px' }}>
                                    <div style={{ 
                                        width: '80px', height: '80px', 
                                        borderRadius: '20px', 
                                        background: `${getStarColor(selectedStar.style)}20`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '2.5rem',
                                        border: `1px solid ${getStarColor(selectedStar.style)}40`
                                    }}>{selectedStar.emoji}</div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '1.4rem', color: '#f1f5f9', fontWeight: 500 }}>
                                            ~ {selectedStar.sender_name || 'Anonymous'}
                                        </p>
                                        <p style={{ margin: '5px 0 0 0', fontSize: '0.7rem', color: getStarColor(selectedStar.style), textTransform: 'uppercase', letterSpacing: '3px' }}>Sent a wish</p>
                                    </div>
                                </div>

                                <div className="msg-text" style={{ padding: '0 25px 30px 25px', lineHeight: '1.6', fontSize: '1.1rem', color: '#e2e8f0', minHeight: '60px' }}>
                                    {selectedStar.message.split("").map((char, i) => (
                                        <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.05, delay: i * 0.02 }}>{char}</motion.span>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: '10px', padding: '0 20px 20px 20px' }}>
                                    <button className="story-btn" onClick={() => handleShareStory('star', 'share')} disabled={sharing} style={{ flex: 1, margin: 0, height: '45px', background: getStarColor(selectedStar.style), color: ['classic', 'gold', 'green'].includes(selectedStar.style) ? '#020617' : '#ffffff', boxShadow: `0 10px 20px ${getStarColor(selectedStar.style)}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                        {sharing ? '...' : <><FaShareAlt /> Share</>}
                                    </button>
                                    <button className="story-btn" onClick={() => handleShareStory('star', 'download')} disabled={sharing} style={{ width: '45px', margin: 0, height: '45px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {sharing ? '...' : <FaDownload />}
                                    </button>
                                </div>

                                <div style={{ 
                                    background: getStarColor(selectedStar.style), 
                                    height: '40px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    color: ['classic', 'gold', 'green'].includes(selectedStar.style) ? '#020617' : '#ffffff', 
                                    fontWeight: 700, 
                                    fontSize: '0.75rem', 
                                    letterSpacing: '2px', 
                                    textTransform: 'uppercase' 
                                }}>
                                    From {creatorName}'s Sky
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
                                <span className="emoji-big" style={{ fontSize: '4rem' }}>🔒</span>
                                <p style={{ marginTop: '15px', opacity: 0.8 }}>This star is locked until New Year 2026!</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}

            {selectedStar && <StoryCard ref={starCardRef} type="star" data={selectedStar} creatorName={creatorName} skyTier={skyTier} />}
            {allStars.length > 0 && <StoryCard ref={skyCardRef} type="constellation" data={displayedStars} creatorName={creatorName} lines={lines} skyTier={skyTier} />}
            <StoryCard ref={linkCardRef} type="link-only" creatorName={creatorName} />
            {needsRefresh && (<div className="refresh-indicator"><p>Size changed. Please refresh.</p><button onClick={() => window.location.reload()}>Refresh</button></div>)}
        </div>
    )
}
