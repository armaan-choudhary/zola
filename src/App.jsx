import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Send from './pages/Send'
import Sky from './pages/Sky'
import NotFound from './pages/NotFound'
import StarBackground from './StarBackground' // <--- Import it
import Snowfall from 'react-snowfall'
import TimeTheme from './components/TimeTheme'
import { TierProvider } from './context/TierContext'

export default function App() {
  const isMobile = window.innerWidth < 600

  return (
    <TierProvider>
      <BrowserRouter>
        <TimeTheme />
        <StarBackground />
        <Snowfall 
          snowflakeCount={isMobile ? 10 : 30} 
          speed={[0.2, 0.5]} 
          wind={[-0.2, 0.2]} 
          radius={[0.5, 2.0]}
        />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Home />} />
          <Route path="/send/:slug" element={<Send />} />
          <Route path="/c/:slug" element={<Sky />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TierProvider>
  )
}