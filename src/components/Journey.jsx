import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import Mosaic from './Mosaic'
import Reveal from './Reveal'
import { clamp } from '../utils/asset'

const START_GAP = 90 // px of path above the first chapter
const END_GAP = 120 // px of path below the last chapter

function Chapter({ chapter, innerRef }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const hasMedia = Boolean(chapter.image && chapter.image.length)
  return (
    <Reveal as="article" className="wcard chapter" innerRef={innerRef}>
      <div className="whead">
        <span className="wn">{String(chapter.id).padStart(2, '0')}</span>
        <span className="wt">Chapter</span>
        <span className="wline" />
      </div>
      <div className={`chapter__body${hasMedia ? ' has-media' : ''}`}>
        <div className="chapter__text">
          <h3>{chapter.title}</h3>
          {chapter.subTitle && <p className="chapter__sub">{chapter.subTitle}</p>}
          <time className="pill">{chapter.duration}</time>
          <p>{chapter.description}</p>
        </div>
        {hasMedia && <Mosaic images={chapter.image} label={chapter.title} />}
        {chapter.description2 && (
          <div className="chapter__more">
            <div id={id} className={`more${open ? ' open' : ''}`} inert={!open}>
              <div>
                <p>{chapter.description2}</p>
              </div>
            </div>
            <button type="button" className="mbtn" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
              {open ? 'View Less <<' : 'View More >>'}
            </button>
          </div>
        )}
      </div>
    </Reveal>
  )
}

export default function Journey({ intro, chapters, achievements, notes }) {
  const routeRef = useRef(null)
  const cardRefs = useRef([])
  const drawRef = useRef(null)
  const arrowRef = useRef(null)
  const lenRef = useRef(0)
  const [geo, setGeo] = useState(null)
  const [startOn, setStartOn] = useState(false)
  const [endOn, setEndOn] = useState(false)

  // Measures the chapter cards and builds the winding path that connects them:
  // straight beside each card, with an S-curve across the gap to the next one.
  const build = useCallback(() => {
    const route = routeRef.current
    const cards = cardRefs.current.slice(0, chapters.length).filter(Boolean)
    if (!route || !cards.length) return
    const W = route.offsetWidth
    const H = route.offsetHeight
    const cx = W / 2
    const P = cards.map((c) => ({
      x: c.offsetLeft > W * 0.04 ? c.offsetLeft / 2 : (c.offsetLeft + c.offsetWidth + W) / 2,
      t: c.offsetTop,
      b: c.offsetTop + c.offsetHeight,
    }))
    const k0 = START_GAP * 0.55
    let d = `M${cx} ${P[0].t - START_GAP} C${cx} ${P[0].t - START_GAP + k0} ${P[0].x} ${P[0].t - k0} ${P[0].x} ${P[0].t} L${P[0].x} ${P[0].b}`
    for (let i = 0; i < P.length - 1; i++) {
      const a = P[i]
      const b = P[i + 1]
      const k = (b.t - a.b) * 0.55
      d += ` C${a.x} ${a.b + k} ${b.x} ${b.t - k} ${b.x} ${b.t} L${b.x} ${b.b}`
    }
    const last = P[P.length - 1]
    const k1 = END_GAP * 0.55
    d += ` C${last.x} ${last.b + k1} ${cx} ${last.b + END_GAP - k1} ${cx} ${last.b + END_GAP}`
    const next = {
      W,
      H,
      d,
      nodes: P.map((p) => ({ x: p.x, y: p.t + 56 })),
      fin: { x: cx, y: last.b + END_GAP },
      start: { x: cx, y: P[0].t - START_GAP - 12 },
      end: { x: cx, y: last.b + END_GAP + 26 },
    }
    setGeo((prev) => (prev && prev.d === next.d && prev.W === W && prev.H === H ? prev : next))
  }, [chapters.length])

  // Draws the path as you scroll and turns the arrow to follow its direction.
  const progress = useCallback(() => {
    const route = routeRef.current
    const draw = drawRef.current
    const arrow = arrowRef.current
    const len = lenRef.current
    if (!route || !draw || !arrow || !len) return
    const r = route.getBoundingClientRect()
    const q = clamp((innerHeight * 0.62 - r.top) / r.height, 0, 1)
    const at = len * q
    draw.style.strokeDashoffset = len * (1 - q)
    const a = draw.getPointAtLength(Math.max(0, at - 3))
    const b = draw.getPointAtLength(Math.min(len, at + 3))
    const p = draw.getPointAtLength(at)
    const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90
    arrow.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${angle})`)
    setEndOn(q > 0.95)
    setStartOn(r.top < innerHeight * 0.9)
  }, [])

  useLayoutEffect(() => {
    const draw = drawRef.current
    if (!draw) return
    lenRef.current = draw.getTotalLength()
    draw.style.strokeDasharray = lenRef.current
    progress()
  }, [geo, progress])

  useEffect(() => {
    build()
    const ro = 'ResizeObserver' in window ? new ResizeObserver(build) : null
    ro?.observe(routeRef.current)
    addEventListener('resize', build)
    document.fonts?.ready.then(build)
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        progress()
      })
    }
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      ro?.disconnect()
      removeEventListener('resize', build)
      removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [build, progress])

  return (
    <section className="sec" id="journey">
      <div className="wrap">
        <Reveal className="tag">Journey</Reveal>
        <Reveal as="h2">
          My <em>journey</em>
        </Reveal>
        <Reveal as="p" className="sub sub--wide">
          {intro}
        </Reveal>

        <Reveal as="h3" className="h3s">
          Achievements
        </Reveal>
        <ul className="ach">
          {achievements.map((a) => (
            <Reveal as="li" key={a}>
              {a}
            </Reveal>
          ))}
        </ul>

        <div className="route" ref={routeRef}>
          {geo && (
            <svg className="route__svg" width={geo.W} height={geo.H} viewBox={`0 0 ${geo.W} ${geo.H}`} aria-hidden="true" focusable="false">
              <path className="route__base" d={geo.d} />
              <path ref={drawRef} className="route__draw" d={geo.d} />
              {geo.nodes.map((n) => (
                <circle key={`${n.x}-${n.y}`} className="route__node" cx={n.x} cy={n.y} r="7" />
              ))}
              <circle className="route__node route__node--fin" cx={geo.fin.x} cy={geo.fin.y} r="11" />
              <path ref={arrowRef} className="route__arrow" d="M0 -13 L10 11 L0 5 L-10 11 Z" />
            </svg>
          )}
          {chapters.map((c, i) => (
            <Chapter
              key={c.id ?? i}
              chapter={c}
              innerRef={(el) => {
                cardRefs.current[i] = el
              }}
            />
          ))}
          {geo && (
            <>
              <div className={`rnote rnote--start${startOn ? ' on' : ''}`} style={{ left: geo.start.x, top: geo.start.y }}>
                <em>{notes.start}</em>
                <small>{notes.startSub}</small>
              </div>
              <div className={`rnote rnote--end${endOn ? ' on' : ''}`} style={{ left: geo.end.x, top: geo.end.y }}>
                <em>{notes.end}</em>
                <small>{notes.endSub}</small>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
