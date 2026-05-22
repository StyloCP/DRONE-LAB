'use client'

import Image from 'next/image'
import { useEffect } from 'react'

interface LightboxProps {
  src: string
  caption: string
  onClose: () => void
}

export default function Lightbox({ src, caption, onClose }: LightboxProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="lightbox open" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>✕ סגור</button>
      <div
        style={{ position: 'relative', maxWidth: '85vw', maxHeight: '75vh', width: 800, height: 500 }}
        onClick={e => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={caption}
          fill
          style={{ objectFit: 'contain', filter: 'saturate(0.6) hue-rotate(80deg)' }}
          sizes="85vw"
        />
      </div>
      <div className="lightbox-caption-text">{caption}</div>
    </div>
  )
}
