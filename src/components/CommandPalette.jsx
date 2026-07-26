import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiCommand, FiCornerDownLeft } from 'react-icons/fi'
import { playClick, playHover, playSuccess, unlockAudio } from '../lib/sound'

const BASE_COMMANDS = [
  { id: 'hero', label: 'Go to top', hint: 'init', action: (nav) => nav('hero') },
  { id: 'about', label: 'Read about me', hint: 'readme.md', action: (nav) => nav('about') },
  { id: 'skills', label: 'See dependencies', hint: 'package.json', action: (nav) => nav('skills') },
  { id: 'projects', label: 'View selected work', hint: 'releases', action: (nav) => nav('projects') },
  { id: 'experience', label: 'View commit log', hint: 'history', action: (nav) => nav('experience') },
  { id: 'contact', label: 'Get in touch', hint: 'deploy', action: (nav) => nav('contact') },
  {
    id: 'email',
    label: 'Copy email address',
    hint: 'clipboard',
    action: async () => {
      await navigator.clipboard?.writeText('shwetarajpara07@gmail.com')
    },
  },
  {
    id: 'github',
    label: 'Open GitHub profile',
    hint: 'external ↗',
    action: () => window.open('https://github.com/shwetarajpara', '_blank'),
  },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [easterEgg, setEasterEgg] = useState(false)
  const inputRef = useRef(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return BASE_COMMANDS
    const q = query.toLowerCase()
    return BASE_COMMANDS.filter(
      (c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q)
    )
  }, [query])

  const navigate = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const onKey = async (e) => {
      const isMeta = e.metaKey || e.ctrlKey
      if (isMeta && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        await unlockAudio()
        setOpen((o) => !o)
        setQuery('')
        setActiveIndex(0)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  const runCommand = (cmd) => {
    playClick()
    cmd.action(navigate)
    setOpen(false)
  }

  const handleKeyDown = (e) => {
    if (query.trim().toLowerCase() === 'sudo hire me' && e.key === 'Enter') {
      e.preventDefault()
      playSuccess()
      setEasterEgg(true)
      setTimeout(() => {
        setOpen(false)
        setEasterEgg(false)
      }, 2200)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (filtered[activeIndex]) runCommand(filtered[activeIndex])
    }
  }

  return (
    <>
      <button
        onClick={async () => {
          await unlockAudio()
          setOpen(true)
        }}
        data-cursor="link"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-panel)]/70 backdrop-blur px-4 py-2.5 font-mono text-xs text-[var(--color-muted)] hover:border-[var(--color-amber)] hover:text-[var(--color-amber)] transition-colors"
      >
        <FiCommand size={13} />
        <span className="hidden sm:inline">Command palette</span>
        <span className="hidden sm:inline text-[var(--color-line)]">·</span>
        <span className="hidden sm:inline">⌘K</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[150] flex items-start justify-center pt-[14vh] px-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] shadow-2xl shadow-black/50 overflow-hidden"
            >
              {easterEgg ? (
                <div className="p-8 text-center font-mono text-sm">
                  <p className="text-[var(--color-teal)] mb-2">✓ Permission granted.</p>
                  <p className="text-[var(--color-fg)]">Access to shwetarajpara unlocked.</p>
                  <p className="text-[var(--color-muted)] mt-3 text-xs">Redirecting to shwetarajpara07@gmail.com …</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-line)]">
                    <span className="font-mono text-[var(--color-amber)] text-sm">$</span>
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value)
                        setActiveIndex(0)
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a command, or try `sudo hire me`…"
                      className="flex-1 bg-transparent outline-none font-mono text-sm placeholder:text-[var(--color-muted)]"
                    />
                    <kbd className="font-mono text-[10px] text-[var(--color-muted)] border border-[var(--color-line)] rounded px-1.5 py-0.5">esc</kbd>
                  </div>
                  <ul className="max-h-72 overflow-y-auto py-2">
                    {filtered.length === 0 && (
                      <li className="px-4 py-6 text-center font-mono text-xs text-[var(--color-muted)]">
                        command not found — try `sudo hire me`
                      </li>
                    )}
                    {filtered.map((c, i) => (
                      <li key={c.id}>
                        <button
                          onMouseEnter={() => {
                            setActiveIndex(i)
                            playHover()
                          }}
                          onClick={() => runCommand(c)}
                          className="w-full flex items-center justify-between px-4 py-2.5 font-mono text-sm text-left transition-colors"
                          style={{
                            background: i === activeIndex ? 'var(--color-panel-light)' : 'transparent',
                            color: i === activeIndex ? 'var(--color-amber)' : 'var(--color-fg)',
                          }}
                        >
                          <span className="flex items-center gap-2">
                            {i === activeIndex && <FiCornerDownLeft size={12} />}
                            {c.label}
                          </span>
                          <span className="text-[var(--color-muted)] text-xs">{c.hint}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
