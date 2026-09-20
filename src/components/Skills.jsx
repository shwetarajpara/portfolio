import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import ScrambleHeading from './ScrambleHeading.jsx'

const STACK = [
  { name: 'react js', version: '19.2.0', level: 100, learning: false },
  { name: 'next js', version: '15.0.0', level: 80, learning: false },
  { name: 'typescript', version: '5.4.0', level: 100, learning: false },
  { name: 'php', version: '8.3.0', level: 90, learning: false },
  { name: 'node js', version: '20.11.0', level: 100, learning: false },
  { name: 'mongodb', version: '7.0.0', level: 50, learning: false },
  { name: 'mysql', version: '8.0.0', level: 100, learning: false },
  { name: 'postgresql', version: '16.2.0', level: 100, learning: false },
  { name: 'python', version: '3.12.0', level: 45, learning: true },
  { name: 'ai-ml', version: '0.4.1', level: 30, learning: true },
]

const TOOLS = ['Tailwind CSS', 'Framer Motion', 'GSAP', 'Git', 'Figma', 'REST APIs', 'Vite', 'MySQL']

const BAR_WIDTH = 22

// Terminal install log: each dependency "installs" one line at a time,
// with a progress bar that fills to its proficiency level. Packages still
// being learned stall mid-bar and stay tagged as in-progress rather than
// reaching a done state — an honest, low-key way to encode skill level
// without a decorative widget bolted on top of the package.json framing.
function InstallLog() {
  const wrapRef = useRef(null)
  const inView = useInView(wrapRef, { once: true, amount: 0.3 })
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (visibleCount >= STACK.length) return
    const t = setTimeout(() => setVisibleCount((c) => c + 1), visibleCount === 0 ? 300 : 260)
    return () => clearTimeout(t)
  }, [inView, visibleCount])

  const done = visibleCount >= STACK.length

  return (
    <div ref={wrapRef} className="border border-[var(--color-line)] bg-[var(--color-panel-light)]/60 rounded-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--color-line)] bg-[var(--color-panel)]/80">
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-line)]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-line)]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-line)]" />
        <span className="ml-2 font-mono text-[11px] text-[var(--color-muted)] tracking-wide">zsh — npm install</span>
      </div>

      <div className="px-5 py-6 font-mono text-[12px] sm:text-[13px] leading-6">
        <p className="text-[var(--color-muted)]">
          <span className="text-[var(--color-teal)]">$</span> npm install
        </p>

        {STACK.slice(0, visibleCount).map((pkg, i) => (
          <LogLine key={pkg.name} pkg={pkg} delay={0} />
        ))}

        {!done && visibleCount < STACK.length && (
          <p className="text-[var(--color-muted)] opacity-60">
            <Spinner /> resolving dependencies…
          </p>
        )}

        {done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-3 pt-3 border-t border-[var(--color-line)]">
            <p className="text-[var(--color-teal)]">
              added {STACK.length} packages in 0.8s
            </p>
            <p className="text-[var(--color-muted)] mt-1">
              <span className="text-[var(--color-amber)]">2 packages</span> are still installing in the background — check back later.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function Spinner() {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧']
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % frames.length), 90)
    return () => clearInterval(t)
  }, [])
  return <span className="text-[var(--color-teal)] mr-1">{frames[i]}</span>
}

function LogLine({ pkg }) {
  const filled = Math.round((pkg.level / 100) * BAR_WIDTH)
  const bar = '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled)

  return (
    <motion.p
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-wrap items-baseline gap-x-2"
    >
      <span className={pkg.learning ? 'text-[var(--color-amber)]' : 'text-[var(--color-teal)]'}>
        {pkg.learning ? '◐' : '✓'}
      </span>
      <span className="text-[var(--color-fg,inherit)]">{pkg.name}</span>
      <span className="text-[var(--color-muted)]">{pkg.version}</span>
      <span className="text-[var(--color-muted)] opacity-70 tracking-tighter">{bar}</span>
      <span className={pkg.learning ? 'text-[var(--color-amber)]' : 'text-[var(--color-muted)]'}>
        {pkg.learning ? 'installing…' : `${pkg.level}%`}
      </span>
    </motion.p>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="relative px-6 lg:px-28 py-32 bg-[var(--color-panel)]/30 border-y border-[var(--color-line)]">
      <div className="max-w-7xl mx-auto">
        <p className="section-heading-num mb-3">02 · package.json</p>
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <h2 className="font-display text-4xl lg:text-5xl font-semibold">
            <ScrambleHeading text="Dependencies I" as="span" /> <ScrambleHeading text="rely on" as="span" className="text-gradient" />
          </h2>
        </div>

        <InstallLog />

        <div className="mt-20 overflow-hidden relative border-t border-[var(--color-line)] pt-8">
          <p className="font-mono text-[10px] text-[var(--color-muted)] tracking-widest mb-4">ALSO IN NODE_MODULES</p>
          <div className="flex gap-10 whitespace-nowrap animate-marquee font-mono text-sm text-[var(--color-muted)]">
            {[...Array(2)].map((_, k) => (
              <div key={k} className="flex gap-10">
                {TOOLS.map((tool) => (
                  <span key={tool + k}>{tool}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
