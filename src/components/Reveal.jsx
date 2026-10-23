import { useEffect, useRef, useState } from 'react'

// Fades/slides its children in the first time they scroll into view.
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, innerRef, children, ...rest }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!('IntersectionObserver' in window)) {
      setSeen(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={(el) => {
        ref.current = el
        if (innerRef) innerRef(el)
      }}
      className={`rv${seen ? ' in' : ''} ${className}`.trim()}
      style={{ '--d': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
