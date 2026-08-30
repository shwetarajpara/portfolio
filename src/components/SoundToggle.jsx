import { useState } from 'react'
import { FiVolume2, FiVolumeX } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { unlockAudio, setMuted, playClick } from '../lib/sound'

export default function SoundToggle() {
  const [on, setOn] = useState(false)

  const toggle = async () => {
    await unlockAudio()
    const next = !on
    setOn(next)
    setMuted(!next)
    if (next) setTimeout(playClick, 40)
  }

  return (
    <motion.button
      onClick={toggle}
      data-cursor="link"
      aria-label={on ? 'Mute interface sound' : 'Enable interface sound'}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.6 }}
      className="fixed top-6 right-6 z-40 w-10 h-10 rounded-full border border-[var(--color-line)] bg-[var(--color-panel)]/70 backdrop-blur flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-amber)] hover:border-[var(--color-amber)] transition-colors"
      title={on ? 'Sound on' : 'Sound off'}
    >
      {on ? <FiVolume2 size={15} /> : <FiVolumeX size={15} />}
    </motion.button>
  )
}
