import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'

export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    lenis.on('scroll', () => {
      gsap.ticker.tick()
    })

    return () => lenis.destroy()
  }, [])
}
