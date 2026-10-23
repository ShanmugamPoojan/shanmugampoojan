import Img from './Img'
import useLightbox from '../hooks/useLightbox'
import { asset } from '../utils/asset'

// Responsive photo grid. 1 large tile + thumbnails for 4+ photos, equal tiles for 1-3.
export default function Mosaic({ images = [], label }) {
  const { open } = useLightbox()
  if (!images.length) return null
  const count = Math.min(images.length, 5)
  return (
    <div className={`mosaic mosaic--n${count}`}>
      {images.slice(0, 5).map((name, i) => (
        <button
          key={name}
          type="button"
          className="tile"
          onClick={() => open(asset(name), `${label}, photo ${i + 1}`)}
          aria-label={`Enlarge photo ${i + 1}: ${label}`}
        >
          <Img name={name} alt="" />
        </button>
      ))}
    </div>
  )
}
