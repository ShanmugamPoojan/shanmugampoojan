import { useEffect, useRef } from 'react'

// Drifting glows plus a particle field that reacts to the pointer.
export default function BackgroundFX() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const cv = canvasRef.current
    const cx = cv.getContext('2d')
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(devicePixelRatio || 1, 2)
    let W = 0
    let H = 0
    let P = []
    let mx = -999
    let my = -999
    let raf = 0
    let rgb = '245,239,222'

    const readColor = () => {
      rgb = getComputedStyle(document.documentElement).getPropertyValue('--parts').trim() || rgb
    }

    const build = () => {
      W = innerWidth
      H = innerHeight
      cv.width = W * dpr
      cv.height = H * dpr
      cx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.round(Math.min(90, (W * H) / 15000))
      P = Array.from({ length: n }, () => {
        const bx = (Math.random() - 0.5) * 0.4
        const by = (Math.random() - 0.5) * 0.4
        return { x: Math.random() * W, y: Math.random() * H, vx: bx, vy: by, bx, by, r: Math.random() * 1.6 + 0.7 }
      })
    }

    const frame = () => {
      cx.clearRect(0, 0, W, H)
      for (let i = 0; i < P.length; i++) {
        const p = P[i]
        const dx = p.x - mx
        const dy = p.y - my
        const d = Math.hypot(dx, dy) || 1
        if (d < 150) {
          const f = (150 - d) / 150
          p.vx += (dx / d) * f * 0.35
          p.vy += (dy / d) * f * 0.35
        }
        p.vx += (p.bx - p.vx) * 0.03
        p.vy += (p.by - p.vy) * 0.03
        p.x += p.vx
        p.y += p.vy
        if (p.x < -10) p.x = W + 10
        if (p.x > W + 10) p.x = -10
        if (p.y < -10) p.y = H + 10
        if (p.y > H + 10) p.y = -10
        cx.fillStyle = `rgba(${rgb},.6)`
        cx.beginPath()
        cx.arc(p.x, p.y, p.r, 0, 6.283)
        cx.fill()
        for (let j = i + 1; j < P.length; j++) {
          const q = P[j]
          const e = Math.hypot(p.x - q.x, p.y - q.y)
          if (e < 120) {
            cx.strokeStyle = `rgba(${rgb},${(1 - e / 120) * 0.22})`
            cx.lineWidth = 1
            cx.beginPath()
            cx.moveTo(p.x, p.y)
            cx.lineTo(q.x, q.y)
            cx.stroke()
          }
        }
        if (d < 170) {
          cx.strokeStyle = `rgba(${rgb},${(1 - d / 170) * 0.4})`
          cx.beginPath()
          cx.moveTo(p.x, p.y)
          cx.lineTo(mx, my)
          cx.stroke()
        }
      }
      if (!reduce && !document.hidden) raf = requestAnimationFrame(frame)
    }

    const start = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(frame)
    }
    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
    }
    const onLeave = () => {
      mx = -999
      my = -999
    }
    // Rebuild only when the width changes or the height changes a lot (ignores mobile URL-bar resizes).
    let lastW = innerWidth
    let lastH = innerHeight
    const onResize = () => {
      if (innerWidth === lastW && Math.abs(innerHeight - lastH) < 120) return
      lastW = innerWidth
      lastH = innerHeight
      build()
      if (reduce) frame()
    }
    const onVisibility = () => {
      if (!document.hidden && !reduce) start()
    }

    readColor()
    build()
    start()
    const mo = new MutationObserver(() => {
      readColor()
      if (reduce) frame()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
      removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div className="bg" aria-hidden="true">
      <i className="blob blob--1" />
      <i className="blob blob--2" />
      <i className="blob blob--3" />
      <canvas ref={canvasRef} />
    </div>
  )
}
