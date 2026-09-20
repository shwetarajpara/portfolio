import { useEffect, useRef, useState } from 'react'

// 5-point star path, centered at 0,0, outer radius 10
const STAR_PATH =
  'M0,-10 L2.35,-3.09 L9.51,-3.09 L3.68,1.18 L5.88,8.09 L0,3.82 L-5.88,8.09 L-3.68,1.18 L-9.51,-3.09 L-2.35,-3.09 Z'

export default function CustomCursor() {
  const wrapRef = useRef(null)
  const starRef = useRef(null)
  const [variant, setVariant] = useState('default')

  const pos = useRef({ x: 0, y: 0 })
  const lag = useRef({ x: 0, y: 0 })
  const angle = useRef(0)
  const spin = useRef(2.2)

  useEffect(() => {
    const move = (e) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
    }
    window.addEventListener('mousemove', move)

    let raf
    const tick = () => {
      lag.current.x += (pos.current.x - lag.current.x) * 0.22
      lag.current.y += (pos.current.y - lag.current.y) * 0.22
      angle.current += spin.current
      if (wrapRef.current) {
        wrapRef.current.style.transform = `translate3d(${lag.current.x}px, ${lag.current.y}px, 0)`
      }
      if (starRef.current) {
        starRef.current.style.transform = `rotate(${angle.current}deg)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onEnter = (e) => {
      const t = e.target.closest('[data-cursor]')
      if (t) setVariant(t.getAttribute('data-cursor'))
    }
    const onLeave = (e) => {
      const t = e.target.closest('[data-cursor]')
      if (t) setVariant('default')
    }
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  const isLink = variant === 'link'
  const isDrag = variant === 'drag'

  spin.current = isLink ? 5.5 : isDrag ? 8 : 2.2
  const scale = isLink ? 1.9 : isDrag ? 1.6 : 1
  const color = isDrag ? 'var(--color-teal)' : 'var(--color-amber)'
  const filled = !isDrag

  return (
    <div className="custom-cursor">
      <div
        ref={wrapRef}
        className="fixed top-0 left-0 z-[10000] pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      >
        <svg
          ref={starRef}
          width="26"
          height="26"
          viewBox="-13 -13 26 26"
          style={{
            transition: 'scale 250ms cubic-bezier(0.16,1,0.3,1)',
            scale,
          }}
        >
          <path
            d={STAR_PATH}
            fill={filled ? color : 'none'}
            stroke={color}
            strokeWidth={filled ? 0 : 1.4}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
