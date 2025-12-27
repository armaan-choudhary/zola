import { createContext, useState, useContext } from 'react'

const TierContext = createContext()

export function TierProvider({ children }) {
  const [tier, setTier] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <TierContext.Provider value={{ tier, setTier, isModalOpen, setIsModalOpen }}>
      {children}
    </TierContext.Provider>
  )
}

export function useTier() {
  const context = useContext(TierContext)
  if (!context) {
    throw new Error('useTier must be used within a TierProvider')
  }
  return context
}