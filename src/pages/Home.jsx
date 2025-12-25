import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import Logo from '../components/Logo'

export default function Home() {

  const navigate = useNavigate()

  const [creatorName, setCreatorName] = useState('')

  const [globalStars, setGlobalStars] = useState(0)



  useEffect(() => {

    const fetchGlobalCount = async () => {

      const { count, error } = await supabase

        .from('stars')

        .select('*', { count: 'exact', head: true })

      

      if (!error && count !== null) {

        setGlobalStars(count)

      }

    }

    fetchGlobalCount()

  }, [])



  const createSky

 = async () => {
    if (!creatorName.trim()) {
      alert('Please enter your name.')
      return
    }

    // Generate a simple random slug
    const slug = Math.random().toString(36).substring(2, 8)

    // Insert into Supabase
    const { error } = await supabase
      .from('skies')
      .insert([{ slug, creator_name: creatorName }])

    if (error) {
      return
    }

    navigate(`/c/${slug}`)
  }

  return (
    <div className="container" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        style={{ marginBottom: '0.5rem' }}
      >
        <Logo size={100} />
      </motion.div>
      <motion.p 
        style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        A New Year constellation of messages.
      </motion.p>
      
      <motion.div 
        className="tutorial-steps"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        <div className="step"><span>1</span> Create your sky</div>
        <div className="step"><span>2</span> Share your link</div>
        <div className="step"><span>3</span> Watch the constellations grow</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        style={{ width: '100%', maxWidth: '340px', marginTop: '1rem' }}
      >
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '500', color: 'var(--text-primary)' }}>Get your own sky</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={creatorName}
          onChange={(e) => setCreatorName(e.target.value)}
        />
        <button onClick={createSky}>Create My Sky</button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        style={{ 
          fontSize: '0.65rem', 
          color: 'var(--text-secondary)', 
          textTransform: 'uppercase', 
          letterSpacing: '2px',
          marginTop: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '340px'
        }}
      >
        <div style={{ width: '20px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--text-secondary))' }} />
        <span>
          the zola universe is currently holding <span style={{ color: 'var(--accent)', fontWeight: '700', fontFamily: 'monospace' }}>
            {globalStars.toLocaleString()}
          </span> stars ☁️
        </span>
        <div style={{ width: '20px', height: '1px', background: 'linear-gradient(90deg, var(--text-secondary), transparent)' }} />
      </motion.div>
    </div>
  )
}