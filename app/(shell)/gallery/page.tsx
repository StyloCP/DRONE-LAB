import GalleryGrid from '@/components/gallery/GalleryGrid'

export default function GalleryPage() {
  return (
    <div style={{ padding: '3rem', maxWidth: 1100, margin: '0 auto' }}>
      <div className="section-head">
        <h2>// גלריית המעבדה</h2>
        <div className="section-line" />
        <span className="classify-tag">NON-CLASSIFIED IMAGERY</span>
      </div>
      <GalleryGrid />
    </div>
  )
}
