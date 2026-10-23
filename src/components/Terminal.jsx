import { useEffect, useRef, useState } from 'react'
import { clamp } from '../utils/asset'

// Hard-coded on purpose.
const TITLE = 'poojan@quick-infos ~ %'
const LINES = [
  { t: "const developer = 'Poojan';", cmd: true },
  { t: 'cd developer/life/interests', cmd: true },
  { t: 'ls', cmd: true },
  { t: 'i love coding.build' },
  { t: 'i love anime.watch' },
  { t: 'i love crochet.make' },
  { t: 'i love art.draw' },
  { t: 'i love you.flirt' },
  { t: ': ) // just kidding' },
  { t: 'repeat', cmd: true },
]

const Line = ({ line, text, children }) => (
  <div className="line">
    {line.cmd && <b>$ </b>}
    {text}
    {children}
  </div>
)

export default function Terminal() {
  const [open, setOpen] = useState(false) // starts minimized, visible as a launcher
  const [collapsed, setCollapsed] = useState(false)
  const [rows, setRows] = useState([])
  const [partial, setPartial] = useState(null)
  const [pos, setPos] = useState(null)
  const winRef = useRef(null)
  const drag = useRef(null)

  // Types the lines while the window is open, then loops.
  useEffect(() => {
    if (!open) return undefined
    let alive = true
    let timer = 0
    const run = (i, j) => {
      if (!alive) return
      if (i >= LINES.length) {
        timer = setTimeout(() => {
          setRows([])
          setPartial(null)
          run(0, 0)
        }, 3500)
        return
      }
      const line = LINES[i]
      if (j > line.t.length) {
        timer = setTimeout(() => {
          setRows((r) => [...r, line])
          setPartial(null)
          run(i + 1, 0)
        }, line.cmd ? 350 : 200)
        return
      }
      setPartial({ line, text: line.t.slice(0, j) })
      timer = setTimeout(() => run(i, j + 1), line.cmd ? 55 : 24)
    }
    setRows([])
    setPartial(null)
    timer = setTimeout(() => run(0, 0), 450)
    return () => {
      alive = false
      clearTimeout(timer)
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [open])

  // A dragged position can fall off-screen after a resize, so reset it.
  useEffect(() => {
    const reset = () => setPos(null)
    addEventListener('resize', reset)
    return () => removeEventListener('resize', reset)
  }, [])

  const onDown = (e) => {
    if (e.target.closest('button') || !winRef.current) return
    const r = winRef.current.getBoundingClientRect()
    drag.current = { ox: e.clientX - r.left, oy: e.clientY - r.top, w: r.width }
    e.currentTarget.setPointerCapture(e.pointerId)
    setPos({ x: r.left, y: r.top })
  }
  const onMove = (e) => {
    const d = drag.current
    if (!d) return
    setPos({ x: clamp(e.clientX - d.ox, 0, innerWidth - d.w), y: clamp(e.clientY - d.oy, 0, innerHeight - 50) })
  }
  const onUp = () => {
    drag.current = null
  }

  const style = pos ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' } : undefined

  return (
    <>
      <button type="button" className={`tlaunch${open ? '' : ' on'}`} onClick={() => setOpen(true)} aria-label="Open terminal" aria-expanded={open} tabIndex={open ? -1 : 0}>
        <span className="tlaunch__icon" aria-hidden="true">
          &gt;_
        </span>
        <span className="tlaunch__label">terminal</span>
      </button>

      <div ref={winRef} className={`term${open ? ' open' : ''}${collapsed ? ' min' : ''}`} style={style} role="region" aria-label="Terminal" inert={!open}>
        <div className="bar" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          <span className="dots">
            <button type="button" className="dot dot--r" aria-label="Minimize terminal" onClick={() => setOpen(false)} />
            <button type="button" className="dot dot--y" aria-label="Minimize terminal" onClick={() => setOpen(false)} />
            <button type="button" className="dot dot--g" aria-label={collapsed ? 'Expand terminal' : 'Collapse terminal'} onClick={() => setCollapsed((c) => !c)} />
          </span>
          <span className="bar__title">{TITLE}</span>
          <button type="button" className="tmin" aria-label="Minimize terminal" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
              <path d="M2 6h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="body">
          {rows.map((line, i) => (
            <Line key={`${line.t}-${i}`} line={line} text={line.t} />
          ))}
          {partial ? (
            <Line line={partial.line} text={partial.text}>
              <span className="cur" />
            </Line>
          ) : (
            <div className="line">
              <span className="cur" />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
