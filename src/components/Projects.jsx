import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { FiExternalLink, FiGithub, FiX, FiArrowUpRight } from 'react-icons/fi'
import ScrambleHeading from './ScrambleHeading.jsx'

const PROJECTS = [
  {
    name: 'Payroll',
    tag: 'Payroll Management',
    desc: 'Developed a secure Payroll Management System to streamline salary computation, employee record management, attendance and leave tracking, PF, ESIC, and Professional Tax (PT) calculations, challan generation, payslip generation, and automated payroll report generation.',
    stack: ['PHP', 'MySQL', 'WebSockets'],
    color: '#F2C94C',
  },
  {
    name: 'Queueless',
    tag: 'Healthcare',
    desc: 'A comprehensive Hospital Management System that digitizes healthcare operations through online appointment booking, OPD/IPD management, digital patient records, queue management, laboratory reporting, and billing.',
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    color: '#5EEAD4',
  },
  {
    name: 'XLAMS',
    tag: 'Education Management',
    desc: 'A comprehensive attendance management system for tracking student presence and managing schedules of all.',
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    color: '#ea5ee5',
  },
  {
    name: 'Loan Software',
    tag: 'Loan Management',
    desc: 'Designed and developed a Loan Management System for managing loan disbursement, EMI calculations, repayment schedules, loan cancellation, customer profiles, payment history, and interest computation.',
    stack: ['PHP', 'MySQL'],
    color: '#FF6B6B',
  },
  {
    name: 'Inventory Management System',
    tag: 'Inventory Management',
    desc: 'Built an Inventory Management System that streamlines product catalog management, stock tracking, supplier management, purchase and sales transactions, and automated inventory reporting.',
    stack: ['React.js', 'Vite', 'PostgreSQL', 'Node.js', 'Framer Motion'],
    color: '#F2C94C',
  },
  {
    name: 'Project Management Software',
    tag: 'Project Management',
    desc: 'Built a comprehensive Project Management System to manage projects, tasks, team members, deadlines, milestones, document sharing, and progress tracking with real-time insights.',
    stack: ['PHP', 'PostgreSQL', 'REST API'],
    color: '#5EEAD4',
  },
]

// Roughly how many characters fit in a 3-line clamp before it's worth offering "read more".
const LONG_THRESHOLD = { featured: 220, normal: 130 }

function BentoCard({ p, featured, onOpen }) {
  const cardRef = useRef(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const tiltX = useSpring(rawX, { stiffness: 180, damping: 16 })
  const tiltY = useSpring(rawY, { stiffness: 180, damping: 16 })
  const glowX = useTransform(rawY, [-10, 10], [0, 100])
  const glowY = useTransform(rawX, [10, -10], [0, 100])
  const glowOpacity = useTransform([rawX, rawY], ([x, y]) => Math.min(1, Math.sqrt(x * x + y * y) / 12))

  const isLong = p.desc.length > (featured ? LONG_THRESHOLD.featured : LONG_THRESHOLD.normal)

  const onMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rawY.set(px * 10)
    rawX.set(-py * 10)
  }
  const onMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ perspective: 1000, rotateX: tiltX, rotateY: tiltY }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      data-cursor="link"
      className={`relative rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] overflow-hidden flex flex-col ${
        featured ? 'md:col-span-2 md:row-span-2 p-8' : 'p-6'
      }`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl"
        style={{
          opacity: glowOpacity,
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) => `radial-gradient(280px circle at ${gx}% ${gy}%, color-mix(in oklab, ${p.color} 20%, transparent), transparent 70%)`
          ),
        }}
      />

      <div className="flex items-start justify-between gap-4">
        <p className="tag-chip">{p.tag}</p>
        <div className="flex gap-3 shrink-0">
          <FiExternalLink className="text-[var(--color-amber)]" size={14} />
          <FiGithub className="text-[var(--color-muted)]" size={14} />
        </div>
      </div>

      <h3 className={`font-display font-semibold mt-4 ${featured ? 'text-3xl' : 'text-xl'}`}>{p.name}</h3>

      <p
        className={`mt-3 text-[var(--color-muted)] leading-relaxed ${
          featured ? 'text-sm max-w-md' : 'text-sm line-clamp-3'
        }`}
      >
        {p.desc}
      </p>

      <div className="mt-auto pt-5 flex items-end justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <span key={s} className="font-mono text-[10px] px-2 py-1 rounded bg-[var(--color-panel-light)] text-[var(--color-fg)]">
              {s}
            </span>
          ))}
        </div>

        {isLong && (
          <button
            type="button"
            onClick={() => onOpen(p)}
            data-cursor="link"
            className="shrink-0 flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase px-3 py-2 rounded-full border border-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:border-[var(--color-amber)] transition-colors"
          >
            Read more
            <FiArrowUpRight size={12} />
          </button>
        )}
      </div>
    </motion.div>
  )
}

function ProjectModal({ project, onClose }) {
  // Only mounted while a project is active, so this effect's lifetime
  // matches the modal being open — no need to guard against a null project.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const p = project

  // Rendered through a portal straight into <body>, so it's never trapped
  // inside a transformed/scrolling ancestor (e.g. a smooth-scroll wrapper),
  // which is what was pushing the close button out of reach.
  return createPortal(
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10 cursor-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* accent glow */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-30"
            style={{ background: `radial-gradient(400px circle at 30% 0%, ${p.color}, transparent 70%)` }}
          />

          {/* header */}
          <div className="relative flex items-start justify-between gap-4 px-7 pt-7 pb-5 md:px-10 md:pt-10 border-b border-[var(--color-line)]">
            <div>
              <p className="tag-chip">{p.tag}</p>
              <h3 className="font-display font-semibold text-3xl md:text-4xl mt-4">{p.name}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              data-cursor="link"
              className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:border-[var(--color-amber)] transition-colors"
              aria-label="Close"
            >
              <FiX size={16} />
            </button>
          </div>

          {/* body */}
          <div className="relative overflow-y-auto px-7 py-7 md:px-10 md:py-9">
            <p className="text-base text-[var(--color-fg)]/90 leading-relaxed whitespace-pre-line">{p.desc}</p>

            <div className="mt-8">
              <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-muted)] mb-3">Stack</p>
              <div className="flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-xs px-3 py-1.5 rounded bg-[var(--color-panel-light)] text-[var(--color-fg)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* footer actions */}
          <div className="relative flex items-center gap-3 px-7 py-5 md:px-10 border-t border-[var(--color-line)]">
            <a
              href="#"
              data-cursor="link"
              className="flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase px-4 py-2.5 rounded-full bg-[var(--color-amber)] text-black hover:opacity-90 transition-opacity"
            >
              <FiExternalLink size={13} />
              Live demo
            </a>
            <a
              href="#"
              data-cursor="link"
              className="flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase px-4 py-2.5 rounded-full border border-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:border-[var(--color-amber)] transition-colors"
            >
              <FiGithub size={13} />
              Source
            </a>
          </div>
        </motion.div>
    </motion.div>,
    document.body
  )
}

export default function Projects() {
  const [active, setActive] = useState(null)

  return (
    <section id="projects" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-28">
        <p className="section-heading-num mb-3">03 · releases</p>
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <h2 className="font-display text-4xl lg:text-5xl font-semibold">
            <ScrambleHeading text="Selected" as="span" /> <ScrambleHeading text="work" as="span" className="text-gradient" />
          </h2>
          <p className="font-mono text-[11px] text-[var(--color-muted)] tracking-widest">HOVER TO INSPECT</p>
        </div>

        <div className="grid md:grid-cols-3 auto-rows-[minmax(220px,auto)] gap-5">
          {PROJECTS.map((p, i) => (
            <BentoCard key={p.name} p={p} featured={i === 0} onOpen={setActive} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && <ProjectModal key="project-modal" project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  )
}
