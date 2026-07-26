import { useEffect, useState } from 'react'
import useLenis from './lib/useLenis'
import CustomCursor from './components/CustomCursor'
import GitRail from './components/GitRail'
import Loader from './components/Loader'
import CommandPalette from './components/CommandPalette'
import SoundToggle from './components/SoundToggle'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const [loading, setLoading] = useState(true)
  useLenis()

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [loading])

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <div className="noise" />
      <CustomCursor />
      <GitRail />
      <SoundToggle />
      <CommandPalette />
      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
