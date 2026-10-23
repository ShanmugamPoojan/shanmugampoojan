import { useContext } from 'react'
import { LightboxContext } from '../context/LightboxContext'

export default function useLightbox() {
  return useContext(LightboxContext)
}
