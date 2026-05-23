import GalleryGrid from '@/components/gallery/GalleryGrid'

export default function GalleryPage() {
  return (
    <>
      <section style={{
        background: 'linear-gradient(to bottom, var(--bg-section), var(--bg-base))',
        padding: '3rem 2rem 2rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(58,150,53,0.12)', border: '1px solid rgba(58,150,53,0.25)',
            borderRadius: 20, padding: '0.25rem 0.85rem',
            fontSize: '0.78rem', color: 'var(--green-accent)', marginBottom: '1.25rem',
          }}>
            📷 NON-CLASSIFIED IMAGERY
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            // גלריית המעבדה
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.93rem' }}>
            תיעוד חזותי של הציוד והפעילות במעבדה.
          </p>
        </div>
      </section>
      <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <GalleryGrid />
      </div>
    </>
  )
}
