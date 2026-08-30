import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playHover } from '../lib/sound'

// ─────────────────────────────────────────────────────────────
// Get a free access key at https://web3forms.com (takes 10s,
// no signup — just enter the email you want messages sent to)
// and paste it below. Everything submitted through this form
// will land straight in that inbox.
// ─────────────────────────────────────────────────────────────
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY'

const REASONS = [
  { key: 'job', label: 'job opportunity' },
  { key: 'freelance', label: 'freelance work' },
  { key: 'collab', label: 'collaboration' },
  { key: 'hi', label: 'just saying hi' },
]

const SEND_LOG = [
  'resolving mail server…',
  'encrypting payload… ok',
  'dispatching packet to shweta.dev',
  'awaiting acknowledgement…',
]

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'required'
  if (!values.email.trim()) errors.email = 'required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'enter a valid email'
  if (!values.message.trim()) errors.message = 'required'
  return errors
}

function truncate(str, n) {
  const s = str.trim().replace(/\s+/g, ' ')
  return s.length > n ? s.slice(0, n) + '…' : s
}

export default function ContactTerminal() {
  const [values, setValues] = useState({ name: '', email: '', message: '', reason: 'hi' })
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [logLines, setLogLines] = useState([])
  const emailRef = useRef(null)
  const messageRef = useRef(null)
  const timers = useRef([])

  const errors = validate(values)
  const hasErrors = Object.keys(errors).length > 0

  const setField = (key, val) => setValues((v) => ({ ...v, [key]: val }))
  const markTouched = (key) => setTouched((t) => ({ ...t, [key]: true }))

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // the "command" that builds itself live as the form fills in
  const commandParts = [
    { text: 'send', cls: 'text-[var(--color-fg)]' },
    values.name.trim() && { text: ` --from="${values.name.trim()}"`, cls: 'text-[var(--color-teal)]' },
    values.email.trim() && { text: ` <${values.email.trim()}>`, cls: 'text-[var(--color-muted)]' },
    { text: ` --type=${values.reason}`, cls: 'text-[var(--color-amber)]' },
    values.message.trim() && { text: ` --msg="${truncate(values.message, 34)}"`, cls: 'text-[var(--color-fg)]' },
  ].filter(Boolean)

  const runSendLog = () =>
    new Promise((resolve) => {
      setLogLines([])
      SEND_LOG.forEach((line, i) => {
        const t = setTimeout(() => setLogLines((l) => [...l, line]), 260 * (i + 1))
        timers.current.push(t)
      })
      const done = setTimeout(resolve, 260 * (SEND_LOG.length + 1))
      timers.current.push(done)
    })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })
    const err = validate(values)
    if (err.name || err.email || err.message) return

    setStatus('sending')
    const [, res] = await Promise.all([
      runSendLog(),
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `[${values.reason}] Portfolio message from ${values.name}`,
          from_name: values.name,
          name: values.name,
          email: values.email,
          message: values.message,
        }),
      })
        .then((r) => r.json())
        .catch(() => ({ success: false })),
    ])
    setStatus(res.success ? 'sent' : 'error')
  }

  const reset = () => {
    setValues({ name: '', email: '', message: '', reason: 'hi' })
    setTouched({})
    setStatus('idle')
    setLogLines([])
  }

  const enterMovesNext = (nextRef) => (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      nextRef?.current?.focus()
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto text-left rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] shadow-2xl shadow-black/50 overflow-hidden">
      {/* window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-line)] bg-[var(--color-panel-light)]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-amber)]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-teal)]" />
        <span className="ml-3 font-mono text-[11px] text-[var(--color-muted)]">contact.sh</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full pulse-dot"
            style={{ background: status === 'sent' ? 'var(--color-teal)' : status === 'error' ? 'var(--color-red)' : 'var(--color-amber)' }}
          />
          <span className="font-mono text-[9px] text-[var(--color-muted)] tracking-wide">
            {status === 'sent' ? 'SENT' : status === 'error' ? 'FAILED' : status === 'sending' ? 'SENDING' : 'READY'}
          </span>
        </span>
      </div>

      <div className="p-5 sm:p-6 font-mono text-[13px] sm:text-[13.5px] leading-relaxed">
        <AnimatePresence mode="wait">
          {status === 'sending' ? (
            <motion.div key="log" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[260px]">
              <div className="text-[var(--color-muted)] mb-3">
                <span className="text-[var(--color-amber)]">$</span>{' '}
                {commandParts.map((p, i) => (
                  <span key={i} className={p.cls}>{p.text}</span>
                ))}
              </div>
              {logLines.map((line, i) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[var(--color-muted)]"
                >
                  <span className="text-[var(--color-line)] mr-2">›</span>{line}
                </motion.div>
              ))}
              <span className="inline-block w-[7px] h-[14px] mt-2 bg-[var(--color-amber)] caret" />
            </motion.div>
          ) : status === 'sent' ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-h-[260px]"
            >
              <div className="text-[var(--color-teal)] mb-4">✓ 250 OK — message delivered</div>
              <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-panel-light)] p-4 text-[12px] text-[var(--color-muted)] space-y-1">
                <div><span className="text-[var(--color-line)]">to</span>&nbsp;&nbsp;&nbsp;shweta</div>
                <div><span className="text-[var(--color-line)]">from</span>&nbsp;&nbsp;{values.name} &lt;{values.email}&gt;</div>
                <div><span className="text-[var(--color-line)]">type</span>&nbsp;&nbsp;{values.reason}</div>
                <div><span className="text-[var(--color-line)]">status</span>&nbsp;delivered</div>
              </div>
              <p className="text-[var(--color-muted)] mt-4 text-[12.5px]">I'll get back to you soon. Thanks for reaching out.</p>
              <button
                type="button"
                onClick={reset}
                onMouseEnter={playHover}
                data-cursor="link"
                className="mt-4 text-[11px] uppercase tracking-wide text-[var(--color-muted)] hover:text-[var(--color-amber)] transition-colors cursor-none"
              >
                send another →
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} noValidate>
              {/* live command preview */}
              <div className="mb-5 pb-4 border-b border-dashed border-[var(--color-line)] text-[12px] sm:text-[12.5px] overflow-x-auto whitespace-nowrap">
                <span className="text-[var(--color-amber)]">$</span>{' '}
                {commandParts.map((p, i) => (
                  <span key={i} className={p.cls}>{p.text}</span>
                ))}
                <span className="inline-block w-[6px] h-[12px] ml-0.5 -mb-[1px] bg-[var(--color-amber)] caret" />
              </div>

              {/* reason chips */}
              <div className="mb-5">
                <label className="flex items-center gap-2 text-[var(--color-muted)] mb-2">
                  <span className="text-[var(--color-amber)]">$</span> this is about
                </label>
                <div className="flex flex-wrap gap-2">
                  {REASONS.map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setField('reason', r.key)}
                      onMouseEnter={playHover}
                      data-cursor="link"
                      className={`px-3 py-1.5 rounded-full text-[11.5px] border transition-colors cursor-none ${
                        values.reason === r.key
                          ? 'bg-[var(--color-amber)] border-[var(--color-amber)] text-[var(--color-ink)]'
                          : 'border-[var(--color-line)] text-[var(--color-muted)] hover:border-[var(--color-amber)] hover:text-[var(--color-fg)]'
                      }`}
                    >
                      --type={r.key} <span className="opacity-70">({r.label})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* name */}
              <div className="mb-4">
                <label htmlFor="cf-name" className="flex items-center gap-2 text-[var(--color-muted)] mb-1.5">
                  <span className="text-[var(--color-amber)]">$</span> whoami
                </label>
                <input
                  id="cf-name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => setField('name', e.target.value)}
                  onBlur={() => markTouched('name')}
                  onKeyDown={enterMovesNext(emailRef)}
                  placeholder="your name"
                  className="w-full bg-transparent outline-none border-b border-[var(--color-line)] focus:border-[var(--color-amber)] text-[var(--color-fg)] placeholder:text-[var(--color-line)] pb-2 transition-colors"
                  style={{ cursor: 'text' }}
                />
                {touched.name && errors.name && (
                  <p className="text-[11px] text-[var(--color-red)] mt-1.5">{errors.name}</p>
                )}
              </div>

              {/* email */}
              <div className="mb-4">
                <label htmlFor="cf-email" className="flex items-center gap-2 text-[var(--color-muted)] mb-1.5">
                  <span className="text-[var(--color-amber)]">$</span> contact --email
                </label>
                <input
                  id="cf-email"
                  ref={emailRef}
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => setField('email', e.target.value)}
                  onBlur={() => markTouched('email')}
                  onKeyDown={enterMovesNext(messageRef)}
                  placeholder="your@email.com"
                  className="w-full bg-transparent outline-none border-b border-[var(--color-line)] focus:border-[var(--color-amber)] text-[var(--color-fg)] placeholder:text-[var(--color-line)] pb-2 transition-colors"
                  style={{ cursor: 'text' }}
                />
                {touched.email && errors.email && (
                  <p className="text-[11px] text-[var(--color-red)] mt-1.5">{errors.email}</p>
                )}
              </div>

              {/* message */}
              <div className="mb-5">
                <label htmlFor="cf-message" className="flex items-center gap-2 text-[var(--color-muted)] mb-1.5">
                  <span className="text-[var(--color-amber)]">$</span> compose --message
                </label>
                <textarea
                  id="cf-message"
                  ref={messageRef}
                  rows={4}
                  value={values.message}
                  onChange={(e) => setField('message', e.target.value)}
                  onBlur={() => markTouched('message')}
                  placeholder="what's on your mind?"
                  className="w-full resize-none bg-transparent outline-none border-b border-[var(--color-line)] focus:border-[var(--color-amber)] text-[var(--color-fg)] placeholder:text-[var(--color-line)] pb-2 transition-colors"
                  style={{ cursor: 'text' }}
                />
                {touched.message && errors.message && (
                  <p className="text-[11px] text-[var(--color-red)] mt-1.5">{errors.message}</p>
                )}
              </div>

              {status === 'error' && (
                <p className="text-[12px] text-[var(--color-red)] mb-4">
                  ✗ Something went wrong sending that — please try again, or email me directly.
                </p>
              )}

              <button
                type="submit"
                onMouseEnter={playHover}
                data-cursor="link"
                disabled={Object.keys(touched).length > 0 && hasErrors}
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide px-5 py-2.5 rounded-full border border-[var(--color-line)] text-[var(--color-fg)] hover:text-[var(--color-ink)] hover:bg-[var(--color-amber)] hover:border-[var(--color-amber)] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[var(--color-fg)] transition-colors cursor-none"
              >
                $ ./send
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
