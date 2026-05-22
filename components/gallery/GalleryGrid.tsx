'use client'

import Image from 'next/image'
import { useState } from 'react'
import Lightbox from './Lightbox'

const galleryItems = [
  { url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800', caption: 'UAV-01 // PROTOTYPE TESTING', large: true },
  { url: 'https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800', caption: 'CONTROL CENTER // MAIN OPS' },
  { url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800', caption: 'FIELD TEST // NEGEV RANGE' },
  { url: 'https://images.unsplash.com/photo-1521405924368-64c5b84bec60?w=800', caption: 'ELECTRONICS LAB // INTEGRATION' },
  { url: 'https://images.unsplash.com/photo-1559657565-8dde23b46d5e?w=800', caption: 'SENSOR ARRAY // TESTING' },
  { url: 'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=800', caption: 'AIRFRAME // COMPOSITE BUILD' },
  { url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800', caption: 'SIMULATION ROOM // AI TRAINING' },
]

export default function GalleryGrid() {
  const [lightbox, setLightbox] = useState<{ url: string; caption: string } | null>(null)

  return (
    <>
      <div className="gallery-grid">
        {galleryItems.map((item, i) => (
          <div
            key={i}
            className={`gallery-item${item.large ? ' large' : ''}`}
            onClick={() => setLightbox({ url: item.url, caption: item.caption })}
          >
            <div className="scan-line" />
            <Image
              src={item.url}
              alt={item.caption}
              fill
              loading="lazy"
              style={{ objectFit: 'cover' }}
            />
            <div className="gallery-overlay">
              <div className="gallery-caption">{item.caption}</div>
            </div>
          </div>
        ))}
      </div>

      {lightbox && (
        <Lightbox
          src={lightbox.url}
          caption={lightbox.caption}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  )
}
