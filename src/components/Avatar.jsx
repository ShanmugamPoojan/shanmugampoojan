import { useCallback, useEffect, useRef, useState } from 'react'
import { clamp } from '../utils/asset'

// Hard-coded on purpose: the messages that pop up around the avatar, one by one.
const MESSAGES = ['Hello there', 'I can see you', 'Welcome to my portfolio', 'Psst, scroll down', 'Yes, I’m watching you']
const TILT = [-4, 3, -2, 4, -3]
const FIRST_DELAY = 1200
const GAP = 4000

const Eye = ({ x, whiteRef, pupilRef }) => (
  <g transform={`translate(${x} 153)`}>
    <g className="eyeg">
      <ellipse ref={whiteRef} rx="12.5" ry="8.5" fill="#fff" />
      <g clipPath="url(#ecl)">
        <g ref={pupilRef} className="mp">
          <circle r="6.2" fill="#3a2214" />
          <circle r="3.3" fill="#0b0605" />
          <circle cx="-2.1" cy="-2.3" r="1.5" fill="#fff" />
        </g>
      </g>
      <path d="M-12.5 0A12.5 8.5 0 0 1 12.5 0" fill="none" stroke="#15151a" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  </g>
)

export default function Avatar() {
  const svgRef = useRef(null)
  const headRef = useRef(null)
  const whites = useRef([])
  const pupils = useRef([])
  const moved = useRef(false)
  const [started, setStarted] = useState(false)
  const [shown, setShown] = useState(0)

  // Both pupils share one gaze direction; the head drifts slightly toward the point.
  const look = useCallback((x, y) => {
    const svg = svgRef.current
    if (!svg || !whites.current[0] || !whites.current[1]) return
    const box = svg.getBoundingClientRect()
    const scale = box.width / 300 || 1
    const a = whites.current[0].getBoundingClientRect()
    const b = whites.current[1].getBoundingClientRect()
    const cx = (a.left + a.width / 2 + b.left + b.width / 2) / 2
    const cy = (a.top + a.height / 2 + b.top + b.height / 2) / 2
    const angle = Math.atan2(y - cy, x - cx)
    const dist = Math.min(6, Math.hypot(x - cx, y - cy) / (10 * scale))
    const tx = Math.cos(angle) * dist
    const ty = Math.sin(angle) * dist * 0.45
    pupils.current.forEach((p) => p && (p.style.transform = `translate(${tx}px, ${ty}px)`))
    const dx = clamp((x - (box.left + box.width / 2)) / 500, -1, 1)
    const dy = clamp((y - (box.top + box.height * 0.45)) / 500, -1, 1)
    if (headRef.current) headRef.current.style.transform = `translate(${dx * 3}px, ${dy * 2.4}px)`
  }, [])

  useEffect(() => {
    let raf = 0
    let px = 0
    let py = 0
    const flush = () => {
      raf = 0
      look(px, py)
    }
    const onMove = (e) => {
      px = e.clientX
      py = e.clientY
      if (!moved.current) {
        moved.current = true
        setStarted(true)
      }
      if (!raf) raf = requestAnimationFrame(flush)
    }
    addEventListener('pointermove', onMove, { passive: true })
    look(innerWidth * 0.5 + 240, innerHeight * 0.4)
    // Before any pointer movement (or on touch screens) the eyes look around on their own.
    const idle = setInterval(() => {
      if (moved.current) return
      const a = Math.random() * 6.283
      look(innerWidth / 2 + Math.cos(a) * 420, innerHeight * 0.4 + Math.sin(a) * 260)
    }, 1700)
    const fallback = setTimeout(() => setStarted(true), 3500)
    return () => {
      removeEventListener('pointermove', onMove)
      clearInterval(idle)
      clearTimeout(fallback)
      cancelAnimationFrame(raf)
    }
  }, [look])

  // Messages pop up one after another, then stay.
  useEffect(() => {
    if (!started) return undefined
    const timers = MESSAGES.map((_, i) => setTimeout(() => setShown(i + 1), FIRST_DELAY + i * GAP))
    return () => timers.forEach(clearTimeout)
  }, [started])

  return (
    <div className="avatar">
      <div className="avatar__fig">
        <svg ref={svgRef} viewBox="0 0 300 330" role="img" aria-label="Illustration of Poojan, whose eyes follow your cursor">
          <defs>
            <clipPath id="ecl">
              <ellipse rx="12.5" ry="8.5" />
            </clipPath>
            <clipPath id="dc">
              <circle cx="150" cy="168" r="138" />
            </clipPath>
            <linearGradient id="skg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#d09a70" />
              <stop offset="1" stopColor="#bb8158" />
            </linearGradient>
          </defs>
          <circle className="mbg" cx="150" cy="168" r="138" />
          <circle className="mring" cx="150" cy="168" r="146" />
          <g clipPath="url(#dc)">
            <path d="M42 336C42 272 92 250 132 244L168 244C208 250 258 272 258 336Z" fill="#f1efe9" />
            <path d="M58 336C58 284 92 260 124 250L148 314L130 336Z" fill="#2b2b31" />
            <path d="M242 336C242 284 208 260 176 250L152 314L170 336Z" fill="#2b2b31" />
            <path d="M126 196L126 248Q150 276 174 248L174 196Z" fill="#c18860" />
            <path d="M124 238L150 284L116 262Z" fill="#fff" stroke="#d8d5cc" />
            <path d="M176 238L150 284L184 262Z" fill="#fff" stroke="#d8d5cc" />
          </g>
          <g ref={headRef} className="mhead">
            <ellipse cx="91" cy="158" rx="10" ry="15" fill="#c28a60" />
            <ellipse cx="209" cy="158" rx="10" ry="15" fill="#c28a60" />
            <path d="M92 140C92 100 118 84 150 84C182 84 208 100 208 140L208 160C208 196 184 222 150 222C116 222 92 196 92 160Z" fill="url(#skg)" />
            <g fill="#15151a">
              <circle cx="98" cy="112" r="16" />
              <circle cx="112" cy="92" r="17" />
              <circle cx="134" cy="82" r="18" />
              <circle cx="158" cy="80" r="18" />
              <circle cx="182" cy="88" r="17" />
              <circle cx="200" cy="104" r="16" />
              <circle cx="206" cy="128" r="12" />
              <circle cx="94" cy="132" r="12" />
              <path d="M94 138C94 100 118 90 150 90C182 90 206 100 206 138C196 116 180 108 150 108C120 108 104 116 94 138Z" />
            </g>
            <g fill="none" stroke="#3a3a42" strokeWidth="2.4" strokeLinecap="round">
              <path d="M110 96q10-9 21-7" />
              <path d="M150 84q10-4 20 0" />
              <path d="M186 94q8 4 12 12" />
            </g>
            <path d="M110 131Q124 122 140 128M160 128Q176 122 190 131" fill="none" stroke="#15151a" strokeWidth="6" strokeLinecap="round" />
            <Eye x={126} whiteRef={(el) => { whites.current[0] = el }} pupilRef={(el) => { pupils.current[0] = el }} />
            <Eye x={174} whiteRef={(el) => { whites.current[1] = el }} pupilRef={(el) => { pupils.current[1] = el }} />
            <path d="M147 162Q142 181 146 187Q150 191 156 187" fill="none" stroke="#9c6743" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="114" cy="184" rx="9" ry="5" fill="#e0907a" opacity=".28" />
            <ellipse cx="186" cy="184" rx="9" ry="5" fill="#e0907a" opacity=".28" />
            <path d="M133 199Q150 213 167 199" fill="none" stroke="#7a3d30" strokeWidth="4" strokeLinecap="round" />
          </g>
        </svg>
      </div>
      <div className="bubbles">
        {MESSAGES.map((m, i) => (
          <span key={m} className={`bubble bubble--${i + 1}${shown > i ? ' on' : ''}`} style={{ '--r': `${TILT[i]}deg` }}>
            {m}
          </span>
        ))}
      </div>
    </div>
  )
}
