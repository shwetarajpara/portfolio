import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import ScrambleHeading from './ScrambleHeading.jsx'

const COMMITS = [
  {
    date: '2024 — Present',
    role: 'Fullstack developer',
    company: 'Xpertlab technologies Pvt Ltd',
    msg: 'feat: developed and delivered enterprise business applications',
    detail: 'Designed and developed full-stack business solutions including Payroll, Project Management, Inventory, Loan, and Attendance Management Systems using React.js, Node.js, PHP, MySQL, and PostgreSQL. Built responsive user interfaces, secure backend APIs, automated report generation, and optimized database performance to improve operational efficiency.'
  },
]

export default function Experience() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.5'],
  })
  const height = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })

  return (
    <section id="experience" ref={ref} className="relative px-6 lg:px-28 py-32">
      <div className="max-w-4xl mx-auto">
        <p className="section-heading-num mb-3">04 · commit log</p>
        <h2 className="font-display text-4xl lg:text-5xl font-semibold mb-16">
          <ScrambleHeading text="Where I've" as="span" /> <ScrambleHeading text="committed" as="span" className="text-gradient" /> my time
        </h2>

        <div className="relative pl-10">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--color-line)]" />
          <motion.div
            className="absolute left-[7px] top-2 w-px bg-[var(--color-amber)] origin-top"
            style={{ scaleY: height, height: 'calc(100% - 1rem)' }}
          />

          <div className="flex flex-col gap-14">
            {COMMITS.map((c, i) => (
              <motion.div
                key={i}
                className="relative"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="absolute -left-[34px] top-1.5 w-3.5 h-3.5 rounded-full bg-[var(--color-ink)] border-2 border-[var(--color-amber)]" />
                <p className="font-mono text-xs text-[var(--color-muted)] mb-1.5">{c.date}</p>
                <p className="font-mono text-sm text-[var(--color-teal)] mb-2">$ git commit -m "{c.msg}"</p>
                <h3 className="font-display text-xl font-semibold">
                  {c.role} <span className="text-[var(--color-muted)] font-body text-base font-normal">@ {c.company}</span>
                </h3>
                <p className="mt-2 text-[var(--color-muted)] text-sm leading-relaxed max-w-xl">{c.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
