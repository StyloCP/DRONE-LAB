'use client'
import { useEffect } from 'react'

export default function SessionCleaner() {
  useEffect(() => {
    return () => {
      // Fire-and-forget: clear the cookie when navigating away
      fetch('/api/auth/unit-logout', { method: 'POST' })
    }
  }, [])
  return null
}
