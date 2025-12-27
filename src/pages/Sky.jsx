import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Star from '../Star'
import { toPng, toBlob } from 'html-to-image'
import StoryCard from '../components/StoryCard'
import Loader from '../components/Loader'
import Logo from '../components/Logo'
import { FaTimes, FaChevronLeft, FaChevronRight, FaShareAlt, FaDownload } from 'react-icons/fa'
import { useTier } from '../context/TierContext'

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

const STARS_PER_PAGE = 10

const backgroundStarsData = [
    { x: 10, y: 15, size: 2 }, { x: 85, y: 10, size: 3 }, { x: 30, y: 40, size: 2 },
    { x: 70, y: 60, size: 3 }, { x: 20, y: 80, size: 2 }, { x: 90, y: 90, size: 3 },
    { x: 50, y: 20, size: 2 }, { x: 15, y: 55, size: 3 }, { x: 80, y: 35, size: 2 },
    { x: 45, y: 75, size: 3 }, { x: 5, y: 95, size: 2 }, { x: 95, y: 5, size: 3 }
];

export default function Sky() {
    // 1. Hooks & State
    const { slug } = useParams()
    const { setTier, setIsModalOpen } = useTier()
    const [searchParams, setSearchParams] = useSearchParams()
    
    const [allStars, setAllStars] = useState([])
    const [lines, setLines] = useState([])
    const [selectedStar, setSelectedStar] = useState(null)
    const [creatorName, setCreatorName] = useState('')
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState(null)
    const [timeLeft, setTimeLeft] = useState('')
    const [sharing, setSharing] = useState(false)
    const [showProgress, setShowProgress] = useState(false)
    const [showTutorial, setShowTutorial] = useState(() => {
        return localStorage.getItem('sky_tutorial_seen') !== 'true'
    })

    useEffect(() => {
        setIsModalOpen(!!selectedStar)
    }, [selectedStar, setIsModalOpen])

    const currentPage = parseInt(searchParams.get('page') || '1')
    const setCurrentPage = useCallback((page) => setSearchParams({ page: page.toString() }), [setSearchParams])

    // 2. Refs
    const skyRef = useRef(null)
    const skyCardRef = useRef(null)
    const starCardRef = useRef(null)
    const linkCardRef = useRef(null)
    const chimeRef = useRef(null)

    // 3. Constants & Derived State
    const NEW_YEAR = useMemo(() => new Date('2026-01-01T00:00:00'), [])
    const isRevealed = useMemo(() => new Date() >= NEW_YEAR, [NEW_YEAR])

    const skyTier = useMemo(() => {
        const count = allStars.length
        if (count < 5) return { id: 1, name: "First Spark", intensity: 1, color: '#94a3b8', next: 5 }
        if (count < 15) return { id: 2, name: "Astral Awakening", intensity: 1.5, color: '#60a5fa', next: 15 }
        if (count < 30) return { id: 3, name: "Supernova Bloom", intensity: 2, color: '#fbbf24', next: 30 }
        return { id: 4, name: "Infinite Galaxy", intensity: 3, color: '#22d3ee', next: null }
    }, [allStars.length])

    // 4. Helper Functions
    const showToast = useCallback((message) => {
        setToast(message)
        setTimeout(() => setToast(null), 3000)
    }, [])

    const dismissTutorial = useCallback(() => {
        setShowTutorial(false)
        localStorage.setItem('sky_tutorial_seen', 'true')
    }, [])

    const playChime = useCallback(() => {
        if (chimeRef.current) {
            chimeRef.current.currentTime = 0
            chimeRef.current.volume = 0.2
            chimeRef.current.play().catch(() => {})
        }
    }, [])

    const handleStarClick = useCallback((s) => {
        setSelectedStar(s)
        playChime()
    }, [playChime])

    const calculateConstellation = useCallback((starData) => {
        if (starData.length < 2) { setLines([]); return; }
        
        const getHash = (val) => {
            const str = String(val)
            let hash = 0
            for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i)
            return Math.abs(hash)
        }

        const edges = []
        for (let i = 0; i < starData.length; i++) {
            for (let j = i + 1; j < starData.length; j++) {
                const s1 = starData[i], s2 = starData[j]
                const realDist = Math.hypot(s1.pos_x - s2.pos_x, s1.pos_y - s2.pos_y)
                const seed = getHash(`${s1.id}-${s2.id}`)
                const jitter = 0.85 + ((seed % 30) / 100) 
                edges.push({ p1: s1, p2: s2, dist: realDist * jitter, realDist: realDist })
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
            const r1 = find(id1), r2 = find(id2)
            if (r1 !== r2) { parent.set(r1, r2); return true; }
            return false;
        }
        
        const degrees = new Map(), valid = []
        let hubId = null;

        for (let e of sortedEdges) {
            if (find(e.p1.id) !== find(e.p2.id)) {
                const d1 = degrees.get(e.p1.id) || 0
                const d2 = degrees.get(e.p2.id) || 0
                const nextD1 = d1 + 1
                const nextD2 = d2 + 1
                let allow = true
                if (nextD1 > 3 || nextD2 > 3) allow = false
                if (allow && nextD1 === 3) { if (hubId !== null && hubId !== e.p1.id) allow = false; }
                if (allow && nextD2 === 3) { if (hubId !== null && hubId !== e.p2.id) allow = false; }

                if (allow) {
                    union(e.p1.id, e.p2.id)
                    degrees.set(e.p1.id, nextD1)
                    degrees.set(e.p2.id, nextD2)
                    valid.push(e)
                    if (nextD1 === 3) hubId = e.p1.id
                    if (nextD2 === 3) hubId = e.p2.id
                }
            }
        }
        
        while (true) {
            const rootSet = new Set(starData.map(s => find(s.id)))
            if (rootSet.size <= 1) break
            let bestEdge = null
            for (let e of sortedEdges) {
                if (find(e.p1.id) !== find(e.p2.id)) {
                    bestEdge = e
                    break; 
                }
            }
            if (bestEdge) {
                union(bestEdge.p1.id, bestEdge.p2.id)
                valid.push(bestEdge)
            } else break; 
        }
        setLines(valid)
    }, [])

    const handleShareLink = useCallback(async () => {
        if (sharing) return
        const url = `${window.location.origin}/send/${slug}`
        
        // 1. Always try to copy to clipboard first (silent best effort)
        let copied = false
        try {
            await navigator.clipboard.writeText(url)
            copied = true
        } catch (e) {
            console.error("Copy failed", e)
        }

        // 2. If mobile/supported, try native share
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 2)

        if (isMobile && navigator.share) {
            setSharing(true)
            try {
                // Try Image Share
                await new Promise(r => setTimeout(r, 100))
                const blob = await toBlob(linkCardRef.current, { cacheBust: true, pixelRatio: 2 })
                if (!blob) throw new Error("Blob failed")
                const file = new File([blob], `zola-invite.png`, { type: 'image/png' })
                const shareData = { files: [file], title: 'ZOLA', text: `Add a star to my sky! ✨`, url: url }
                
                if (navigator.canShare && navigator.canShare(shareData)) {
                    await navigator.share(shareData)
                } else {
                    throw new Error("Cannot share file")
                }
                showToast("Link shared! ✨")
            } catch (err) {
                if (err.name === 'AbortError') return
                // Fallback to Text Share
                try {
                    await navigator.share({ title: 'ZOLA', text: `Add a star to my sky! ✨`, url: url })
                    showToast("Link shared! ✨")
                } catch (e) {
                    if (copied) showToast("Link copied! 🔗")
                    else showToast("Could not share link ✨")
                }
            } finally {
                setSharing(false)
            }
        } else {
            // Desktop / No Share Support
            if (copied) showToast("Link copied! 🔗")
            else showToast("Could not copy link ✨")
        }
    }, [slug, sharing, showToast])

    const handleShareStory = useCallback(async (type, mode = 'share') => {
        if (sharing) return
        const ref = type === 'star' ? starCardRef : skyCardRef
        if (!ref?.current) { showToast("Still preparing... ✨"); return; }
        
        setSharing(true)
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        const url = `${window.location.origin}/send/${slug}`

        try {
            await new Promise(r => setTimeout(r, 500))
            if (mode === 'download') {
                const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 3 })
                const link = document.createElement('a')
                link.download = `zola-${type}.png`; link.href = dataUrl; link.click()
                showToast("Image saved! 📸")
            } else if (navigator.share) {
                const blob = await toBlob(ref.current, { cacheBust: true, pixelRatio: 2 })
                if (!blob) throw new Error("Blob failed")
                const file = new File([blob], `zola-${type}.png`, { type: 'image/png' })
                const shareData = { files: [file], title: `ZOLA ${type}`, text: `Check this out! ✨`, url: url }
                if (navigator.canShare && navigator.canShare(shareData)) await navigator.share(shareData)
                else await navigator.share({ title: `ZOLA ${type}`, url: url })
            } else {
                showToast(isMobile ? "Use 📥 to save! ✨" : "Mobile only. Use 📥! ✨")
            }
        } catch {
            showToast("Operation failed ✨")
        } finally { setSharing(false) }
    }, [slug, sharing, showToast])

    const skyMood = useMemo(() => {
        const count = allStars.length
        if (count === 0) return "A silent void awaits your light"
        if (count < 5) return "The first lights are gathering"
        if (count < 15) return "A vibrant cluster is forming"
        return "A magnificent galaxy of wishes"
    }, [allStars.length])

    const greeting = useMemo(() => {
        const hour = new Date().getHours()
        if (hour < 12) return "A morning view of"
        if (hour < 18) return "An afternoon glimpse of"
        return "An evening sky for"
    }, [])

    const displayedStars = useMemo(() => {
        const startIndex = (currentPage - 1) * STARS_PER_PAGE
        return allStars.slice(startIndex, startIndex + STARS_PER_PAGE)
    }, [allStars, currentPage])

    // 5. Effects
    useEffect(() => {
        setTier(skyTier.id)
    }, [skyTier.id, setTier])

    useEffect(() => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3')
        audio.load(); chimeRef.current = audio
        const unlock = () => {
            if (chimeRef.current) {
                chimeRef.current.play().then(() => { chimeRef.current.pause(); chimeRef.current.currentTime = 0; }).catch(() => null)
            }
            window.removeEventListener('click', unlock)
        }
        window.addEventListener('click', unlock)
        return () => window.removeEventListener('click', unlock)
    }, [])

    useEffect(() => {
        const channel = supabase.channel('sky-realtime').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'stars' }, (payload) => {
            if (payload.new && payload.new.sky_slug === slug) {
                setAllStars((prev) => {
                    if (prev.some(s => s.id === payload.new.id)) return prev
                    return [...prev, payload.new]
                })
                showToast("✨ A new star has joined the sky")
            }
        }).subscribe()
        return () => { supabase.removeChannel(channel); }
    }, [slug, showToast])

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
    }, [allStars, currentPage, calculateConstellation])

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
    }, [isRevealed, NEW_YEAR])

    if (loading) return <Loader />

    const totalPages = Math.ceil(allStars.length / STARS_PER_PAGE)
    const isMobile = window.innerWidth < 600

    return (
        <div className="sky-container">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={skyTier.id === 4 ? { opacity: [0.25, 0.45, 0.25] } : { opacity: skyTier.id >= 3 ? 0.1 : 0 }}
                transition={skyTier.id === 4 ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : { duration: 3 }}
                style={{ 
                position: 'fixed', 
                inset: 0, 
                background: skyTier.id === 4 
                    ? `radial-gradient(circle at 15% 20%, rgba(34, 211, 238, 0.25) 0%, transparent 50%),
                       radial-gradient(circle at 85% 15%, rgba(167, 139, 250, 0.2) 0%, transparent 50%),
                       radial-gradient(circle at 50% 85%, rgba(236, 72, 153, 0.18) 0%, transparent 50%),
                       radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.12) 0%, transparent 40%),
                       radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 40%)`
                    : `radial-gradient(circle, transparent 60%, ${skyTier.id >= 3 ? skyTier.color : 'transparent'} 150%)`,
                pointerEvents: 'none', 
                zIndex: 1, 
            }} />
            {skyTier.id >= 3 && (
                <motion.div 
                    key={`vignette-${skyTier.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.06, 0] }} 
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} 
                    style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, background: skyTier.color }} 
                />
            )}
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

            <nav className="navbar" style={{ paddingRight: '15px', paddingLeft: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--nav-height)', pointerEvents: 'none' }}>
                <Link to="/" className="brand" style={{ display: 'flex', alignItems: 'center', height: '100%', width: window.innerWidth < 600 ? '100px' : '140px', justifyContent: 'flex-start', pointerEvents: 'auto' }}>
                    <Logo size={window.innerWidth < 600 ? 24 : 32} />
                </Link>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', flex: 1, minWidth: 0, padding: '0 5px' }}>
                    <div className="sky-title" style={{ padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.6rem', opacity: 0.6, display: 'block', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: 1 }}>{greeting}</span>
                        <span style={{ lineHeight: 1.2, fontSize: window.innerWidth < 600 ? '0.85rem' : '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', fontWeight: 600 }}>{creatorName}'s Sky</span>
                    </div>
                    <div style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', opacity: 0.5, marginTop: '2px', lineHeight: 1 }}>
                        {isRevealed ? skyMood : `Revealing in ${timeLeft}`}
                    </div>
                </div>
                <div 
                    className="tier-container" 
                    title={`${allStars.length} Stars Received`} 
                    onMouseEnter={() => setShowProgress(true)}
                    onMouseLeave={() => setShowProgress(false)}
                    onClick={() => setShowProgress(!showProgress)}
                    style={{ width: window.innerWidth < 600 ? '100px' : '140px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', cursor: 'pointer', pointerEvents: 'auto', overflow: 'hidden' }}
                >
                    <AnimatePresence mode="wait">
                        {showProgress ? (
                            <motion.div 
                                key="progress-count"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 0.8, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                style={{ fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#fff', marginBottom: '2px', textAlign: 'right', fontWeight: 800 }}
                            >
                                {allStars.length} {skyTier.next ? `/ ${skyTier.next}` : ''} STARS
                            </motion.div>
                        ) : (
                            <motion.div 
                                key={`phase-${skyTier.id}`}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 0.6, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.4 }}
                                style={{ fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '4px', color: skyTier.color, marginBottom: '2px', textAlign: 'right', fontWeight: 800 }}
                            >
                                PHASE 0{skyTier.id}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={`name-${skyTier.id}`}
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', textAlign: 'right', lineHeight: 1, fontWeight: 700, color: skyTier.id === 2 ? '#ffffff' : skyTier.color }}
                        >
                            {skyTier.name}
                        </motion.div>
                    </AnimatePresence>

                    <div style={{ width: '46px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div 
                            animate={{ 
                                width: `${Math.min((allStars.length / 30) * 100, 100)}%`,
                                background: skyTier.id >= 2 ? `linear-gradient(90deg, #fff, ${skyTier.color})` : '#94a3b8',
                                boxShadow: skyTier.id >= 2 ? `0 0 8px ${skyTier.color}80` : 'none'
                            }} 
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            style={{ height: '100%' }} 
                        />
                    </div>
                </div>
            </nav>

            <motion.div ref={skyRef} className="sky-content" style={{ position: 'absolute', top: 'var(--nav-height)', left: 0, right: 0, bottom: 'var(--bottom-height)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                            <defs>
                                {skyTier.id === 2 && (
                                    <linearGradient id="phase2-gradient" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#60a5fa" />
                                        <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                )}
                                {skyTier.id === 3 && (
                                    <linearGradient id="phase3-gradient" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#fbbf24" />
                                        <stop offset="100%" stopColor="#f59e0b" />
                                    </linearGradient>
                                )}
                                {skyTier.id === 4 && (
                                    <linearGradient id="phase4-gradient" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#22d3ee" />
                                        <stop offset="50%" stopColor="#a78bfa" />
                                        <stop offset="100%" stopColor="#ec4899" />
                                    </linearGradient>
                                )}
                            </defs>
                            {lines.map((line, i) => (
                                <motion.line 
                                    key={`${line.p1.id}-${line.p2.id}`}
                                    x1={`${line.p1.pos_x}%`}
                                    y1={`${line.p1.pos_y}%`}
                                    x2={`${line.p2.pos_x}%`}
                                    y2={`${line.p2.pos_y}%`}
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{
                                        pathLength: 1,
                                        opacity: skyTier.id === 4 ? [0.8, 1, 0.8] : 0.6,
                                        strokeWidth: skyTier.id === 4 
                                            ? (isMobile ? [1.5, 2.5, 1.5] : [2.5, 3.5, 2.5])
                                            : skyTier.id === 3
                                                ? (isMobile ? [1, 1.8, 1] : [1.5, 2.5, 1.5])
                                                : (isMobile ? [0.8, 0.8, 0.8] : [1.2, 1.2, 1.2])
                                    }}
                                    transition={{
                                        pathLength: { duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.3 },
                                        opacity: { duration: 0.4, delay: 0.3 },
                                        strokeWidth: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }
                                    }} 
                                    stroke={
                                        skyTier.id === 4 ? "url(#phase4-gradient)" : 
                                        skyTier.id === 3 ? "url(#phase3-gradient)" :
                                        skyTier.id === 2 ? "url(#phase2-gradient)" :
                                        "rgba(255, 255, 255, 0.3)"
                                    }
                                    vectorEffect="non-scaling-stroke"
                                    style={{
                                        filter: skyTier.id >= 3 ? `drop-shadow(0 0 2px ${skyTier.color}60)` : 'none'
                                    }}
                                />
                            ))}
                        </svg>
                        {displayedStars.map((star) => (
                            <Star key={star.id} star={star} setSelectedStar={handleStarClick} />
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

            <div className="bottom-controls" style={{ 
                position: 'fixed', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                display: 'flex', 
                zIndex: 50, 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: window.innerWidth < 600 ? '15px 15px 25px 15px' : '20px 20px 30px 20px',
                pointerEvents: 'none'
            }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', pointerEvents: 'auto', width: 'auto', justifyContent: 'center' }}>
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <button className="pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} style={{ width: 32, height: 32 }}><FaChevronLeft size={10} /></button>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', minWidth: 25, textAlign: 'center' }}>{currentPage}/{totalPages}</span>
                            <button className="pagination-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} style={{ width: 32, height: 32 }}><FaChevronRight size={10} /></button>
                            <div style={{ width: 1, height: 16, background: 'var(--glass-border)', margin: '0 4px' }}></div>
                        </div>
                    )}
                    <button className="share-btn" onClick={handleShareLink} style={{ height: 36, padding: '0 12px' }}>Link 🔗</button>
                    <button className="share-btn" onClick={() => handleShareStory('sky', 'share')} disabled={sharing} style={{ height: 36, padding: '0 12px' }}>
                        {sharing ? '...' : <><FaShareAlt size={12} style={{ marginRight: '4px' }} /> Story</>}
                    </button>
                    <button className="share-btn" onClick={() => handleShareStory('sky', 'download')} disabled={sharing} style={{ width: 36, height: 36, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {sharing ? '...' : <FaDownload size={14} />}
                    </button>
                </div>
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
                        {/* Background Stars Decoration */}
                        {backgroundStarsData.map((s, i) => (
                            <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, background: 'white', borderRadius: '50%', opacity: 0.2 }} />
                        ))}
                        
                        {/* Tier-based vignette overlay */}
                        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle, transparent 40%, ${skyTier.id >= 3 ? '#fbbf24' : 'transparent'} 150%)`, opacity: skyTier.id >= 3 ? 0.1 : 0, pointerEvents: 'none' }} />

                        <button onClick={() => setSelectedStar(null)} style={{ position: 'absolute', top: '12px', left: '12px', background: 'transparent', width: 'auto', padding: '5px', margin: 0, border: 'none', color: 'var(--text-secondary)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '24px' }}><FaTimes size={16} /></button>
                        
                        <div style={{ textAlign: 'center', opacity: 1, paddingTop: '25px', marginBottom: '-15px', position: 'relative', zIndex: 1 }}>
                            <Logo size={28} />
                        </div>

                        {isRevealed ? (
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
                                        <p style={{ margin: '2px 0 0 0', fontSize: '0.6rem', color: getStarColor(selectedStar.style), textTransform: 'uppercase', letterSpacing: '2px' }}>Sent a wish</p>
                                    </div>
                                </div>

                                <div className="msg-text" style={{ padding: '0 20px 25px 20px', lineHeight: '1.5', fontSize: '1rem', color: '#e2e8f0', minHeight: '50px' }}>
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                        {selectedStar.message}
                                    </motion.div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', padding: '0 15px 15px 15px' }}>
                                    <button className="story-btn" onClick={() => handleShareStory('star', 'share')} disabled={sharing} style={{ flex: 1, margin: 0, height: '40px', background: getStarColor(selectedStar.style), color: ['classic', 'gold', 'green'].includes(selectedStar.style) ? '#020617' : '#ffffff', boxShadow: `0 8px 15px ${getStarColor(selectedStar.style)}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem' }}>
                                        {sharing ? '...' : <><FaShareAlt size={12} /> Share</>}
                                    </button>
                                    <button className="story-btn" onClick={() => handleShareStory('star', 'download')} disabled={sharing} style={{ width: '40px', margin: 0, height: '40px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {sharing ? '...' : <FaDownload size={12} />}
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
                                    From {creatorName}'s Sky
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
                                <span className="emoji-big" style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>🔒</span>
                                <p style={{ fontSize: '1rem', color: '#f1f5f9', fontWeight: 500 }}>This star is locked</p>
                                <p style={{ marginTop: '8px', opacity: 0.6, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Unlocks on New Year 2026</p>
                                <button 
                                    onClick={() => setSelectedStar(null)}
                                    style={{ marginTop: '20px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid var(--glass-border)', width: 'auto', padding: '8px 24px', fontSize: '0.8rem' }}
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedStar && <StoryCard ref={starCardRef} type="star" data={selectedStar} creatorName={creatorName} skyTier={skyTier} totalStars={allStars.length} />}
            <StoryCard ref={skyCardRef} type="constellation" data={displayedStars} creatorName={creatorName} lines={lines} skyTier={skyTier} totalStars={allStars.length} />
            <StoryCard ref={linkCardRef} type="link-only" creatorName={creatorName} totalStars={allStars.length} />
        </div>
    )
}
