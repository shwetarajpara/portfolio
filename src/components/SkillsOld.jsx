import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import ScrambleHeading from './ScrambleHeading.jsx'

const STACK = [
  { name: 'React', version: '19.2.0', level: 90, learning: false },
  { name: 'JavaScript / TS', version: '5.4.0', level: 92, learning: false },
  { name: 'PHP', version: '8.3.0', level: 85, learning: false },
  { name: 'Node.js', version: '20.11.0', level: 80, learning: false },
  { name: 'MongoDB', version: '7.0.0', level: 82, learning: false },
  { name: 'PostgreSQL', version: '16.2.0', level: 75, learning: false },
  { name: 'Python', version: '3.12', level: 45, learning: true },
  { name: 'AI / ML', version: '0.x', level: 30, learning: true },
]

const TOOLS = ['Tailwind CSS', 'Framer Motion', 'GSAP', 'Git', 'Figma', 'REST APIs', 'Vite', 'MySQL']

// Radial dependency graph: a central "core" node connected to every skill,
// line thickness + node size encode proficiency — literally a package graph.
// Nodes still being "installed" (currently learning) render dashed + dimmer.
function DependencyGraph() {
  const wrapRef = useRef(null)
  const inView = useInView(wrapRef, { once: true, amount: 0.4 })
  const [hovered, setHovered] = useState(null)

  const size = 460
  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.36
  const n = STACK.length

  const nodes = STACK.map((s, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    return {
      ...s,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      r: 5 + (s.level / 100) * 9,
    }
  })

  return (
    <div ref={wrapRef} className="relative w-full flex justify-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[500px] h-auto overflow-visible">
        {/* connecting lines */}
        {nodes.map((node, i) => (
          <motion.line
            key={`line-${i}`}
            x1={cx}
            y1={cy}
            x2={node.x}
            y2={node.y}
            stroke={hovered === i ? 'var(--color-amber)' : 'var(--color-line)'}
            strokeWidth={hovered === i ? 2 : 1}
            strokeDasharray={node.learning ? '4 4' : undefined}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}

        {/* core node */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          <circle cx={cx} cy={cy} r="26" fill="var(--color-panel-light)" stroke="var(--color-amber)" strokeWidth="1.5" />
          <text x={cx} y={cy + 4} textAnchor="middle" className="font-mono" fontSize="10" fill="var(--color-amber)">
            core
          </text>
        </motion.g>

        {/* skill nodes */}
        {nodes.map((node, i) => (
          <motion.g
            key={node.name}
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: `${node.x}px ${node.y}px`, cursor: 'pointer' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill={hovered === i ? 'var(--color-amber)' : node.learning ? 'var(--color-panel-light)' : 'var(--color-teal)'}
              stroke={node.learning ? 'var(--color-teal)' : 'none'}
              strokeWidth={node.learning ? 1.5 : 0}
              fillOpacity={hovered === i ? 1 : node.learning ? 1 : 0.85}
            />
          </motion.g>
        ))}
      </svg>

      {/* labels positioned via flex list (accessible + crisp text, avoids SVG text scaling issues) */}
      <div className="absolute inset-0 pointer-events-none">
        {nodes.map((node, i) => {
          const pctX = (node.x / size) * 100
          const pctY = (node.y / size) * 100
          const isRight = node.x > cx
          return (
            <motion.div
              key={`label-${node.name}`}
              className="absolute font-mono text-[10px] sm:text-[11px] whitespace-nowrap pointer-events-auto"
              style={{
                left: `${pctX}%`,
                top: `${pctY}%`,
                transform: `translate(${isRight ? '10px' : 'calc(-100% - 10px)'}, -50%)`,
                color: hovered === i ? 'var(--color-amber)' : 'var(--color-muted)',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.06 }}
            >
              {node.name}
              {node.learning && <span className="ml-1 text-[var(--color-teal)]">·installing</span>}
              {hovered === i && !node.learning && <span className="ml-1.5 text-[var(--color-teal)]">{node.level}%</span>}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="relative px-6 lg:px-28 py-32 bg-[var(--color-panel)]/30 border-y border-[var(--color-line)]">
      <div className="max-w-7xl mx-auto">
        <p className="section-heading-num mb-3">02 · package.json</p>
        <div className="flex items-end justify-between flex-wrap gap-4 mb-4">
          <h2 className="font-display text-4xl lg:text-5xl font-semibold">
            <ScrambleHeading text="Dependencies I" as="span" /> <ScrambleHeading text="rely on" as="span" className="text-gradient" />
          </h2>
          <p className="font-mono text-[11px] text-[var(--color-muted)] tracking-widest">HOVER A NODE</p>
        </div>

        <div className="mt-6">
          <DependencyGraph />
        </div>

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
