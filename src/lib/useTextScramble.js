import { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!<>-_/\\[]{}—=+*^?#'

/**
 * Decodes `text` from scrambled characters into the real string once
 * the returned ref enters the viewport. Returns [ref, displayText].
 */
export default function useTextScramble(text, { trigger = 'inView', speed = 28 } = {}) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(text)
  const hasRun = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const run = () => {
      if (hasRun.current) return
      hasRun.current = true

      let frame = 0
      const totalFrames = text.length * 3
      const revealEvery = 3

      const interval = setInterval(() => {
        frame++
        const revealCount = Math.floor(frame / revealEvery)
        let out = ''
        for (let i = 0; i < text.length; i++) {
          if (text[i] === ' ') {
            out += ' '
          } else if (i < revealCount) {
            out += text[i]
          } else {
            out += CHARS[Math.floor(Math.random() * CHARS.length)]
          }
        }
        setDisplay(out)
        if (revealCount >= text.length) {
          clearInterval(interval)
          setDisplay(text)
        }
      }, speed)

      return () => clearInterval(interval)
    }

    if (trigger !== 'inView') {
      run()
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) run()
        })
      },
      { threshold: 0.4 }
    )
    io.observe(node)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return [ref, display]
}
