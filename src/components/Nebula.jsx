import { useTier } from '../context/TierContext'

/**
 * Nebula Component
 * Adds a subtle, deep atmospheric backplane for the "Infinite Galaxy" phase.
 * Optimized: Uses a smaller container with scale(2) to reduce GPU fragment load.
 */
export default function Nebula() {
  const { tier, isModalOpen } = useTier()

  if (tier !== 4) return null

  return (
    <>
      <div className={`nebula-backplane ${isModalOpen ? 'paused' : ''}`}>
        <div className="nebula-gradient" />
      </div>
    </>
  )
}
