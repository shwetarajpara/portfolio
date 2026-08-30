import { motion } from 'framer-motion'
import { FiArrowDown } from 'react-icons/fi'
import DotGrid from './DotGrid.jsx'
import ScrambleHeading from './ScrambleHeading.jsx'
import TypingText from "./TypingText.jsx"
import Photo3D from './Photo3D.jsx'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}
const item = {
  hidden: { y: 28, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center px-6 lg:px-28 pt-24 pb-10 overflow-hidden">
      <DotGrid />
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="font-mono text-xs tracking-[0.2em] text-[var(--color-amber)] mb-6">
            AVAILABLE FOR WORK · JUNAGADH, GUJARAT
          </motion.p>
          <motion.h1 variants={item} className="font-display font-semibold text-[13vw] leading-[0.95] lg:text-[4.6rem] tracking-tight">
            <ScrambleHeading text="Shweta" as="span" speed={26} />{' '}
            <ScrambleHeading text="Rajpara" as="span" className="text-gradient" speed={26} />
          </motion.h1>
          <motion.h2 variants={item} className="font-display text-2xl lg:text-3xl text-[var(--color-muted)] mt-3">
            Full-Stack Software Engineer
          </motion.h2>
          {/* <motion.h2
            variants={item}
            className="font-display text-2xl lg:text-3xl text-[var(--color-muted)] mt-3"
          >
            Full-Stack Software Engineerrr
          </motion.h2> */}
          <motion.p variants={item} className="mt-6 max-w-md text-[var(--color-muted)] leading-relaxed">
            I design and build interfaces that feel inevitable — fast, considered,
            a little bit alive. Currently obsessed with motion systems, 3D on the web,
            and shipping things that don't feel like everyone else's.
          </motion.p>
          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              data-cursor="link"
              className="btn-magnetic inline-flex items-center gap-2 bg-[var(--color-amber)] text-[var(--color-ink)] font-mono text-sm font-medium px-6 py-3 rounded-full hover:scale-[1.03] active:scale-[0.98] transition-transform"
            >
              View work
            </a>
            <a
              href="#contact"
              data-cursor="link"
              className="font-mono text-sm text-[var(--color-fg)] border border-[var(--color-line)] px-6 py-3 rounded-full hover:border-[var(--color-amber)] hover:text-[var(--color-amber)] transition-colors"
            >
              Say hello
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-14 flex gap-8 font-mono text-xs text-[var(--color-muted)]">
            <div>
              <div className="text-[var(--color-fg)] text-xl font-semibold">20+</div>
              projects shipped
            </div>
            <div>
              <div className="text-[var(--color-fg)] text-xl font-semibold">3yr</div>
              in production
            </div>
            {/* <div>
              <div className="text-[var(--color-fg)] text-xl font-semibold">12</div>
              teams collaborated with
            </div> */}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative h-[380px] lg:h-[560px] select-none"
        >
          <Photo3D />
        </motion.div>
      </div>

      <motion.a
        href="#about"
        data-cursor="link"
        aria-label="Scroll to about section"
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-[var(--color-muted)]"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="font-mono text-[10px] tracking-widest">SCROLL</span>
        <FiArrowDown />
      </motion.a>
    </section>
  )
}
