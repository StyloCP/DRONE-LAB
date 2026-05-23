'use client'

import { useState } from 'react'
import { useToast } from '@/context/ToastContext'

export default function ChangeAdminPin() {
  const { showToast } = useToast()
  const [oldPin, setOldPin]         = useState('')
  const [newPin, setNewPin]         = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [loading, setLoading]       = useState(false)
  const [open, setOpen]             = useState(false)

  function handleDigit(setter: React.Dispatch<React.SetStateAction<string>>, val: string) {
    return () => setter(prev => prev.length < 4 ? prev + val : prev)
  }
  function handleBackspace(setter: React.Dispatch<React.SetStateAction<string>>) {
    return () => setter(prev => prev.slice(0, -1))
  }

  // Which field is focused
  const [focus, setFocus] = useState<'old' | 'new' | 'confirm'>('old')
  const setterMap = { old: setOldPin, new: setNewPin, confirm: setConfirmPin }
  const valueMap  = { old: oldPin,    new: newPin,    confirm: confirmPin   }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (oldPin.length !== 4 || newPin.length !== 4 || confirmPin.length !== 4) {
      showToast('⚠ כל השדות חייבים להכיל 4 ספרות'); return
    }
    if (newPin !== confirmPin) {
      showToast('⚠ ה-PIN החדש אינו תואם לאישור'); return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/change-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPin, newPin }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('✓ ה-PIN עודכן בהצלחה')
        setOldPin(''); setNewPin(''); setConfirmPin('')
        setFocus('old')
        setOpen(false)
      } else {
        showToast(`⚠ ${data.error ?? 'שגיאה בעדכון ה-PIN'}`)
      }
    } catch {
      showToast('⚠ שגיאת רשת — נסה שוב')
    } finally {
      setLoading(false)
    }
  }

  const DIGITS = ['1','2','3','4','5','6','7','8','9','0']

  const fieldLabels: Record<'old'|'new'|'confirm', string> = {
    old:     'PIN ישן',
    new:     'PIN חדש',
    confirm: 'אישור PIN',
  }

  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(58,150,53,0.15)', paddingTop: '1.5rem' }}>
      {/* Collapsed toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--muted)', fontSize: '0.72rem',
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: '0.08em', padding: 0,
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--green-accent)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
      >
        <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>{open ? '▲' : '▼'}</span>
        <span>שינוי PIN לוח מנהל</span>
        <span style={{
          fontSize: '0.6rem', background: 'rgba(255,68,68,0.08)',
          color: '#ff6666', border: '1px solid rgba(255,68,68,0.2)',
          borderRadius: 4, padding: '0.05rem 0.4rem',
          letterSpacing: '0.1em',
        }}>ADMIN ONLY</span>
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: '1rem',
            background: 'rgba(5,15,5,0.6)',
            border: '1px solid rgba(58,150,53,0.12)',
            borderRadius: 8,
            padding: '1.25rem 1.5rem',
            maxWidth: 420,
          }}
        >
          {/* Field selector tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', justifyContent: 'flex-end' }}>
            {(['old','new','confirm'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFocus(f)}
                style={{
                  fontSize: '0.65rem',
                  fontFamily: "'Share Tech Mono', monospace",
                  padding: '0.2rem 0.6rem',
                  borderRadius: 4,
                  border: `1px solid ${focus === f ? 'rgba(58,150,53,0.5)' : 'var(--border)'}`,
                  background: focus === f ? 'rgba(58,150,53,0.08)' : 'transparent',
                  color: focus === f ? 'var(--green-accent)' : 'var(--muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {fieldLabels[f]}
              </button>
            ))}
          </div>

          {/* PIN dots display */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
            {(['old','new','confirm'] as const).map(f => (
              <div
                key={f}
                onClick={() => setFocus(f)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  cursor: 'pointer', justifyContent: 'flex-end',
                }}
              >
                <span style={{
                  fontSize: '0.6rem', color: 'var(--muted)',
                  fontFamily: "'Share Tech Mono', monospace",
                  minWidth: 60, textAlign: 'right',
                  opacity: focus === f ? 1 : 0.45,
                }}>
                  {fieldLabels[f]}
                </span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {[0,1,2,3].map(i => (
                    <div
                      key={i}
                      style={{
                        width: 9, height: 9, borderRadius: '50%',
                        border: `1px solid ${focus === f ? 'rgba(58,150,53,0.6)' : 'var(--border)'}`,
                        background: valueMap[f].length > i
                          ? (focus === f ? 'var(--green-accent)' : 'var(--muted)')
                          : 'transparent',
                        transition: 'all 0.1s',
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Numpad — 3×3 + bottom row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginBottom: '1rem' }}>
            {DIGITS.slice(0,9).map(d => (
              <button
                key={d} type="button"
                onClick={handleDigit(setterMap[focus], d)}
                disabled={valueMap[focus].length >= 4 || loading}
                style={{
                  padding: '0.6rem 0', fontSize: '0.9rem', fontWeight: 700,
                  fontFamily: "'Share Tech Mono', monospace",
                  background: 'rgba(58,150,53,0.06)',
                  border: '1px solid rgba(58,150,53,0.15)',
                  borderRadius: 5, color: 'var(--text-primary)',
                  cursor: 'pointer', transition: 'all 0.1s',
                  opacity: valueMap[focus].length >= 4 ? 0.35 : 1,
                }}
                onMouseEnter={e => { if (valueMap[focus].length < 4) e.currentTarget.style.background = 'rgba(58,150,53,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(58,150,53,0.06)' }}
              >
                {d}
              </button>
            ))}
            {/* Bottom row: backspace, 0 */}
            <button
              type="button"
              onClick={handleBackspace(setterMap[focus])}
              disabled={loading}
              style={{
                padding: '0.6rem 0', fontSize: '0.8rem',
                fontFamily: "'Share Tech Mono', monospace",
                background: 'rgba(255,68,68,0.05)',
                border: '1px solid rgba(255,68,68,0.15)',
                borderRadius: 5, color: '#ff6666',
                cursor: 'pointer', transition: 'all 0.1s',
              }}
            >
              ⌫
            </button>
            <button
              type="button"
              onClick={handleDigit(setterMap[focus], '0')}
              disabled={valueMap[focus].length >= 4 || loading}
              style={{
                padding: '0.6rem 0', fontSize: '0.9rem', fontWeight: 700,
                fontFamily: "'Share Tech Mono', monospace",
                background: 'rgba(58,150,53,0.06)',
                border: '1px solid rgba(58,150,53,0.15)',
                borderRadius: 5, color: 'var(--text-primary)',
                cursor: 'pointer', transition: 'all 0.1s',
                gridColumn: 'span 2',
                opacity: valueMap[focus].length >= 4 ? 0.35 : 1,
              }}
              onMouseEnter={e => { if (valueMap[focus].length < 4) e.currentTarget.style.background = 'rgba(58,150,53,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(58,150,53,0.06)' }}
            >
              0
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mil-btn"
            disabled={loading || oldPin.length < 4 || newPin.length < 4 || confirmPin.length < 4}
            style={{ width: '100%' }}
          >
            <span className="mil-btn-text">
              {loading ? '⟳ מעדכן...' : '⟫ שנה PIN'}
            </span>
          </button>
        </form>
      )}
    </div>
  )
}
