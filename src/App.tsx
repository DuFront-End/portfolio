import { useState, useEffect, Suspense, lazy } from 'react'
import { AnimatePresence } from 'framer-motion'

// Immediate Load (Critical for LCP)
import Header from './components/layout/Header'
import Hero from './components/sections/Hero'
import LoadingScreen from './components/layout/LoadingScreen'
import MusicWaveEffect from './components/layout/MusicWaveEffect'
import MusicPlayer from './components/layout/MusicPlayer'
import AIChat from './components/layout/AIChat'
import CustomCursor from './components/common/CustomCursor'

// Lazy Load (Non-critical sections)
const About = lazy(() => import('./components/sections/About'))
const Skills = lazy(() => import('./components/sections/Skills'))
const Projects = lazy(() => import('./components/sections/Projects'))
const Achievements = lazy(() => import('./components/sections/Achievements'))
const Contact = lazy(() => import('./components/sections/Contact'))
const Footer = lazy(() => import('./components/layout/Footer'))

// Hooks
import { useScrollProgress } from './hooks/useScrollProgress'

const App = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const { scrollY, activeSection } = useScrollProgress()

  useEffect(() => {
    // Reduced simulated loading time for better perceived performance
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-music-dark text-music-cream min-h-screen selection:bg-music-red/30 selection:text-music-gold font-sans overflow-x-hidden">
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      <CustomCursor />
      
      <div className="relative z-10">
        <Header activeSection={activeSection} />
        
        <main>
          <Hero />
          
          <Suspense fallback={<SectionPlaceholder />}>
            <About activeSection={activeSection} />
            <Skills activeSection={activeSection} />
            <Projects activeSection={activeSection} />
            <Achievements activeSection={activeSection} />
            <Contact activeSection={activeSection} />
          </Suspense>
        </main>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>

      {/* Global Effects */}
      <MusicWaveEffect isPlaying={isMusicPlaying} scrollY={scrollY} activeSection={activeSection} />
      <MusicPlayer onMusicStateChange={setIsMusicPlaying} />
      <AIChat />

    </div>
  )
}

// Simple placeholder for lazy-loaded sections to prevent layout shift
const SectionPlaceholder = () => <div className="min-h-[400px] flex items-center justify-center opacity-0" />

export default App