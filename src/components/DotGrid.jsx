import { useEffect, useRef } from 'react'

export default function DotGrid({ className = '' }) {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width, height, dots, raf

    const spacing = 34
    const radius = 100 // Slightly larger radius to fit the star shape nicely

    const resize = () => {
      const parent = canvas.parentElement
      width = canvas.width = parent.clientWidth
      height = canvas.height = parent.clientHeight
      dots = []
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          dots.push({ x, y, ox: x, oy: y })
        }
      }
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current.x = e.clientX - rect.left
      mouse.current.y = e.clientY - rect.top
    }
    const onLeave = () => {
      mouse.current.x = -9999
      mouse.current.y = -9999
    }

    // Helper to find the closest point on a line segment
    // This helps snap the dots cleanly onto the star's lines
    const getClosestPointOnSegment = (px, py, ax, ay, bx, by) => {
      const atox = px - ax
      const atoy = py - ay
      const btox = bx - ax
      const btoy = by - ay
      const lenSq = btox * btox + btoy * btoy
      let param = -1
      if (lenSq !== 0) param = (atox * btox + atoy * btoy) / lenSq
      
      let xx, yy
      if (param < 0) {
        xx = ax
        yy = ay
      } else if (param > 1) {
        xx = bx
        yy = by
      } else {
        xx = ax + param * btox
        yy = ay + param * btoy
      }
      return { x: xx, y: yy }
    }

    // Pre-calculate relative star vertices (5-point star)
    const getStarVertices = (cx, cy, outerR, innerR) => {
      const points = []
      let rot = (Math.PI / 2) * 3
      const step = Math.PI / 5

      for (let i = 0; i < 5; i++) {
        points.push({ x: cx + Math.cos(rot) * outerR, y: cy + Math.sin(rot) * outerR })
        rot += step
        points.push({ x: cx + Math.cos(rot) * innerR, y: cy + Math.sin(rot) * innerR })
        rot += step
      }
      return points
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Generate the star outline coordinates around the mouse
      const starPoints = mouse.current.x !== -9999 
        ? getStarVertices(mouse.current.x, mouse.current.y, 55, 22) 
        : []
      
      for (const d of dots) {
        const dx = d.ox - mouse.current.x
        const dy = d.oy - mouse.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        let size = 1.4
        let alpha = 0.16
        const isNear = dist < radius

        if (isNear && starPoints.length > 0) {
          const t = 1 - dist / radius
          size = 1.4 + t * 3.0
          alpha = 0.16 + t * 0.65

          // Find the closest star segment to snap this specific dot onto
          let minDist = Infinity
          let targetX = d.ox
          let targetY = d.oy

          for (let i = 0; i < starPoints.length; i++) {
            const p1 = starPoints[i]
            const p2 = starPoints[(i + 1) % starPoints.length]
            const closest = getClosestPointOnSegment(d.ox, d.oy, p1.x, p1.y, p2.x, p2.y)
            
            const dX = d.ox - closest.x
            const dY = d.oy - closest.y
            const dSq = dX * dX + dY * dY
            if (dSq < minDist) {
              minDist = dSq
              targetX = closest.x
              targetY = closest.y
            }
          }

          // Smoothly pull the dot towards its designated position on the star outline
          d.x += (targetX - d.x) * 0.2
          d.y += (targetY - d.y) * 0.2

        } else {
          // Pull dots back to their original grid slots when cursor leaves
          d.x += (d.ox - d.x) * 0.15
          d.y += (d.oy - d.y) * 0.15
        }

        // Draw the circular dot at its newly calculated position
        ctx.beginPath()
        ctx.arc(d.x, d.y, size, 0, Math.PI * 2)
        ctx.fillStyle = isNear
          ? `rgba(242, 201, 76, ${alpha})`
          : `rgba(123, 132, 150, ${alpha})`
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    canvas.parentElement.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      canvas.parentElement?.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className={`absolute inset-0 pointer-events-none ${className}`} />
}