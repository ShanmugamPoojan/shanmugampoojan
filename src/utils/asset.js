// Resolves a file in /public/assets, respecting Vite's `base` (needed for GitHub Pages).
export const asset = (name) =>
  (typeof window !== 'undefined' && window.__ASSETS__ && window.__ASSETS__[name]) ||
  `${import.meta.env.BASE_URL}assets/${name}`

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
