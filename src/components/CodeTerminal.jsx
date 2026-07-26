import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import useTypewriterCode from '../lib/useTypewriterCode'

const kw = (text) => ({ text, cls: 'tok-kw' })
const str = (text) => ({ text, cls: 'tok-str' })
const fn = (text) => ({ text, cls: 'tok-fn' })
const com = (text) => ({ text, cls: 'tok-com' })
const p = (text) => ({ text, cls: 'tok-punc' })
const num = (text) => ({ text, cls: 'tok-num' })
const def = (text) => ({ text, cls: 'tok-def' })

const SNIPPETS = [
  [
    [com('// booting shweta.dev')],
    [kw('function '), fn('buildPortfolio'), p('() {')],
    [p('  '), kw('const '), def('stack'), p(' = ['), str("'React'"), p(', '), str("'PHP'"), p(', '), str("'MongoDB'"), p('];')],
    [p('  '), kw('return '), def('stack'), p('.'), fn('map'), p('('), def('s'), p(' => '), fn('craft'), p('(s));')],
    [p('}')],
    [],
    [fn('buildPortfolio'), p('()'), p('.'), fn('ship'), p('();')],
  ],
  [
    [com('// status check')],
    [kw('const '), def('bugs'), p(' = '), num('0'), p(';')],
    [kw('const '), def('learning'), p(' = ['), str("'Python'"), p(', '), str("'AI'"), p('];')],
    [],
    [kw('if '), p('('), def('deadline'), p('.'), fn('isClose'), p('()) {')],
    [p('  '), fn('focus'), p('('), str("'harder'"), p(');')],
    [p('}')],
  ],
  [
    [com('// deploying to production')],
    [def('git'), p('.'), fn('commit'), p('('), str("'-m'"), p(', '), str("'ship it'"), p(');')],
    [def('git'), p('.'), fn('push'), p('('), str("'origin'"), p(', '), str("'main'"), p(');')],
    [],
    [fn('console'), p('.'), fn('log'), p('('), str("'✓ deployed'"), p(');')],
  ],
]

const SYMBOLS = [
  { char: '{ }', top: '8%', left: '-6%', color: 'var(--color-amber)', delay: 0, dur: 5.5, rotate: -8 },
  { char: '</>', top: '72%', left: '-9%', color: 'var(--color-teal)', delay: 0.6, dur: 6, rotate: 6 },
  { char: '=>', top: '14%', left: '98%', color: 'var(--color-teal)', delay: 1.1, dur: 5, rotate: -4 },
  { char: ';', top: '85%', left: '92%', color: 'var(--color-amber)', delay: 0.3, dur: 4.5, rotate: 10 },
  { char: '[ ]', top: '46%', left: '101%', color: 'var(--color-muted)', delay: 0.9, dur: 6.5, rotate: 4 },
]

export default function CodeTerminal() {
  const wrapRef = useRef(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(rawX, { stiffness: 120, damping: 18 })
  const rotateY = useSpring(rawY, { stiffness: 120, damping: 18 })

  const { visibleLines } = useTypewriterCode(SNIPPETS, { typeSpeed: 22, holdMs: 1400, deleteSpeed: 5 })

  const onMouseMove = (e) => {
    const rect = wrapRef.current.getBoundingClientRect()
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
    <div
      ref={wrapRef}
      className="relative w-full h-full flex items-center justify-center select-none"
      style={{ perspective: 1400 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* ambient glow */}
      <div
        className="absolute w-[70%] h-[70%] rounded-full blur-[90px] opacity-30"
        style={{ background: 'radial-gradient(circle, var(--color-amber) 0%, transparent 70%)' }}
      />

      {/* floating syntax symbols */}
      {SYMBOLS.map((s, i) => (
        <span
          key={i}
          className="float-symbol absolute font-mono text-sm sm:text-base font-medium pointer-events-none hidden sm:block"
          style={{
            top: s.top,
            left: s.left,
            color: s.color,
            opacity: 0.55,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
            '--r': `${s.rotate}deg`,
          }}
        >
          {s.char}
        </span>
      ))}

      <motion.div
        className="relative w-[92%] max-w-[460px]"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        {/* screen */}
        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] shadow-2xl shadow-black/50 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-line)] bg-[var(--color-panel-light)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-amber)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-teal)]" />
            <span className="ml-3 font-mono text-[11px] text-[var(--color-muted)]">portfolio.js</span>
            <span className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-teal)] pulse-dot" />
              <span className="font-mono text-[9px] text-[var(--color-muted)] tracking-wide">LIVE</span>
            </span>
          </div>
          <div className="p-5 font-mono text-[12.5px] sm:text-[13px] leading-relaxed h-[260px] sm:h-[290px] overflow-hidden">
            {visibleLines.map((line, li) => (
              <div key={li} className="flex gap-3">
                <span className="text-[var(--color-line)] select-none w-4 text-right shrink-0">{li + 1}</span>
                <span className="whitespace-pre">
                  {line.map((tok, ti) => (
                    <span key={ti} className={tok.cls}>{tok.text}</span>
                  ))}
                  {li === visibleLines.length - 1 && (
                    <span className="inline-block w-[7px] h-[14px] -mb-[2px] bg-[var(--color-amber)] caret ml-0.5" />
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* laptop base */}
        <div
          className="mx-auto h-3 rounded-b-2xl border-x border-b border-[var(--color-line)] bg-[var(--color-panel-light)]"
          style={{ width: '104%', marginLeft: '-2%' }}
        />
        <div className="mx-auto h-1.5 w-[30%] rounded-b-xl bg-[var(--color-line)]" />
      </motion.div>
    </div>
  )
}
