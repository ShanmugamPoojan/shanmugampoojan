import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

const LINKS = [
  ['Home', 'top'],
  ['About', 'about'],
  ['My Journey', 'journey'],
  ['Projects', 'projects'],
  ['More', 'more'],
]

export default function Nav() {
  const [active, setActive] = useState('top')
  const [hover, setHover] = useState(null)
  const [box, setBox] = useState({ x: 0, y: 0, w: 0, h: 0 })
  const refs = useRef({})

  const measure = useCallback(() => {
    const el = refs.current[hover ?? active]
    if (el && el.offsetWidth) setBox({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight })
  }, [hover, active])

  useLayoutEffect(measure, [measure])

  useEffect(() => {
    addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => removeEventListener('resize', measure)
  }, [measure])

  // Scroll spy: the last section whose top has passed 40% of the viewport is "active".
  useEffect(() => {
    let raf = 0
    const spy = () => {
      raf = 0
      const line = innerHeight * 0.4
      let cur = LINKS[0][1]
      LINKS.forEach(([, id]) => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) cur = id
      })
      setActive(cur)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(spy)
    }
    spy()
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <nav className="nav" aria-label="Primary" onMouseLeave={() => setHover(null)}>
      <span
        className="nav__ind"
        aria-hidden="true"
        style={{ width: box.w, height: box.h, transform: `translate(${box.x}px, ${box.y}px)` }}
      />
      {LINKS.map(([label, id]) => (
        <a
          key={id}
          href={`#${id}`}
          ref={(el) => {
            refs.current[id] = el
          }}
          className={`nav__link${(hover ?? active) === id ? ' is-on' : ''}`}
          aria-current={active === id ? 'true' : undefined}
          onMouseEnter={() => setHover(id)}
          onFocus={() => setHover(id)}
          onBlur={() => setHover(null)}
        >
          {label}
        </a>
      ))}
    </nav>
  )
}
