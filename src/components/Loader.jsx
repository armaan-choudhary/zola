import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Logo from './Logo'

export default function Loader() {
  const messages = [
    "Aligning the ZOLA stars...",
    "polishing the ZOLA constellations...",
    "Gathering celestial ZOLA light...",
    "Mapping the ZOLA galaxy...",
    "Consulting the ZOLA nebula...",
    "Counting drifting ZOLA stars...",
    "Whispering to the ZOLA cosmos...",
    "Drafting your celestial map...",
    "Igniting the supernovas...",
    "Syncing with the orbit..."
  ]
  
  const [message, setMessage] = useState(messages[0])

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(messages[Math.floor(Math.random() * messages.length)])
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', zIndex: 1000, textAlign: 'center' }}>
      <motion.div
        animate={{
          scale: [0.9, 1.1, 0.9],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Logo size={80} />
      </motion.div>
      <motion.p
        key={message}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.5 }}
        style={{ marginTop: '20px', letterSpacing: '2px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', padding: '0 20px' }}
      >
        {message}
      </motion.p>
    </div>
  )
}
