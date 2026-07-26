import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FiExternalLink, FiGithub } from 'react-icons/fi'
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

function BentoCard({ p, featured }) {
  const cardRef = useRef(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const tiltX = useSpring(rawX, { stiffness: 180, damping: 16 })
  const tiltY = useSpring(rawY, { stiffness: 180, damping: 16 })
  const glowX = useTransform(rawY, [-10, 10], [0, 100])
  const glowY = useTransform(rawX, [10, -10], [0, 100])
  const glowOpacity = useTransform([rawX, rawY], ([x, y]) => Math.min(1, Math.sqrt(x * x + y * y) / 12))

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

      <div className="mt-auto pt-5 flex flex-wrap gap-1.5">
        {p.stack.map((s) => (
          <span key={s} className="font-mono text-[10px] px-2 py-1 rounded bg-[var(--color-panel-light)] text-[var(--color-fg)]">
            {s}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function Projects() {
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
            <BentoCard key={p.name} p={p} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
