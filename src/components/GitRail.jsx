import { useEffect, useRef, useState } from 'react'
import { playHover } from '../lib/sound'

const NODES = [
  { id: 'hero', label: 'init', hash: 'a1f9c3e' },
  { id: 'about', label: 'readme', hash: 'b0d21aa' },
  { id: 'skills', label: 'dependencies', hash: 'c7e441f' },
  { id: 'projects', label: 'releases', hash: 'd39a02b' },
  { id: 'experience', label: 'commits', hash: 'e88f1c4' },
  { id: 'contact', label: 'deploy', hash: 'f10bee7' },
]

export default function GitRail() {
  const [active, setActive] = useState('hero')
  const [progress, setProgress] = useState(0)
  const railRef = useRef(null)

  useEffect(() => {
    const sections = NODES.map((n) => document.getElementById(n.id)).filter(Boolean)

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )
    sections.forEach((s) => io.observe(s))

    const onScroll = () => {
      const h = document.documentElement
      const scrolled = h.scrollTop
      const height = h.scrollHeight - h.clientHeight
      setProgress(height > 0 ? scrolled / height : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      ref={railRef}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-start gap-0"
      aria-label="Section navigation"
    >
      <div className="relative pl-[3px]">
        <div className="absolute left-0 top-0 w-px h-full bg-[var(--color-line)]" />
        <div
          className="absolute left-0 top-0 w-px bg-[var(--color-amber)] transition-[height] duration-150"
          style={{ height: `${progress * 100}%` }}
        />
        <ul className="flex flex-col gap-8 pl-4">
          {NODES.map((n) => {
            const isActive = active === n.id
            return (
              <li key={n.id} className="relative">
                <button
                  data-cursor="link"
                  onClick={() => scrollTo(n.id)}
                  onMouseEnter={playHover}
                  className="group flex items-center gap-3 -ml-[21px]"
                >
                  <span
                    className="block w-2.5 h-2.5 rounded-full border transition-all duration-300"
                    style={{
                      borderColor: isActive ? 'var(--color-amber)' : 'var(--color-line)',
                      background: isActive ? 'var(--color-amber)' : 'var(--color-ink)',
                      boxShadow: isActive ? '0 0 12px 2px color-mix(in oklab, var(--color-amber) 60%, transparent)' : 'none',
                    }}
                  />
                  <span
                    className="font-mono text-[11px] tracking-wide whitespace-nowrap transition-all duration-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                    style={{ color: isActive ? 'var(--color-amber)' : 'var(--color-muted)', opacity: isActive ? 1 : undefined }}
                  >
                    {n.label} <span className="text-[var(--color-line)]">#{n.hash}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
