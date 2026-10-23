import { asset } from '../utils/asset'

// Lazy, async-decoded image served from /public/assets.
export default function Img({ name, alt = '', className = '', eager = false, ...rest }) {
  return (
    <img
      className={className}
      src={asset(name)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable="false"
      {...rest}
    />
  )
}
