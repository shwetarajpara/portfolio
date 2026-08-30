import { useRef } from 'react'
import { motion } from 'framer-motion'
import { FiArrowUpRight, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi'
import ScrambleHeading from './ScrambleHeading.jsx'
import ContactTerminal from './ContactTerminal.jsx'
import { playHover } from '../lib/sound'

function MagneticButton({ children, href }) {
  const ref = useRef(null)

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
  }
  const reset = () => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)'
  }

  return (
    <a
      ref={ref}
      href={href}
      data-cursor="link"
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="btn-magnetic inline-flex items-center gap-3 bg-[var(--color-amber)] text-[var(--color-ink)] font-display text-lg sm:text-2xl font-semibold px-8 py-5 sm:px-10 sm:py-6 rounded-full transition-transform duration-200 ease-out"
    >
      {children}
      <FiArrowUpRight />
    </a>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="relative px-6 lg:px-28 py-40 text-center overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <p className="section-heading-num mb-4">05 · deploy</p>
        <h2 className="font-display text-4xl sm:text-6xl font-semibold leading-tight mb-8">
          <ScrambleHeading text="Got something worth" as="span" /> <ScrambleHeading text="building?" as="span" className="text-gradient" />
        </h2>
        <p className="text-[var(--color-muted)] max-w-lg mx-auto mb-12">
          I'm currently open to new roles and select freelance projects.
          If it's interesting, weird, or both — let's talk.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <ContactTerminal />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8"
        >
          <MagneticButton href="mailto:shwetarajpara07@gmail.com">shwetarajpara07@gmail.com</MagneticButton>
        </motion.div>

        <div className="flex items-center justify-center gap-8 mt-16 font-mono text-sm text-[var(--color-muted)]">
          <a href="https://github.com/shwetarajpara" target="_blank" data-cursor="link" onMouseEnter={playHover} className="inline-flex items-center gap-2 hover:text-[var(--color-amber)] transition-colors cursor-none">
            <FiGithub /> github
          </a>
          <a href="https://www.linkedin.com/in/shweta-rajpara-3a0894237" target="_blank" data-cursor="link" onMouseEnter={playHover} className="inline-flex items-center gap-2 hover:text-[var(--color-amber)] transition-colors cursor-none">
            <FiLinkedin /> linkedin
          </a>
          {/* <a href="#" data-cursor="link" onMouseEnter={playHover} className="inline-flex items-center gap-2 hover:text-[var(--color-amber)] transition-colors">
            <FiTwitter /> twitter
          </a> */}
        </div>
      </div>
    </section>
  )
}
