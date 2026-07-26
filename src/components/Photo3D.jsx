import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import profileImg from '../assets/Gemini_Generated_Image_ec5ibyec5ibyec5i.png'

export default function Photo3D() {
  const wrapRef = useRef(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const spring = { stiffness: 150, damping: 18, mass: 0.6 }
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [14, -14]), spring)
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-16, 16]), spring)

  // parallax offsets for each depth layer (further layers move less)
  const bgX = useSpring(useTransform(rawX, [-0.5, 0.5], [-14, 14]), spring)
  const bgY = useSpring(useTransform(rawY, [-0.5, 0.5], [-14, 14]), spring)
  const midX = useSpring(useTransform(rawX, [-0.5, 0.5], [-26, 26]), spring)
  const midY = useSpring(useTransform(rawY, [-0.5, 0.5], [-26, 26]), spring)
  const chipX = useSpring(useTransform(rawX, [-0.5, 0.5], [18, -18]), spring)
  const chipY = useSpring(useTransform(rawY, [-0.5, 0.5], [18, -18]), spring)
  const shadowX = useSpring(useTransform(rawX, [-0.5, 0.5], [24, -24]), spring)
  const shadowY = useSpring(useTransform(rawY, [-0.5, 0.5], [16, -16]), spring)

  const onMouseMove = (e) => {
    const rect = wrapRef.current.getBoundingClientRect()
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const onMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative w-full h-full flex items-center justify-center"
      style={{ perspective: 1400 }}
    >
      {/* back-most glow blob — moves least, feels farthest away */}
      <motion.div
        className="absolute w-[70%] h-[70%] rounded-full blur-3xl"
        style={{
          x: bgX,
          y: bgY,
          background: 'radial-gradient(circle, var(--color-amber) 0%, transparent 70%)',
          opacity: 0.25,
        }}
      />
      <motion.div
        className="absolute w-[55%] h-[55%] rounded-full blur-3xl translate-x-10 -translate-y-6"
        style={{
          x: bgX,
          y: bgY,
          background: 'radial-gradient(circle, var(--color-teal) 0%, transparent 70%)',
          opacity: 0.2,
        }}
      />

      {/* dot-grid card sitting behind the photo, in the mid depth layer */}
      <motion.div
        className="absolute w-[80%] h-[80%] rounded-[2rem] border border-[var(--color-line)]"
        style={{
          x: midX,
          y: midY,
          backgroundImage: 'radial-gradient(var(--color-line) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />

      {/* drop shadow that shifts opposite the tilt, selling the depth */}
      <motion.div
        className="absolute w-[72%] h-[85%] rounded-[1.75rem] bg-black/50 blur-2xl"
        style={{ x: shadowX, y: shadowY }}
      />

      {/* the photo card itself — tilts in 3D with the cursor */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative w-[72%] h-[85%] rounded-[1.75rem] overflow-hidden border border-[var(--color-line)] shadow-2xl"
      >
        <img
          src={profileImg}
          alt="Shweta Rajpara"
          className="w-full h-full object-cover"
          style={{ transform: 'translateZ(0)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent 60%, color-mix(in oklab, var(--color-ink) 65%, transparent) 100%)' }}
        />
      </motion.div>

      {/* floating chip — closest layer, moves most, reinforces the parallax */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-line)] bg-[var(--color-panel)]/90 backdrop-blur shadow-xl"
        style={{ x: chipX, y: chipY }}
      >
        <span className="w-2 h-2 rounded-full bg-[var(--color-teal)] pulse-dot" />
        <span className="font-mono text-[11px] tracking-widest text-[var(--color-muted)]">AVAILABLE FOR WORK</span>
      </motion.div>
    </div>
  )
}
