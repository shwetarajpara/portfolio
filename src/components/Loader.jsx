import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LINES = [
  '$ whoami',
  'shweta-rajpara // software engineer',
  '$ npm run build-portfolio',
  'compiling components... done',
  'optimizing render tree... done',
  '$ ready on port 3000',
]

export default function Loader({ onDone }) {
  const [visible, setVisible] = useState(true)
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => {
    if (lineIndex >= LINES.length) {
      const t = setTimeout(() => {
        setVisible(false)
        setTimeout(onDone, 700)
      }, 350)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setLineIndex((i) => i + 1), 260)
    return () => clearTimeout(t)
  }, [lineIndex, onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] bg-[var(--color-ink)] flex items-center justify-center"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="w-[min(90vw,520px)] font-mono text-sm">
            {LINES.slice(0, lineIndex).map((l, i) => (
              <div key={i} className="mb-1.5">
                <span className={l.startsWith('$') ? 'text-[var(--color-amber)]' : 'text-[var(--color-muted)]'}>
                  {l}
                </span>
              </div>
            ))}
            <span className="inline-block w-2 h-4 bg-[var(--color-amber)] caret align-middle" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
