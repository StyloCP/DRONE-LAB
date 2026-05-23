/**
 * E2E Test Suite — מעבדת רחפנים 674
 * 105+ tests covering: navigation, public pages, auth gates, admin PIN,
 * appointment booking, API security, mobile responsiveness, accessibility.
 *
 * Run: npx playwright test
 * Run with UI: npx playwright test --ui
 */

import { test, expect, Page } from '@playwright/test'

const BASE = process.env.TEST_BASE_URL ?? 'http://localhost:3000'
const UNIT_CODE = '674lab'
const ADMIN_PIN = '6741'
const WRONG_PIN = '0000'
const WRONG_CODE = 'wrongcode'

// ════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════

/** Set unit_token by calling auth API with a unique IP to avoid rate limit pollution */
async function visitWithUnitToken(page: Page, ip: string, path = '/appointments') {
  const res = await page.request.post(`${BASE}/api/auth/unit`, {
    headers: { 'x-forwarded-for': ip },
    data: { code: UNIT_CODE },
  })
  expect(res.status()).toBe(200)
  await page.goto(`${BASE}${path}`)
}

/** Set admin_token by calling auth API with a unique IP */
async function visitWithAdminToken(page: Page, ip: string, path = '/admin/dashboard') {
  const res = await page.request.post(`${BASE}/api/auth/admin`, {
    headers: { 'x-forwarded-for': ip },
    data: { pin: ADMIN_PIN },
  })
  expect(res.status()).toBe(200)
  await page.goto(`${BASE}${path}`)
}

// ════════════════════════════════════════════════════════════════
// 1. PUBLIC NAVIGATION
// ════════════════════════════════════════════════════════════════

test.describe('Navigation', () => {
  test('N-01: homepage redirects to /about', async ({ page }) => {
    await page.goto(BASE)
    await expect(page).toHaveURL(/\/about/)
  })

  test('N-02: about page loads with 200', async ({ page }) => {
    const res = await page.goto(`${BASE}/about`)
    expect(res?.status()).toBe(200)
  })

  test('N-03: gallery page loads with 200', async ({ page }) => {
    const res = await page.goto(`${BASE}/gallery`)
    expect(res?.status()).toBe(200)
  })

  test('N-04: contact page loads with 200', async ({ page }) => {
    const res = await page.goto(`${BASE}/contact`)
    expect(res?.status()).toBe(200)
  })

  test('N-05: header is visible on all pages', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    await expect(page.locator('header')).toBeVisible()
  })

  test('N-06: desktop tab nav is visible', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    await expect(page.locator('nav[aria-label="ניווט ראשי"]')).toBeVisible()
  })

  test('N-07: SYSTEM STATUS OPERATIONAL in header', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    await expect(page.locator('header')).toContainText('SYSTEM STATUS: OPERATIONAL')
  })

  test('N-08: live clock is displayed', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    await expect(page.locator('header')).toContainText('IL')
  })

  test('N-09: clicking gallery tab navigates to /gallery', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    await page.click('nav[aria-label="ניווט ראשי"] a[href="/gallery"]')
    await expect(page).toHaveURL(/\/gallery/)
  })

  test('N-10: clicking contact tab navigates to /contact', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    await page.click('nav[aria-label="ניווט ראשי"] a[href="/contact"]')
    await expect(page).toHaveURL(/\/contact/)
  })

  test('N-11: no overflow-x:auto or scroll on desktop nav', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const navEl = page.locator('nav[aria-label="ניווט ראשי"]')
    const overflow = await navEl.evaluate(el => getComputedStyle(el).overflowX)
    expect(['visible', 'hidden', 'clip', 'unset']).toContain(overflow)
  })

  test('N-12: footer is visible', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    await expect(page.locator('footer')).toBeVisible()
  })

  test('N-13: footer contains copyright text', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    await expect(page.locator('footer')).toContainText('674')
  })

  test('N-14: active tab has aria-current=page', async ({ page }) => {
    await page.goto(`${BASE}/gallery`)
    await page.waitForLoadState('networkidle')
    const activeLink = page.locator('nav[aria-label="ניווט ראשי"] a[aria-current="page"]')
    await expect(activeLink).toBeVisible()
  })
})

// ════════════════════════════════════════════════════════════════
// 2. ABOUT PAGE
// ════════════════════════════════════════════════════════════════

test.describe('About Page', () => {
  test('AB-01: about page h2 visible', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    // Use a more specific locator
    const headings = page.locator('h2')
    const texts = await headings.allTextContents()
    expect(texts.some(t => t.includes('אודות'))).toBe(true)
  })

  test('AB-02: four stat boxes visible', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const statBoxes = page.locator('.stat-box')
    await expect(statBoxes).toHaveCount(4)
  })

  test('AB-03: ימים באוויר stat shown as first box', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const labels = page.locator('.stat-label')
    const first = await labels.first().textContent()
    expect(first).toContain('ימים באוויר')
  })

  test('AB-04: מרחבי-ארצי stat visible', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const boxes = page.locator('.stat-box')
    const texts = await boxes.allTextContents()
    expect(texts.some(t => t.includes('מרחבי-ארצי'))).toBe(true)
  })

  test('AB-05: 98% positive reviews stat visible', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const boxes = page.locator('.stat-box')
    const texts = await boxes.allTextContents()
    expect(texts.some(t => t.includes('98%'))).toBe(true)
  })

  test('AB-06: 4+ staff stat visible', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const boxes = page.locator('.stat-box')
    const texts = await boxes.allTextContents()
    expect(texts.some(t => t.includes('4+'))).toBe(true)
  })

  test('AB-07: unit number 674 NOT shown as standalone stat label', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const statLabels = page.locator('.stat-label')
    const texts = await statLabels.allTextContents()
    const hasUnitLabel = texts.some(t => t.includes('מספר יחידה'))
    expect(hasUnitLabel).toBe(false)
  })

  test('AB-08: days counter is numeric + plus suffix', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const firstStat = page.locator('.stat-num').first()
    const text = await firstStat.textContent()
    expect(text).toMatch(/\d+\+/)
  })

  test('AB-09: days counter NOT in header', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const headerText = await page.locator('header').textContent()
    expect(headerText).not.toMatch(/ימים באוויר/)
  })

  test('AB-10: mission text is visible', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    await expect(page.locator('.mil-card').first()).toContainText('מעבדת רחפנים')
  })

  test('AB-11: תחומי עיסוק section visible', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    await expect(page.locator('text=תחומי עיסוק').first()).toBeVisible()
  })

  test('AB-12: feature list has items', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const items = page.locator('.feature-list li')
    const count = await items.count()
    expect(count).toBeGreaterThan(4)
  })

  test('AB-13: capabilities grid shows 6 items', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const caps = page.locator('.cap-item')
    await expect(caps).toHaveCount(6)
  })

  test('AB-14: RESTRICTED ACCESS tag visible', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const tags = page.locator('.classify-tag')
    const texts = await tags.allTextContents()
    expect(texts.some(t => t.includes('RESTRICTED ACCESS'))).toBe(true)
  })
})

// ════════════════════════════════════════════════════════════════
// 3. UNIT ACCESS GATE
// ════════════════════════════════════════════════════════════════

test.describe('Unit Access Gate', () => {
  test('AG-01: /appointments redirects to /appointments/access without token', async ({ page }) => {
    await page.goto(`${BASE}/appointments`)
    await expect(page).toHaveURL(/\/appointments\/access/)
  })

  test('AG-02: access gate page shows RESTRICTED ACCESS', async ({ page }) => {
    await page.goto(`${BASE}/appointments/access`)
    const tags = page.locator('.classify-tag')
    const texts = await tags.allTextContents()
    expect(texts.some(t => t.includes('RESTRICTED ACCESS'))).toBe(true)
  })

  test('AG-03: access gate shows password input field', async ({ page }) => {
    await page.goto(`${BASE}/appointments/access`)
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('AG-04: API rejects wrong unit code with 401', async ({ page }) => {
    const res = await page.request.post(`${BASE}/api/auth/unit`, {
      headers: { 'x-forwarded-for': '10.0.0.1' },
      data: { code: WRONG_CODE },
    })
    expect(res.status()).toBe(401)
  })

  test('AG-05: wrong code shows error message on screen', async ({ page }) => {
    await page.goto(`${BASE}/appointments/access`)
    await page.fill('input[type="password"]', WRONG_CODE)
    await page.click('button[type="submit"]')
    await expect(page.locator('text=שגוי').first()).toBeVisible({ timeout: 5000 })
  })

  test('AG-06: API accepts correct unit code with 200', async ({ page }) => {
    const res = await page.request.post(`${BASE}/api/auth/unit`, {
      headers: { 'x-forwarded-for': '10.0.0.2' },
      data: { code: UNIT_CODE },
    })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  test('AG-07: API returns 400 for missing code', async ({ page }) => {
    const res = await page.request.post(`${BASE}/api/auth/unit`, {
      headers: { 'x-forwarded-for': '10.0.0.3' },
      data: {},
    })
    expect(res.status()).toBe(400)
  })

  test('AG-08: after correct code, appointments page shows booking UI', async ({ page }) => {
    await visitWithUnitToken(page, '10.0.1.1')
    await expect(page.locator('h2').filter({ hasText: 'קביעת תור' })).toBeVisible()
  })

  test('AG-09: appointments page shows calendar', async ({ page }) => {
    await visitWithUnitToken(page, '10.0.1.2')
    await expect(page.locator('.cal-grid')).toBeVisible()
  })
})

// ════════════════════════════════════════════════════════════════
// 4. APPOINTMENTS PAGE
// ════════════════════════════════════════════════════════════════

test.describe('Appointments Page', () => {
  test('AP-01: appointments page shows calendar widget', async ({ page }) => {
    await visitWithUnitToken(page, '10.1.0.1')
    await expect(page.locator('.cal-grid')).toBeVisible()
  })

  test('AP-02: calendar shows weekday labels', async ({ page }) => {
    await visitWithUnitToken(page, '10.1.0.2')
    await expect(page.locator('.cal-day-label').first()).toBeVisible()
  })

  test('AP-03: calendar has next/prev navigation buttons', async ({ page }) => {
    await visitWithUnitToken(page, '10.1.0.3')
    await expect(page.locator('button').filter({ hasText: '◀' })).toBeVisible()
    await expect(page.locator('button').filter({ hasText: '▶' })).toBeVisible()
  })

  test('AP-04: SCHEDULING SYSTEM classify tag visible', async ({ page }) => {
    await visitWithUnitToken(page, '10.1.0.4')
    const tags = page.locator('.classify-tag')
    const texts = await tags.allTextContents()
    expect(texts.some(t => t.includes('SCHEDULING'))).toBe(true)
  })

  test('AP-05: instructions card is visible', async ({ page }) => {
    await visitWithUnitToken(page, '10.1.0.5')
    // Use filter — text= treats // as regex delimiter
    await expect(page.locator('h3, h4, p, div').filter({ hasText: 'הוראות' }).first()).toBeVisible()
  })

  test('AP-06: time slots appear when date selected', async ({ page }) => {
    await visitWithUnitToken(page, '10.1.0.6')
    const days = page.locator('.cal-day:not(.disabled):not(.empty)')
    const count = await days.count()
    if (count > 0) {
      await days.first().click()
      await expect(page.locator('.slots-grid')).toBeVisible({ timeout: 5000 })
    }
  })

  test('AP-07: /api/slots returns valid JSON with taken array', async ({ page }) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    while (tomorrow.getDay() === 6) tomorrow.setDate(tomorrow.getDate() + 1)
    const dateStr = tomorrow.toISOString().split('T')[0]
    const res = await page.request.get(`${BASE}/api/slots?date=${dateStr}`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('taken')
    expect(Array.isArray(body.taken)).toBe(true)
  })

  test('AP-08: /api/slots does NOT expose personal data', async ({ page }) => {
    const dateStr = new Date().toISOString().split('T')[0]
    const res = await page.request.get(`${BASE}/api/slots?date=${dateStr}`)
    const text = await res.text()
    expect(text).not.toMatch(/\"name\"/)
    expect(text).not.toMatch(/\"personal_id\"/)
    expect(text).not.toMatch(/\"phone\"/)
  })

  test('AP-09: POST /api/appointments rejects without unit token', async ({ page }) => {
    const res = await page.request.post(`${BASE}/api/appointments`, {
      data: { name: 'Test', personal_id: '1234567', unit: 'Test Unit', type: 'תיקון', phone: '0500000000', date: '2030-01-01', slot: '08:00' },
    })
    expect(res.status()).toBe(401)
  })

  test('AP-10: /api/slots is publicly accessible without any token', async ({ page }) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    while (tomorrow.getDay() === 6) tomorrow.setDate(tomorrow.getDate() + 1)
    const dateStr = tomorrow.toISOString().split('T')[0]
    const res = await page.request.get(`${BASE}/api/slots?date=${dateStr}`)
    expect(res.status()).toBe(200)
  })
})

// ════════════════════════════════════════════════════════════════
// 5. CONTACT PAGE
// ════════════════════════════════════════════════════════════════

test.describe('Contact Page', () => {
  test('CT-01: contact page heading visible', async ({ page }) => {
    await page.goto(`${BASE}/contact`)
    const headings = page.locator('h2')
    const texts = await headings.allTextContents()
    expect(texts.some(t => t.includes('צור קשר'))).toBe(true)
  })

  test('CT-02: 4 contact info cards visible', async ({ page }) => {
    await page.goto(`${BASE}/contact`)
    const items = page.locator('.contact-item')
    await expect(items).toHaveCount(4)
  })

  test('CT-03: location info visible', async ({ page }) => {
    await page.goto(`${BASE}/contact`)
    await expect(page.locator('text=מיקום').first()).toBeVisible()
  })

  test('CT-04: phone info visible', async ({ page }) => {
    await page.goto(`${BASE}/contact`)
    await expect(page.locator('text=קו ישיר מאובטח').first()).toBeVisible()
  })

  test('CT-05: working hours visible', async ({ page }) => {
    await page.goto(`${BASE}/contact`)
    await expect(page.locator('text=שעות פעילות').first()).toBeVisible()
  })

  test('CT-06: שלח פנייה form section visible', async ({ page }) => {
    await page.goto(`${BASE}/contact`)
    // Use hasText filter — text= selector treats // as regex delimiter
    await expect(page.locator('h3').filter({ hasText: 'שלח פנייה' }).first()).toBeVisible()
  })

  test('CT-07: form has name field', async ({ page }) => {
    await page.goto(`${BASE}/contact`)
    await expect(page.locator('input[placeholder="שם מלא"]')).toBeVisible()
  })

  test('CT-08: form has email field', async ({ page }) => {
    await page.goto(`${BASE}/contact`)
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  test('CT-09: form has textarea for content', async ({ page }) => {
    await page.goto(`${BASE}/contact`)
    await expect(page.locator('textarea')).toBeVisible()
  })

  test('CT-10: POST /api/inquiries succeeds with valid data', async ({ page }) => {
    const res = await page.request.post(`${BASE}/api/inquiries`, {
      data: {
        name: 'בדיקה אוטומטית',
        personal_id: '9999999',
        email: 'test@test.il',
        unit: 'בדיקה',
        type: 'שאלה טכנית',
        content: 'זוהי בדיקת E2E אוטומטית',
      },
    })
    expect(res.status()).toBe(201)
  })

  test('CT-11: invalid email rejected by API', async ({ page }) => {
    const res = await page.request.post(`${BASE}/api/inquiries`, {
      data: { name: 'Test', email: 'not-an-email', type: 'שאלה טכנית', content: 'test' },
    })
    expect(res.status()).toBe(400)
  })

  test('CT-12: missing required fields rejected', async ({ page }) => {
    const res = await page.request.post(`${BASE}/api/inquiries`, {
      data: { name: 'Test' },
    })
    expect(res.status()).toBe(400)
  })
})

// ════════════════════════════════════════════════════════════════
// 6. GALLERY PAGE
// ════════════════════════════════════════════════════════════════

test.describe('Gallery Page', () => {
  test('GL-01: gallery page loads with 200', async ({ page }) => {
    const res = await page.goto(`${BASE}/gallery`)
    expect(res?.status()).toBe(200)
  })

  test('GL-02: gallery heading visible', async ({ page }) => {
    await page.goto(`${BASE}/gallery`)
    // Use filter with hasText instead of checking allTextContents (avoids unicode/whitespace issues)
    await expect(page.locator('h2').filter({ hasText: 'גלריית המעבדה' }).first()).toBeVisible()
  })

  test('GL-03: gallery grid renders', async ({ page }) => {
    await page.goto(`${BASE}/gallery`)
    await expect(page.locator('.gallery-grid')).toBeVisible()
  })

  test('GL-04: gallery items exist', async ({ page }) => {
    await page.goto(`${BASE}/gallery`)
    const items = page.locator('.gallery-item')
    const count = await items.count()
    expect(count).toBeGreaterThan(0)
  })
})

// ════════════════════════════════════════════════════════════════
// 7. ADMIN PIN AUTH
// ════════════════════════════════════════════════════════════════

test.describe('Admin PIN Auth', () => {
  test('PA-01: /admin/dashboard redirects to /admin/login without token', async ({ page }) => {
    await page.goto(`${BASE}/admin/dashboard`)
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('PA-02: admin login page shows PIN text', async ({ page }) => {
    await page.goto(`${BASE}/admin/login`)
    const text = await page.locator('.mil-card').textContent()
    expect(text).toContain('PIN')
  })

  test('PA-03: admin PIN page has digit buttons', async ({ page }) => {
    await page.goto(`${BASE}/admin/login`)
    const buttons = page.locator('.mil-card button')
    const count = await buttons.count()
    expect(count).toBeGreaterThanOrEqual(10)
  })

  test('PA-04: API rejects wrong PIN with 401', async ({ page }) => {
    const res = await page.request.post(`${BASE}/api/auth/admin`, {
      headers: { 'x-forwarded-for': '10.2.0.1' },
      data: { pin: WRONG_PIN },
    })
    expect(res.status()).toBe(401)
  })

  test('PA-05: API rejects non-4-digit PIN with 400', async ({ page }) => {
    const res = await page.request.post(`${BASE}/api/auth/admin`, {
      headers: { 'x-forwarded-for': '10.2.0.2' },
      data: { pin: '12' },
    })
    expect(res.status()).toBe(400)
  })

  test('PA-06: API rejects letters as PIN with 400', async ({ page }) => {
    const res = await page.request.post(`${BASE}/api/auth/admin`, {
      headers: { 'x-forwarded-for': '10.2.0.3' },
      data: { pin: 'abcd' },
    })
    expect(res.status()).toBe(400)
  })

  test('PA-07: API accepts correct PIN with 200', async ({ page }) => {
    const res = await page.request.post(`${BASE}/api/auth/admin`, {
      headers: { 'x-forwarded-for': '10.2.0.4' },
      data: { pin: ADMIN_PIN },
    })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  test('PA-08: correct PIN + goto dashboard succeeds', async ({ page }) => {
    await visitWithAdminToken(page, '10.2.1.1')
    await expect(page).toHaveURL(/\/admin\/dashboard/)
  })

  test('PA-09: admin logout API clears cookie', async ({ page }) => {
    await visitWithAdminToken(page, '10.2.1.2')
    const res = await page.request.post(`${BASE}/api/auth/admin/logout`)
    expect(res.status()).toBe(200)
  })

  test('PA-10: admin page heading visible when logged in', async ({ page }) => {
    await visitWithAdminToken(page, '10.2.1.3')
    // Use filter — allTextContents on h2 can fail with RTL text; filter with hasText is more robust
    await expect(page.locator('h2').filter({ hasText: 'לוח מנהל' }).first()).toBeVisible()
  })

  test('PA-11: dashboard has logout button', async ({ page }) => {
    await visitWithAdminToken(page, '10.2.1.4')
    await expect(page.locator('text=התנתק').first()).toBeVisible()
  })
})

// ════════════════════════════════════════════════════════════════
// 8. ADMIN API SECURITY
// ════════════════════════════════════════════════════════════════

test.describe('Admin API Security', () => {
  test('SEC-01: GET /api/appointments requires admin token', async ({ page }) => {
    const res = await page.request.get(`${BASE}/api/appointments`)
    expect(res.status()).toBe(401)
  })

  test('SEC-02: DELETE /api/appointments requires admin token', async ({ page }) => {
    const res = await page.request.delete(`${BASE}/api/appointments`)
    expect(res.status()).toBe(401)
  })

  test('SEC-03: GET /api/inquiries requires admin token', async ({ page }) => {
    const res = await page.request.get(`${BASE}/api/inquiries`)
    expect(res.status()).toBe(401)
  })

  test('SEC-04: GET /api/appointments/export requires admin token', async ({ page }) => {
    const res = await page.request.get(`${BASE}/api/appointments/export`)
    expect(res.status()).toBe(401)
  })

  test('SEC-05: PATCH /api/appointments/[id] requires admin token', async ({ page }) => {
    const res = await page.request.patch(`${BASE}/api/appointments/00000000-0000-0000-0000-000000000000`, {
      data: { status: 'מאושר' },
    })
    expect(res.status()).toBe(401)
  })

  test('SEC-06: DELETE /api/appointments/[id] requires admin token', async ({ page }) => {
    const res = await page.request.delete(`${BASE}/api/appointments/00000000-0000-0000-0000-000000000000`)
    expect(res.status()).toBe(401)
  })

  test('SEC-07: PATCH /api/inquiries/[id] requires admin token', async ({ page }) => {
    const res = await page.request.patch(`${BASE}/api/inquiries/00000000-0000-0000-0000-000000000000`, {
      data: { status: 'טופל' },
    })
    expect(res.status()).toBe(401)
  })

  test('SEC-08: DELETE /api/inquiries/[id] requires admin token', async ({ page }) => {
    const res = await page.request.delete(`${BASE}/api/inquiries/00000000-0000-0000-0000-000000000000`)
    expect(res.status()).toBe(401)
  })

  test('SEC-09: /api/slots is publicly accessible', async ({ page }) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    while (tomorrow.getDay() === 6) tomorrow.setDate(tomorrow.getDate() + 1)
    const dateStr = tomorrow.toISOString().split('T')[0]
    const res = await page.request.get(`${BASE}/api/slots?date=${dateStr}`)
    expect(res.status()).toBe(200)
  })

  test('SEC-10: /admin/dashboard requires admin token (proxy redirect)', async ({ page }) => {
    await page.goto(`${BASE}/admin/dashboard`)
    expect(page.url()).toContain('/admin/login')
  })

  test('SEC-11: X-Frame-Options: DENY header present', async ({ page }) => {
    const res = await page.goto(`${BASE}/about`)
    const headers = res?.headers() ?? {}
    expect(headers['x-frame-options']).toBe('DENY')
  })

  test('SEC-12: X-Content-Type-Options: nosniff header present', async ({ page }) => {
    const res = await page.goto(`${BASE}/about`)
    const headers = res?.headers() ?? {}
    expect(headers['x-content-type-options']).toBe('nosniff')
  })

  test('SEC-13: GET /api/appointments works with valid admin token', async ({ page }) => {
    await page.request.post(`${BASE}/api/auth/admin`, {
      headers: { 'x-forwarded-for': '10.3.0.1' },
      data: { pin: ADMIN_PIN },
    })
    const res = await page.request.get(`${BASE}/api/appointments`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('appointments')
  })

  test('SEC-14: GET /api/inquiries works with valid admin token', async ({ page }) => {
    await page.request.post(`${BASE}/api/auth/admin`, {
      headers: { 'x-forwarded-for': '10.3.0.2' },
      data: { pin: ADMIN_PIN },
    })
    const res = await page.request.get(`${BASE}/api/inquiries`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('inquiries')
  })
})

// ════════════════════════════════════════════════════════════════
// 9. MOBILE RESPONSIVENESS (iPhone 14)
// ════════════════════════════════════════════════════════════════

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('MOB-01: about page renders on mobile', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const headings = page.locator('h2')
    const count = await headings.count()
    expect(count).toBeGreaterThan(0)
  })

  test('MOB-02: bottom nav visible on mobile', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const bottomNav = page.locator('nav.bottom-nav')
    await expect(bottomNav).toBeVisible()
  })

  test('MOB-03: header renders within viewport width', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const header = page.locator('header')
    const box = await header.boundingBox()
    expect(box?.width).toBeLessThanOrEqual(395)
  })

  test('MOB-04: contact page renders on mobile', async ({ page }) => {
    await page.goto(`${BASE}/contact`)
    const items = page.locator('.contact-item')
    const count = await items.count()
    expect(count).toBeGreaterThan(0)
  })

  test('MOB-05: form fields are usable on mobile (>200px wide)', async ({ page }) => {
    await page.goto(`${BASE}/contact`)
    const input = page.locator('input[placeholder="שם מלא"]')
    const box = await input.boundingBox()
    expect(box?.width).toBeGreaterThan(200)
  })

  test('MOB-06: gallery renders on mobile', async ({ page }) => {
    await page.goto(`${BASE}/gallery`)
    await expect(page.locator('.gallery-grid')).toBeVisible()
  })

  test('MOB-07: bottom nav touch targets ≥44px tall', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const navLinks = page.locator('nav.bottom-nav a')
    const first = navLinks.first()
    const box = await first.boundingBox()
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44)
  })

  test('MOB-08: access gate input ≥44px tall', async ({ page }) => {
    await page.goto(`${BASE}/appointments/access`)
    const input = page.locator('input[type="password"]')
    const box = await input.boundingBox()
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44)
  })

  test('MOB-09: admin PIN buttons ≥44px tall', async ({ page }) => {
    await page.goto(`${BASE}/admin/login`)
    const buttons = page.locator('.mil-card button')
    const first = buttons.first()
    const box = await first.boundingBox()
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44)
  })

  test('MOB-10: page does not overflow horizontally', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = page.viewportSize()?.width ?? 390
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5)
  })
})

// ════════════════════════════════════════════════════════════════
// 10. TABLET RESPONSIVENESS
// ════════════════════════════════════════════════════════════════

test.describe('Tablet Responsiveness', () => {
  test.use({ viewport: { width: 768, height: 1024 } })

  test('TAB-01: about page renders on tablet', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const boxes = page.locator('.stat-box')
    await expect(boxes.first()).toBeVisible()
  })

  test('TAB-02: stats grid shows 4 boxes on tablet', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const boxes = page.locator('.stat-box')
    await expect(boxes).toHaveCount(4)
  })

  test('TAB-03: desktop nav visible on tablet', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    await expect(page.locator('nav[aria-label="ניווט ראשי"]')).toBeVisible()
  })

  test('TAB-04: contact page usable on tablet', async ({ page }) => {
    await page.goto(`${BASE}/contact`)
    await expect(page.locator('.contact-item').first()).toBeVisible()
  })
})

// ════════════════════════════════════════════════════════════════
// 11. DATA INTEGRITY & WORKFLOW
// ════════════════════════════════════════════════════════════════

test.describe('Data Integrity', () => {
  test('WF-01: /api/slots handles missing date gracefully (no 500)', async ({ page }) => {
    const res = await page.request.get(`${BASE}/api/slots`)
    expect(res.status()).not.toBe(500)
  })

  test('WF-02: POST appointments rejects past date', async ({ page }) => {
    await page.request.post(`${BASE}/api/auth/unit`, {
      headers: { 'x-forwarded-for': '10.4.0.1' },
      data: { code: UNIT_CODE },
    })
    const res = await page.request.post(`${BASE}/api/appointments`, {
      data: { name: 'Test', personal_id: '1234567', unit: 'Test', type: 'תיקון', phone: '0500000000', date: '2020-01-01', slot: '08:00' },
    })
    expect(res.status()).toBe(400)
  })

  test('WF-03: POST appointments rejects invalid slot', async ({ page }) => {
    await page.request.post(`${BASE}/api/auth/unit`, {
      headers: { 'x-forwarded-for': '10.4.0.2' },
      data: { code: UNIT_CODE },
    })
    const res = await page.request.post(`${BASE}/api/appointments`, {
      data: { name: 'Test', personal_id: '1234567', unit: 'Test', type: 'תיקון', phone: '0500000000', date: '2030-06-01', slot: '99:99' },
    })
    expect(res.status()).toBe(400)
  })

  test('WF-04: POST appointments rejects Saturday', async ({ page }) => {
    await page.request.post(`${BASE}/api/auth/unit`, {
      headers: { 'x-forwarded-for': '10.4.0.3' },
      data: { code: UNIT_CODE },
    })
    const d = new Date('2030-01-05') // Saturday
    const dateStr = d.toISOString().split('T')[0]
    const res = await page.request.post(`${BASE}/api/appointments`, {
      data: { name: 'Test', personal_id: '1234567', unit: 'Test', type: 'תיקון', phone: '0500000000', date: dateStr, slot: '08:00' },
    })
    expect(res.status()).toBe(400)
  })

  test('WF-05: PATCH appointment with invalid status → 400', async ({ page }) => {
    await page.request.post(`${BASE}/api/auth/admin`, {
      headers: { 'x-forwarded-for': '10.4.1.1' },
      data: { pin: ADMIN_PIN },
    })
    const res = await page.request.patch(`${BASE}/api/appointments/00000000-0000-0000-0000-000000000000`, {
      data: { status: 'invalid-status' },
    })
    expect(res.status()).toBe(400)
  })

  test('WF-06: PATCH inquiry with invalid status → 400', async ({ page }) => {
    await page.request.post(`${BASE}/api/auth/admin`, {
      headers: { 'x-forwarded-for': '10.4.1.2' },
      data: { pin: ADMIN_PIN },
    })
    const res = await page.request.patch(`${BASE}/api/inquiries/00000000-0000-0000-0000-000000000000`, {
      data: { status: 'invalid-status' },
    })
    expect(res.status()).toBe(400)
  })

  test('WF-07: POST appointments rejects missing fields', async ({ page }) => {
    await page.request.post(`${BASE}/api/auth/unit`, {
      headers: { 'x-forwarded-for': '10.4.0.4' },
      data: { code: UNIT_CODE },
    })
    const res = await page.request.post(`${BASE}/api/appointments`, {
      data: { name: 'Test only' },
    })
    expect(res.status()).toBe(400)
  })

  test('WF-08: POST appointments requires valid date format', async ({ page }) => {
    await page.request.post(`${BASE}/api/auth/unit`, {
      headers: { 'x-forwarded-for': '10.4.0.5' },
      data: { code: UNIT_CODE },
    })
    const res = await page.request.post(`${BASE}/api/appointments`, {
      data: { name: 'Test', personal_id: '1234567', unit: 'Test', type: 'תיקון', phone: '0500000000', date: 'not-a-date', slot: '08:00' },
    })
    expect(res.status()).toBe(400)
  })

  test('WF-09: POST /api/auth/unit rejects non-string code', async ({ page }) => {
    const res = await page.request.post(`${BASE}/api/auth/unit`, {
      headers: { 'x-forwarded-for': '10.4.0.6' },
      data: { code: 123 },
    })
    expect([400, 401]).toContain(res.status())
  })

  test('WF-10: POST /api/auth/admin missing PIN → 400', async ({ page }) => {
    const res = await page.request.post(`${BASE}/api/auth/admin`, {
      headers: { 'x-forwarded-for': '10.4.1.3' },
      data: {},
    })
    expect(res.status()).toBe(400)
  })
})

// ════════════════════════════════════════════════════════════════
// 12. PWA & META
// ════════════════════════════════════════════════════════════════

test.describe('PWA & Meta', () => {
  test('PWA-01: manifest.json is accessible', async ({ page }) => {
    const res = await page.request.get(`${BASE}/manifest.json`)
    expect(res.status()).toBe(200)
  })

  test('PWA-02: manifest has lang=he', async ({ page }) => {
    const res = await page.request.get(`${BASE}/manifest.json`)
    const body = await res.json()
    expect(body.lang).toBe('he')
  })

  test('PWA-03: manifest has icons array', async ({ page }) => {
    const res = await page.request.get(`${BASE}/manifest.json`)
    const body = await res.json()
    expect(Array.isArray(body.icons)).toBe(true)
    expect(body.icons.length).toBeGreaterThan(0)
  })

  test('PWA-04: apple-touch-icon meta tag present', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const link = page.locator('link[rel="apple-touch-icon"]')
    await expect(link).toHaveCount(1)
  })

  test('PWA-05: viewport meta tag present', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const viewport = page.locator('meta[name="viewport"]')
    await expect(viewport).toHaveCount(1)
  })

  test('PWA-06: PWA name contains 674', async ({ page }) => {
    const res = await page.request.get(`${BASE}/manifest.json`)
    const body = await res.json()
    expect(body.name).toContain('674')
  })

  test('PWA-07: icon-192.png is accessible', async ({ page }) => {
    const res = await page.request.get(`${BASE}/icons/icon-192.png`)
    expect(res.status()).toBe(200)
  })

  test('PWA-08: icon-512.png is accessible', async ({ page }) => {
    const res = await page.request.get(`${BASE}/icons/icon-512.png`)
    expect(res.status()).toBe(200)
  })

  test('PWA-09: page title contains 674', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    expect(await page.title()).toContain('674')
  })

  test('PWA-10: html dir=rtl', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const dir = await page.locator('html').getAttribute('dir')
    expect(dir).toBe('rtl')
  })

  test('PWA-11: html lang=he', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('he')
  })
})

// ════════════════════════════════════════════════════════════════
// 13. ADMIN DASHBOARD
// ════════════════════════════════════════════════════════════════

test.describe('Admin Dashboard', () => {
  test('DASH-01: dashboard shows section heading', async ({ page }) => {
    await visitWithAdminToken(page, '10.5.0.1')
    await expect(page.locator('text=לוח מנהל').first()).toBeVisible()
  })

  test('DASH-02: dashboard has export CSV button', async ({ page }) => {
    await visitWithAdminToken(page, '10.5.0.2')
    await expect(page.locator('text=ייצא CSV').first()).toBeVisible()
  })

  test('DASH-03: dashboard has logout button', async ({ page }) => {
    await visitWithAdminToken(page, '10.5.0.3')
    await expect(page.locator('text=התנתק').first()).toBeVisible()
  })

  test('DASH-04: dashboard has clear all button', async ({ page }) => {
    await visitWithAdminToken(page, '10.5.0.4')
    await expect(page.locator('text=נקה הכל').first()).toBeVisible()
  })

  test('DASH-05: appointments data returns correctly for admin', async ({ page }) => {
    await page.request.post(`${BASE}/api/auth/admin`, {
      headers: { 'x-forwarded-for': '10.5.1.1' },
      data: { pin: ADMIN_PIN },
    })
    const res = await page.request.get(`${BASE}/api/appointments`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body.appointments)).toBe(true)
  })

  test('DASH-06: inquiries data returns correctly for admin', async ({ page }) => {
    await page.request.post(`${BASE}/api/auth/admin`, {
      headers: { 'x-forwarded-for': '10.5.1.2' },
      data: { pin: ADMIN_PIN },
    })
    const res = await page.request.get(`${BASE}/api/inquiries`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body.inquiries)).toBe(true)
  })
})

// ════════════════════════════════════════════════════════════════
// 14. ACCESSIBILITY
// ════════════════════════════════════════════════════════════════

test.describe('Accessibility', () => {
  test('A11Y-01: main nav has aria-label', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const navs = page.locator('nav[aria-label]')
    const count = await navs.count()
    expect(count).toBeGreaterThan(0)
  })

  test('A11Y-02: active tab has aria-current=page', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    await page.waitForLoadState('networkidle')
    const activeLink = page.locator('nav[aria-label="ניווט ראשי"] a[aria-current="page"]')
    await expect(activeLink).toHaveCount(1)
  })

  test('A11Y-03: form labels present on contact page', async ({ page }) => {
    await page.goto(`${BASE}/contact`)
    const labels = page.locator('label')
    const count = await labels.count()
    expect(count).toBeGreaterThan(3)
  })

  test('A11Y-04: mil-btn min-height ≥44px', async ({ page }) => {
    await page.goto(`${BASE}/contact`)
    const btn = page.locator('.mil-btn').first()
    if (await btn.isVisible()) {
      const box = await btn.boundingBox()
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44)
    }
  })

  test('A11Y-05: inputs min-height ≥44px', async ({ page }) => {
    await page.goto(`${BASE}/appointments/access`)
    const input = page.locator('.mil-input').first()
    const box = await input.boundingBox()
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44)
  })

  test('A11Y-06: exactly one h1 on the page', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)
  })

  test('A11Y-07: page background is dark (not white)', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    // Should not be white/light
    expect(bg).not.toBe('rgb(255, 255, 255)')
  })
})
