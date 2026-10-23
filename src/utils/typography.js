// Turns straight apostrophes/quotes in the JSON copy into typographic ones (I'm -> I’m).
// URLs, e-mails and image file names are left untouched.
const SKIP = /^(https?:|mailto:|\/)|\.(jpe?g|png|svg|webp)$/i

export function smartQuotes(value) {
  if (typeof value === 'string') {
    if (SKIP.test(value)) return value
    return value.replace(/(^|[\s(\[])'/g, '$1‘').replace(/'/g, '’')
  }
  if (Array.isArray(value)) return value.map(smartQuotes)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, smartQuotes(v)]))
  }
  return value
}
