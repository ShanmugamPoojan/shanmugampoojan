import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LightboxContext } from '../context/LightboxContext'

export default function LightboxProvider({ children }) {
  const [item, setItem] = useState(null)
  const closeRef = useRef(null)
  const open = useCallback((src, alt) => setItem({ src, alt }), [])
  const close = useCallback(() => setItem(null), [])
  const value = useMemo(() => ({ open }), [open])

  useEffect(() => {
    if (!item) return undefined
    const onKey = (e) => e.key === 'Escape' && close()
    addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => removeEventListener('keydown', onKey)
  }, [item, close])

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {item && (
        <div className="lb" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={close}>
          <button ref={closeRef} type="button" className="lb__close" onClick={close} aria-label="Close photo">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <img src={item.src} alt={item.alt} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </LightboxContext.Provider>
  )
}
