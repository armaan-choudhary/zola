import { createContext, useState, useContext } from 'react'

const TierContext = createContext()

export function TierProvider({ children }) {
  const [tier, setTier] = useState(1)

  return (
    <TierContext.Provider value={{ tier, setTier }}>
      {children}
    </TierContext.Provider>
  )
}

export function useTier() {
  return useContext(TierContext)
}