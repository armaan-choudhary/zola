import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCircle, FaSquare, FaPlay, FaStar, FaHeart, FaGem } from 'react-icons/fa'
import Loader from '../components/Loader'
import Logo from '../components/Logo'

export default function Send() {
  const { slug } = useParams()
  const navigate = useNavigate()
  // Changed 'pointers' to 'shape' in state
  const [form, setForm] = useState({ message: '', name: '', emoji: '✨', style: 'classic', shape: 'FaCircle' })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [creatorName, setCreatorName] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const fetchCreatorName = async () => {
      setFetching(true)
      const { data, error } = await supabase
        .from('skies')
        .select('creator_name')
        .eq('slug', slug)
        .single()

    if (data) {
        setCreatorName(data.creator_name)
      }
      setFetching(false)
    }
    fetchCreatorName()
  }, [slug])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const posX = Math.floor(Math.random() * 90) + 5
    const posY = Math.floor(Math.random() * 90) + 5

    const { error } = await supabase.from('stars').insert({
      sky_slug: slug,
      message: form.message,
      sender_name: form.name,
      emoji: form.emoji,
      pos_x: posX,
      pos_y: posY,
      style: form.style,
      shape: form.shape
    })

    if (error) showToast('Error sending star! 🌑')
    else {
      showToast('Star sent! ✨')
      setForm({ message: '', name: '', emoji: '✨', style: 'classic', shape: 'FaCircle' })
    }
    setLoading(false)
  }

  // Helper to select style and shape
  const selectStyle = (styleName) => setForm({ ...form, style: styleName })
  const selectShape = (shape) => setForm({ ...form, shape: shape })

  if (fetching) return <Loader />

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "A morning wish for"
    if (hour < 18) return "An afternoon light for"
    return "An evening star for"
  }

  return (
    <div className="container">
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="toast"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" className="brand" style={{ display: 'flex', alignItems: 'center', width: '80px', justifyContent: 'flex-start' }}>
          <Logo size={32} />
        </Link>
        <div className="sky-title" style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', opacity: 0.7, display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>{getGreeting()}</span>
          {creatorName}
        </div>
        <div style={{ width: '80px' }}></div>
      </nav>
      <motion.form 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.2 }} 
        onSubmit={handleSubmit}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div style={{ marginBottom: '2rem', textAlign: 'center', maxWidth: '340px', width: '100%' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 300, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Cast a wish into the sky</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', lineHeight: '1.4' }}>Your message will become a new star in {creatorName}'s sky</p>
        </div>
        <textarea
          placeholder="Your message..." required
          value={form.message}
          onChange={e => setForm({...form, message: e.target.value})}
        />
        <input
          type="text" placeholder="Your Name (Optional)"
          value={form.name}
          onChange={e => setForm({...form, name: e.target.value})}
        />

        <div style={{ width: '100%', maxWidth: '340px', margin: '1rem 0' }}>
          {/* --- NEW: Style Selector --- */}
          <p style={{marginBottom: '10px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px'}}>Choose Star Color:</p>
          <div className="style-selector">
            {['classic', 'gold', 'blue', 'fire', 'green', 'purple'].map(s => (
              <div key={s} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className={`style-option opt-${s} ${form.style === s ? 'selected' : ''}`} onClick={() => selectStyle(s)} />
                {form.style === s && (
                  <div style={{ position: 'absolute', bottom: '-8px', width: '4px', height: '4px', borderRadius: '50%', background: 'white' }} />
                )}
              </div>
            ))}
          </div>

          {/* --- NEW: Shape Selector --- */}
          <p style={{marginBottom: '10px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '20px'}}>Choose Star Shape:</p>
          <div className="style-selector">
            {[
              { id: 'FaCircle', icon: FaCircle },
              { id: 'FaSquare', icon: FaSquare },
              { id: 'FaPlay', icon: FaPlay, rotate: 'rotate(90deg)' },
              { id: 'FaStar', icon: FaStar },
              { id: 'FaHeart', icon: FaHeart },
              { id: 'FaGem', icon: FaGem }
            ].map(s => (
              <div key={s.id} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className={`shape-option ${form.shape === s.id ? 'selected' : ''}`} onClick={() => selectShape(s.id)}>
                  <s.icon size={20} color={form.shape === s.id ? 'white' : '#94a3b8'} style={{ transform: s.rotate }} />
                </div>
                {form.shape === s.id && (
                  <div style={{ position: 'absolute', bottom: '-8px', width: '4px', height: '4px', borderRadius: '50%', background: 'white' }} />
                )}
              </div>
            ))}
          </div>
          
          <p style={{marginBottom: '10px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '20px'}}>Choose an Emoji:</p>
          <div className="style-selector">
            {['✨', '❤️', '🔥', '🚀', '💀', '👿'].map((emojiOption) => (
              <div key={emojiOption} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  className={`emoji-option ${form.emoji === emojiOption ? 'selected' : ''}`}
                  onClick={() => setForm({...form, emoji: emojiOption})}
                  title={emojiOption}
                >
                  {emojiOption}
                </div>
                {form.emoji === emojiOption && (
                  <div style={{ position: 'absolute', bottom: '-8px', width: '4px', height: '4px', borderRadius: '50%', background: 'white' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <button 
          disabled={loading} 
          style={{ 
            marginTop: '2rem', 
            width: '100%',
            maxWidth: '340px'
          }}
        >
          {loading ? 'SENDING...' : 'SEND STAR'}
        </button>
      </motion.form>
    </div>
  )
}