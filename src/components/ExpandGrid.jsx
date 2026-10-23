import { useEffect, useId, useState } from 'react'
import Reveal from './Reveal'

function Card({ item }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return (
    <div className="card" onMouseMove={onMove}>
      <div className="card__top">
        <small>{item.tag}</small>
        <span className="chip">{item.category}</span>
      </div>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
    </div>
  )
}

// Grid that shows `visible` items and slides the rest open with a smooth animation.
// `renderItem` lets other sections (e.g. books) reuse it with their own card.
export default function ExpandGrid({ items, visible = 4, renderItem, gridClass = '', keyOf = (item) => item.name }) {
  const [open, setOpen] = useState(false)
  const [settled, setSettled] = useState(false)
  const id = useId()
  const draw = renderItem || ((item) => <Card item={item} />)
  const first = items.slice(0, visible)
  const rest = items.slice(visible)

  useEffect(() => {
    if (!open) {
      setSettled(false)
      return undefined
    }
    const t = setTimeout(() => setSettled(true), 1100)
    return () => clearTimeout(t)
  }, [open])

  return (
    <>
      <div className={`grid ${gridClass}`.trim()}>
        {first.map((item, i) => (
          <Reveal key={keyOf(item)} className="grid__item" delay={i * 70}>
            {draw(item, i)}
          </Reveal>
        ))}
      </div>
      {rest.length > 0 && (
        <>
          <div id={id} className={`expand${open ? ' open' : ''}${settled ? ' settled' : ''}`} inert={!open}>
            <div className="expand__in">
              <div className={`grid ${gridClass}`.trim()}>
                {rest.map((item, i) => (
                  <div key={keyOf(item)} className="grid__item late" style={{ '--d': `${i * 80}ms` }}>
                    {draw(item, visible + i)}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="center">
            <button type="button" className="mbtn" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
              {open ? 'View Less <<' : 'View More >>'}
            </button>
          </div>
        </>
      )}
    </>
  )
}
