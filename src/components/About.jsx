import { motion } from 'framer-motion'
import ScrambleHeading from './ScrambleHeading.jsx'

const fadeUp = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function About() {
  return (
    <section id="about" className="relative px-6 lg:px-28 py-32">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-16 items-start">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          <p className="section-heading-num mb-3">01 · README.md</p>
          <h2 className="font-display text-4xl lg:text-5xl font-semibold leading-tight">
            <ScrambleHeading text="About the" as="span" /> <ScrambleHeading text="engineer" as="span" className="text-gradient" />
          </h2>
          <p className="mt-6 text-[var(--color-muted)] leading-relaxed max-w-md">
            I'm a full-stack engineer who thinks in components and cares far too much
            about the 50ms between a click and a response. I've spent the last three
            years building product at startups where design and engineering sit at
            the same table — because the best interfaces are decided, not defaulted into.
          </p>
          <p className="mt-4 text-[var(--color-muted)] leading-relaxed max-w-md">
            Outside of shipping code, I'm usually reverse-engineering some interaction
            I liked on a random site, or arguing that CSS is, in fact, a real programming language.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {['React', 'Node.js', 'TypeScript', 'PHP', 'PostgreSQL', 'MongoDB'].map((t) => (
              <span key={t} className="tag-chip">{t}</span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -1.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] overflow-hidden shadow-2xl shadow-black/40"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-line)] bg-[var(--color-panel-light)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-amber)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-teal)]" />
            <span className="ml-3 font-mono text-xs text-[var(--color-muted)]">about.json</span>
          </div>
          <pre className="p-6 font-mono text-[13px] leading-relaxed overflow-x-auto">
<code>
<span className="text-[var(--color-muted)]">{'{'}</span>{'\n'}
{'  '}<span className="text-[var(--color-teal)]">"name"</span>: <span className="text-[var(--color-amber)]">"Shweta Rajpara"</span>,{'\n'}
{'  '}<span className="text-[var(--color-teal)]">"role"</span>: <span className="text-[var(--color-amber)]">"Full-Stack Engineer"</span>,{'\n'}
{'  '}<span className="text-[var(--color-teal)]">"location"</span>: <span className="text-[var(--color-amber)]">"Junagadh, Gujarat, IN"</span>,{'\n'}
{'  '}<span className="text-[var(--color-teal)]">"focus"</span>: [{'\n'}
{'    '}<span className="text-[var(--color-amber)]">"strong fundamentals"</span>,{'\n'}
{'    '}<span className="text-[var(--color-amber)]">"interaction design"</span>,{'\n'}
{'    '}<span className="text-[var(--color-amber)]">"3D on the web"</span>,{'\n'}
{'    '}<span className="text-[var(--color-amber)]">"performance"</span>{'\n'}
{'  '}],{'\n'}
{'  '}<span className="text-[var(--color-teal)]">"currentlyLearning"</span>: [{'\n'}
{'    '}<span className="text-[var(--color-amber)]">"Python"</span>,{'\n'}
{'    '}<span className="text-[var(--color-amber)]">"AI"</span>,{'\n'}
{'    '}<span className="text-[var(--color-amber)]">"deep dives into 3D websites"</span>{'\n'}
{'  '}],{'\n'}
{'  '}<span className="text-[var(--color-teal)]">"openToWork"</span>: <span className="text-[var(--color-amber)]">true</span>{'\n'}
<span className="text-[var(--color-muted)]">{'}'}</span>
</code>
          </pre>
        </motion.div>
      </div>
    </section>
  )
}
