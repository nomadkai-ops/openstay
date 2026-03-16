# UI Redesign (Glassmorphism) Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current light stone/white theme with a full Glassmorphism design — gradient background everywhere, glass cards, white text, mobile-responsive admin (bottom tab-bar), and a fullscreen visitor calendar with a selection-bar flow.

**Architecture:** All pages share a single `min-h-screen` gradient background applied in `app/layout.tsx`. Glass card styles are applied as `className` overrides at usage sites (not in shadcn component source). The react-day-picker default stylesheet is removed and replaced with a complete custom CSS block in `app/globals.css`. The admin area gains a new `AdminMobileNav` component rendered directly in `app/admin/layout.tsx` for mobile; the existing `AdminSidebar` is desktop-only.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS v4, shadcn/ui (base-nova), react-day-picker v9, TypeScript

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `app/globals.css` | Modify | Remove rdp default import reference; add full `.rdp-*` custom CSS block for glass theme |
| `app/layout.tsx` | Modify | Apply gradient `min-h-screen` background wrapper |
| `app/(auth)/login/page.tsx` | Modify | Centered glass panel layout |
| `app/(auth)/registrieren/page.tsx` | Modify | Centered glass panel layout |
| `app/pending/page.tsx` | Modify | Centered glass panel layout |
| `app/kalender/page.tsx` | Modify | Fullscreen layout with glass top-nav bar |
| `app/kalender/anfragen/page.tsx` | Modify | Glass panel list wrapper |
| `app/admin/layout.tsx` | Modify | Add `AdminMobileNav`, responsive padding (`pt-12 pb-16` mobile, `p-8` desktop) |
| `app/admin/page.tsx` | Modify | Page heading styled for glass |
| `app/admin/anfragen/page.tsx` | Modify | Glass panel wrapper |
| `app/admin/kalender/page.tsx` | Modify | Glass panel wrapper |
| `app/admin/nutzer/page.tsx` | Modify | Glass panel wrapper |
| `components/admin/AdminSidebar.tsx` | Modify | Glass styling, `hidden md:flex` on mobile |
| `components/admin/AdminMobileNav.tsx` | **Create** | Fixed glass header (top) + bottom tab-bar for mobile |
| `components/admin/DashboardKarten.tsx` | Modify | Glass cards + glass mini-calendar |
| `components/admin/AnfragenTabelle.tsx` | Modify | Glass table + glass confirm dialog |
| `components/admin/NutzerTabelle.tsx` | Modify | Glass table |
| `components/admin/KalenderBlockForm.tsx` | Modify | Glass form panel |
| `components/kalender/KalenderAnsicht.tsx` | Modify | Remove rdp import, add glass CSS via globals, decouple modal-open from `handleSelect`, add selection-bar |
| `components/kalender/AnfrageModal.tsx` | Modify | Glass Dialog/Sheet, dark-adapted overlap warning + success state |
| `components/kalender/AnfragenListe.tsx` | Modify | Glass list |
| `components/auth/LoginForm.tsx` | Modify | Glass form inputs + labels |
| `components/auth/RegistrierungForm.tsx` | Modify | Glass form inputs + labels |

---

## Chunk 1: Design System Foundation

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

### Task 1: Replace react-day-picker CSS with custom glass styles in globals.css

The current `KalenderAnsicht.tsx` uses `import 'react-day-picker/dist/style.css'` and inline `<style>` tags. We remove the stylesheet import and put all rdp-* CSS in globals.css so it's available globally.

- [ ] **Step 1: Remove the rdp stylesheet import from KalenderAnsicht.tsx**

In `components/kalender/KalenderAnsicht.tsx`, delete the line:
```tsx
import 'react-day-picker/dist/style.css'
```

Also delete the entire `<style>` block — it starts with:
```
      <style>{`
        .rdp-day-blocked { background-color: #e7e5e4 !important;
```
and ends with:
```
        .rdp-custom button { touch-action: manipulation; }
      `}</style>
```
Delete everything from `<style>` through the closing `</style>`.

- [ ] **Step 2: Add complete custom rdp-* CSS to globals.css**

Append at the end of `app/globals.css`:

```css
/* ============================================================
   react-day-picker — full custom glass theme
   (replaces react-day-picker/dist/style.css entirely)
   ============================================================ */
.rdp-root {
  --rdp-accent-color: rgba(255, 255, 255, 0.35);
  --rdp-accent-background-color: rgba(255, 255, 255, 0.35);
  margin: 0;
}

/* Nav buttons */
.rdp-button_previous,
.rdp-button_next {
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}
.rdp-button_previous:hover,
.rdp-button_next:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Month caption */
.rdp-month_caption {
  font-weight: 700;
  font-size: 1rem;
  color: white;
  padding-bottom: 8px;
}
.rdp-caption_label {
  font-weight: 700;
  color: white;
}

/* Weekday headers */
.rdp-weekday {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 0;
}

/* Day cells base */
.rdp-day {
  border-radius: 6px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  transition: background 0.1s;
  width: 40px;
  height: 40px;
}
.rdp-day_button {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.06);
  border: none;
  color: inherit;
  font-size: inherit;
}
.rdp-day_button:hover {
  background: rgba(255, 255, 255, 0.18);
}

/* Today */
.rdp-today .rdp-day_button {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.6);
  font-weight: 700;
}

/* Selected range */
.rdp-selected .rdp-day_button,
.rdp-range_start .rdp-day_button,
.rdp-range_end .rdp-day_button {
  background: rgba(255, 255, 255, 0.32);
  font-weight: 700;
  color: white;
}
.rdp-range_middle .rdp-day_button {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 0;
  color: white;
}
.rdp-range_start .rdp-day_button {
  border-radius: 6px 0 0 6px;
}
.rdp-range_end .rdp-day_button {
  border-radius: 0 6px 6px 0;
}
.rdp-range_start.rdp-range_end .rdp-day_button {
  border-radius: 6px;
}

/* Outside days */
.rdp-outside .rdp-day_button {
  color: rgba(255, 255, 255, 0.25);
}

/* Disabled / past days */
.rdp-disabled .rdp-day_button,
.rdp-day-past .rdp-day_button {
  opacity: 0.3;
  pointer-events: none;
  cursor: not-allowed;
}

/* Custom status modifiers */
.rdp-day-blocked .rdp-day_button {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.7);
}
.rdp-day-other-approved .rdp-day_button {
  background: rgba(99, 102, 241, 0.55);
  color: white;
}
.rdp-day-my-pending .rdp-day_button {
  background: rgba(251, 191, 36, 0.55);
  color: white;
}
.rdp-day-my-approved .rdp-day_button {
  background: rgba(134, 239, 172, 0.45);
  color: white;
}
.rdp-day-my-rejected .rdp-day_button {
  background: rgba(248, 113, 113, 0.45);
  color: white;
}
```

- [ ] **Step 3: Verify app still compiles**

```bash
npm run build 2>&1 | tail -20
```
Expected: no errors related to rdp styles or missing CSS.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css components/kalender/KalenderAnsicht.tsx
git commit -m "style: replace rdp default CSS with custom glass theme in globals.css"
```

---

### Task 2: Apply gradient background in app/layout.tsx

- [ ] **Step 1: Read current app/layout.tsx**

```bash
# View current file
cat app/layout.tsx
```

- [ ] **Step 2: Wrap body in gradient div**

In `app/layout.tsx`, change the `<body>` content to:

```tsx
<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
  <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-700 to-blue-600">
    {children}
  </div>
</body>
```

If `geistSans`/`geistMono` variable names differ, keep what's already there — only change the wrapper div.

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "style: apply full-app glassmorphism gradient background"
```

---

## Chunk 2: Auth Pages

**Files:**
- Modify: `app/(auth)/login/page.tsx`
- Modify: `components/auth/LoginForm.tsx`
- Modify: `app/(auth)/registrieren/page.tsx`
- Modify: `components/auth/RegistrierungForm.tsx`
- Modify: `app/pending/page.tsx`

### Task 3: Glass login page

- [ ] **Step 1: Replace login page layout**

Replace `app/(auth)/login/page.tsx` with:

```tsx
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">OpenStay</h1>
          <p className="text-white/60 mt-1 text-sm">Melde dich an</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update LoginForm for glass inputs**

Replace `components/auth/LoginForm.tsx` with:

```tsx
'use client'

import { useState } from 'react'
import { login } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white/80 text-sm">E-Mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="deine@email.de"
          required
          autoComplete="email"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-white/40 focus-visible:border-white/40"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white/80 text-sm">Passwort</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-white/40 focus-visible:border-white/40"
        />
      </div>
      {error && (
        <p className="text-sm text-red-300">{error}</p>
      )}
      <Button
        type="submit"
        className="w-full bg-white text-indigo-700 font-semibold hover:bg-white/90"
        disabled={loading}
      >
        {loading ? 'Anmelden…' : 'Anmelden'}
      </Button>
      <p className="text-center text-sm text-white/60">
        Noch kein Account?{' '}
        <Link href="/registrieren" className="text-white hover:underline font-medium">
          Registrieren
        </Link>
      </p>
    </form>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add app/\(auth\)/login/page.tsx components/auth/LoginForm.tsx
git commit -m "style: glass login page and form"
```

---

### Task 4: Glass registration page

- [ ] **Step 1: Read current RegistrierungForm**

```bash
cat components/auth/RegistrierungForm.tsx
```

- [ ] **Step 2: Replace registration page layout**

Replace `app/(auth)/registrieren/page.tsx` with:

```tsx
import { RegistrierungForm } from '@/components/auth/RegistrierungForm'

export default function RegistrierungPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">OpenStay</h1>
          <p className="text-white/60 mt-1 text-sm">Neuen Account erstellen</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <RegistrierungForm />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Replace RegistrierungForm.tsx**

Replace `components/auth/RegistrierungForm.tsx` with:

```tsx
'use client'

import { useState } from 'react'
import { register } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export function RegistrierungForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await register(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-2">
        <p className="text-white font-medium">Registrierung erfolgreich!</p>
        <p className="text-sm text-white/60">
          Bitte bestätige deine E-Mail-Adresse. Danach wird dein Account vom Admin freigeschaltet.
        </p>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white/80 text-sm">Name</Label>
        <Input id="name" name="name" placeholder="Dein Name" required autoComplete="name"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-white/40 focus-visible:border-white/40" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white/80 text-sm">E-Mail</Label>
        <Input id="email" name="email" type="email" placeholder="deine@email.de" required autoComplete="email"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-white/40 focus-visible:border-white/40" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white/80 text-sm">Passwort</Label>
        <Input id="password" name="password" type="password" required autoComplete="new-password" minLength={8}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-white/40 focus-visible:border-white/40" />
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <Button type="submit" className="w-full bg-white text-indigo-700 font-semibold hover:bg-white/90" disabled={loading}>
        {loading ? 'Registrieren…' : 'Account erstellen'}
      </Button>
      <p className="text-center text-sm text-white/60">
        Bereits registriert?{' '}
        <Link href="/login" className="text-white font-medium hover:underline">
          Anmelden
        </Link>
      </p>
    </form>
  )
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 5: Commit**

```bash
git add app/\(auth\)/registrieren/page.tsx components/auth/RegistrierungForm.tsx
git commit -m "style: glass registration page and form"
```

---

### Task 5: Glass pending page

- [ ] **Step 1: Replace pending page**

Replace `app/pending/page.tsx` with:

```tsx
import { logout } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'

export default function PendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 shadow-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">OpenStay</h1>
            <p className="text-white/60 text-sm mt-1">Freischaltung ausstehend</p>
          </div>
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto">
              <span className="text-2xl">⏳</span>
            </div>
            <p className="text-white font-medium">Dein Account wird geprüft</p>
            <p className="text-white/60 text-sm leading-relaxed">
              Deine Registrierung ist eingegangen. Du erhältst eine E-Mail, sobald dein Account freigeschaltet wurde.
            </p>
          </div>
          <form action={logout}>
            <Button
              type="submit"
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              Abmelden
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 3: Commit**

```bash
git add app/pending/page.tsx
git commit -m "style: glass pending page"
```

---

## Chunk 3: Visitor Calendar

**Files:**
- Modify: `components/kalender/KalenderAnsicht.tsx`
- Modify: `components/kalender/AnfrageModal.tsx`
- Modify: `components/kalender/AnfragenListe.tsx`
- Modify: `app/kalender/page.tsx`
- Modify: `app/kalender/anfragen/page.tsx`

### Task 6: KalenderAnsicht — glass calendar + selection bar flow

The main behavioral change: `handleSelect` no longer calls `setModalOpen(true)` directly. Instead it sets state, and a "selection bar" appears. The user clicks a button in that bar to open the modal. This decouples selection from modal-open.

- [ ] **Step 1: Write test for new selection flow**

In `lib/utils/datum.test.ts` (or create `components/kalender/__tests__/KalenderAnsicht.test.tsx`):

Actually the existing tests are pure utility tests. For this behavioral change, verify via manual test: after this task, selecting a date range on the calendar should NOT immediately open the modal — instead a bar should appear.

Skip automated test here; verify manually after implementing.

- [ ] **Step 2: Replace KalenderAnsicht.tsx**

Replace `components/kalender/KalenderAnsicht.tsx` with:

```tsx
'use client'

import { useState } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import { de } from 'date-fns/locale'
import { isBefore } from 'date-fns'
import type { CalendarEntry, VisitRequest } from '@/types'
import { AnfrageModal } from './AnfrageModal'
import { toDateStr, formatDateRange } from '@/lib/utils/datum'

interface Props {
  entries: CalendarEntry[]
  requests: VisitRequest[]
  currentUserId: string
  isAdmin: boolean
  prefillName: string
  prefillEmail: string
}

function getDayStatus(date: Date, entries: CalendarEntry[], requests: VisitRequest[], userId: string) {
  const dateStr = toDateStr(date)

  const myRequest = requests.find(r =>
    r.user_id === userId &&
    dateStr >= r.start_date &&
    dateStr <= r.end_date
  )
  if (myRequest) return myRequest.status

  const hasApprovedOther = requests.some(r =>
    r.user_id !== userId &&
    r.status === 'approved' &&
    dateStr >= r.start_date &&
    dateStr <= r.end_date
  )
  if (hasApprovedOther) return 'other-approved'

  const entry = entries.find(e => dateStr >= e.start_date && dateStr <= e.end_date)
  if (entry) {
    return entry.type === 'guest' ? 'other-approved' : 'blocked'
  }

  return 'free'
}

export function KalenderAnsicht({ entries, requests, currentUserId, isAdmin, prefillName, prefillEmail }: Props) {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>()
  const [modalOpen, setModalOpen] = useState(false)

  function handleSelect(range: DateRange | undefined) {
    setSelectedRange(range)
    // Do NOT open modal here — user clicks the selection bar button instead
  }

  const hasValidRange = !!(
    selectedRange?.from &&
    selectedRange?.to &&
    toDateStr(selectedRange.from) !== toDateStr(selectedRange.to)
  )

  const modifiers = {
    blocked: (day: Date) => getDayStatus(day, entries, requests, currentUserId) === 'blocked',
    otherApproved: (day: Date) => getDayStatus(day, entries, requests, currentUserId) === 'other-approved',
    myPending: (day: Date) => getDayStatus(day, entries, requests, currentUserId) === 'pending',
    myApproved: (day: Date) => getDayStatus(day, entries, requests, currentUserId) === 'approved',
    myRejected: (day: Date) => getDayStatus(day, entries, requests, currentUserId) === 'rejected',
    pastDay: (day: Date) => isBefore(day, new Date(new Date().setHours(0, 0, 0, 0))),
  }

  const modifiersClassNames = {
    blocked: 'rdp-day-blocked',
    otherApproved: 'rdp-day-other-approved',
    myPending: 'rdp-day-my-pending',
    myApproved: 'rdp-day-my-approved',
    myRejected: 'rdp-day-my-rejected',
    pastDay: 'rdp-day-past',
  }

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/70">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-white/25 inline-block" /> Blockiert
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-indigo-400/70 inline-block" /> Belegt
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400/70 inline-block" /> Meine Anfrage (ausstehend)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-400/60 inline-block" /> Meine Anfrage (bestätigt)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400/60 inline-block" /> Meine Anfrage (abgelehnt)
        </span>
      </div>

      {/* Calendar */}
      <div className="flex justify-center">
        <DayPicker
          mode="range"
          selected={selectedRange}
          onSelect={handleSelect}
          locale={de}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          showOutsideDays
          disabled={[{ before: new Date() }]}
        />
      </div>

      {/* Selection bar — shown when a valid range is selected */}
      {hasValidRange && selectedRange?.from && selectedRange?.to && (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-white/60 text-xs uppercase tracking-wide font-semibold mb-0.5">Ausgewählter Zeitraum</p>
            <p className="text-white font-semibold">
              {formatDateRange(toDateStr(selectedRange.from), toDateStr(selectedRange.to))}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setSelectedRange(undefined)}
              className="text-white/50 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-white text-indigo-700 font-semibold text-sm px-4 py-1.5 rounded-lg hover:bg-white/90 transition-colors"
            >
              Anfrage stellen →
            </button>
          </div>
        </div>
      )}

      {hasValidRange && selectedRange?.from && selectedRange?.to && (
        <AnfrageModal
          open={modalOpen}
          onOpenChange={(open) => {
            setModalOpen(open)
            if (!open) setSelectedRange(undefined)
          }}
          startDate={toDateStr(selectedRange.from)}
          endDate={toDateStr(selectedRange.to)}
          entries={entries}
          requests={requests}
          prefillName={prefillName}
          prefillEmail={prefillEmail}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add components/kalender/KalenderAnsicht.tsx
git commit -m "style: glass calendar, selection bar flow, remove rdp default stylesheet"
```

---

### Task 7: Glass AnfrageModal — dark-adapted form

- [ ] **Step 1: Replace AnfrageModal.tsx**

Replace `components/kalender/AnfrageModal.tsx` with:

```tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createAnfrage } from '@/lib/actions/anfragen'
import { dateRangesOverlap, formatDateRange } from '@/lib/utils/datum'
import type { CalendarEntry, VisitRequest } from '@/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  startDate: string
  endDate: string
  entries: CalendarEntry[]
  requests: VisitRequest[]
  prefillName?: string
  prefillEmail?: string
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

// Reusable glass input className
const glassInput = 'bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-white/40 focus-visible:border-white/40'
const glassLabel = 'text-white/80 text-sm'

function AnfrageFormContent({
  startDate,
  endDate,
  entries,
  requests,
  onSuccess,
  prefillName = '',
  prefillEmail = '',
}: {
  startDate: string
  endDate: string
  entries: CalendarEntry[]
  requests: VisitRequest[]
  onSuccess: () => void
  prefillName?: string
  prefillEmail?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const hasOverlap =
    entries.some(e => dateRangesOverlap(startDate, endDate, e.start_date, e.end_date)) ||
    requests.some(r => r.status === 'approved' && dateRangesOverlap(startDate, endDate, r.start_date, r.end_date))

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    formData.set('start_date', startDate)
    formData.set('end_date', endDate)
    const result = await createAnfrage(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(onSuccess, 2000)
    }
  }

  if (success) {
    return (
      <div className="py-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-green-400/20 border border-green-400/30 flex items-center justify-center mx-auto">
          <span className="text-xl">✓</span>
        </div>
        <p className="text-lg font-semibold text-white">Anfrage gesendet!</p>
        <p className="text-sm text-white/60">
          Deine Anfrage wurde erfolgreich gesendet. Ich prüfe sie und melde mich bald bei dir.
        </p>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4 mt-2">
      <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white/80">
        <span className="font-medium text-white">Zeitraum:</span> {formatDateRange(startDate, endDate)}
      </div>

      {hasOverlap && (
        <div className="rounded-xl bg-amber-400/15 border border-amber-300/30 px-4 py-3 text-sm text-amber-200">
          Hinweis: Dieser Zeitraum überschneidet sich mit einem bestehenden Eintrag. Du kannst die Anfrage trotzdem absenden.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="name" className={glassLabel}>Name *</Label>
          <Input id="name" name="name" defaultValue={prefillName} required className={glassInput} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="guest_count" className={glassLabel}>Personen *</Label>
          <Input id="guest_count" name="guest_count" type="number" min="1" defaultValue="1" required className={glassInput} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className={glassLabel}>E-Mail *</Label>
        <Input id="email" name="email" type="email" defaultValue={prefillEmail} required className={glassInput} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone" className={glassLabel}>Telefon (optional)</Label>
        <Input id="phone" name="phone" type="tel" className={glassInput} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="request_type" className={glassLabel}>Art des Besuchs (optional)</Label>
        <Select name="request_type">
          <SelectTrigger className={glassInput}>
            <SelectValue placeholder="Bitte wählen…" />
          </SelectTrigger>
          <SelectContent className="bg-indigo-900 border-white/20 text-white">
            <SelectItem value="freunde" className="focus:bg-white/10 focus:text-white">Freunde</SelectItem>
            <SelectItem value="familie" className="focus:bg-white/10 focus:text-white">Familie</SelectItem>
            <SelectItem value="arbeit" className="focus:bg-white/10 focus:text-white">Arbeit</SelectItem>
            <SelectItem value="event" className="focus:bg-white/10 focus:text-white">Event</SelectItem>
            <SelectItem value="sonstiges" className="focus:bg-white/10 focus:text-white">Sonstiges</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message" className={glassLabel}>Nachricht *</Label>
        <Textarea id="message" name="message" placeholder="Kurze Beschreibung deines Besuchs…" rows={3} required className={glassInput} />
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-indigo-700 font-semibold py-2.5 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Senden…' : 'Anfrage absenden'}
      </button>
    </form>
  )
}

export function AnfrageModal({ open, onOpenChange, startDate, endDate, entries, requests, prefillName, prefillEmail }: Props) {
  const isMobile = useIsMobile()
  const title = 'Besuch anfragen'
  const description = 'Fülle das Formular aus und sende deine Anfrage ab.'

  const content = (
    <AnfrageFormContent
      startDate={startDate}
      endDate={endDate}
      entries={entries}
      requests={requests}
      onSuccess={() => onOpenChange(false)}
      prefillName={prefillName}
      prefillEmail={prefillEmail}
    />
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="max-h-[90vh] overflow-y-auto rounded-t-2xl bg-indigo-900/95 backdrop-blur-xl border-t border-white/20 text-white"
        >
          <SheetHeader>
            <SheetTitle className="text-white">{title}</SheetTitle>
            <SheetDescription className="text-white/60">{description}</SheetDescription>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-indigo-900/90 backdrop-blur-xl border border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          <DialogDescription className="text-white/60">{description}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 3: Commit**

```bash
git add components/kalender/AnfrageModal.tsx
git commit -m "style: glass AnfrageModal with dark-adapted form elements"
```

---

### Task 8: Visitor calendar page — glass top-nav + fullscreen layout

- [ ] **Step 1: Read current AnfragenListe component**

```bash
cat components/kalender/AnfragenListe.tsx
```

- [ ] **Step 2: Replace app/kalender/page.tsx**

Replace `app/kalender/page.tsx` with:

```tsx
import { createClient } from '@/lib/supabase/server'
import { KalenderAnsicht } from '@/components/kalender/KalenderAnsicht'
import type { CalendarEntry, VisitRequest, Profile } from '@/types'
import { logout } from '@/lib/actions/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'

export default async function KalenderPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileResult, entriesResult, requestsResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('calendar_entries').select('*').order('start_date'),
    supabase.from('visit_requests').select('*').order('start_date'),
  ])

  const profile = profileResult.data as Profile
  const entries = (entriesResult.data ?? []) as CalendarEntry[]
  const requests = (requestsResult.data ?? []) as VisitRequest[]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-4 py-3 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="font-bold text-white tracking-tight text-lg">OpenStay</span>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:block text-sm text-white/60">{profile.name}</span>
            <Link
              href="/kalender/anfragen"
              className={buttonVariants({ variant: 'outline', size: 'sm' }) + ' border-white/20 text-white bg-white/10 hover:bg-white/20 hover:text-white'}
            >
              Meine Anfragen
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-white/60 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors"
              >
                Abmelden
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Calendar */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <KalenderAnsicht
          entries={entries}
          requests={requests}
          currentUserId={user.id}
          isAdmin={profile.role === 'admin'}
          prefillName={profile.name}
          prefillEmail={profile.email}
        />
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Replace AnfragenListe.tsx**

Replace `components/kalender/AnfragenListe.tsx` with:

```tsx
import { formatDateRange } from '@/lib/utils/datum'
import type { VisitRequest, RequestStatus } from '@/types'

const statusLabels: Record<RequestStatus, string> = {
  pending: 'Ausstehend',
  approved: 'Bestätigt',
  rejected: 'Abgelehnt',
  cancelled: 'Storniert',
}

const statusClasses: Record<RequestStatus, string> = {
  pending: 'bg-amber-400/20 text-amber-200 border border-amber-300/30',
  approved: 'bg-green-400/20 text-green-200 border border-green-300/30',
  rejected: 'bg-red-400/20 text-red-200 border border-red-300/30',
  cancelled: 'bg-white/10 text-white/50 border border-white/20',
}

export function AnfragenListe({ requests }: { requests: VisitRequest[] }) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12 text-white/40">
        <p className="text-sm">Du hast noch keine Anfragen gestellt.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map(r => (
        <div key={r.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-white">{formatDateRange(r.start_date, r.end_date)}</p>
              <p className="text-sm text-white/60 mt-0.5">{r.guest_count} Person{r.guest_count !== 1 ? 'en' : ''}</p>
              {r.message && <p className="text-sm text-white/70 mt-2">{r.message}</p>}
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${statusClasses[r.status]}`}>
              {statusLabels[r.status]}
            </span>
          </div>
          <p className="text-xs text-white/30 mt-3">
            Angefragt am {new Date(r.created_at).toLocaleDateString('de-DE')}
          </p>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Replace app/kalender/anfragen/page.tsx**

Replace `app/kalender/anfragen/page.tsx` with:

```tsx
import { createClient } from '@/lib/supabase/server'
import { AnfragenListe } from '@/components/kalender/AnfragenListe'
import Link from 'next/link'
import { logout } from '@/lib/actions/auth'
import type { VisitRequest } from '@/types'
import { redirect } from 'next/navigation'

export default async function MeineAnfragenPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: requests } = await supabase
    .from('visit_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen">
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-4 py-3 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/kalender" className="font-bold text-white tracking-tight text-lg hover:text-white/80">
            ← OpenStay
          </Link>
          <form action={logout}>
            <button type="submit" className="text-sm text-white/60 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors">
              Abmelden
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Meine Anfragen</h1>
        <AnfragenListe requests={(requests ?? []) as VisitRequest[]} />
      </main>
    </div>
  )
}
```

- [ ] **Step 5: Verify build**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 6: Run existing tests to confirm no regressions**

```bash
npm run test 2>&1 | tail -20
```
Expected: 8 passing tests (datum utilities unchanged).

- [ ] **Step 7: Commit**

```bash
git add app/kalender/page.tsx app/kalender/anfragen/page.tsx components/kalender/AnfragenListe.tsx
git commit -m "style: glass visitor calendar page, top-nav, anfragen list"
```

---

## Chunk 4: Admin Layout + Mobile Nav

**Files:**
- Create: `components/admin/AdminMobileNav.tsx`
- Modify: `components/admin/AdminSidebar.tsx`
- Modify: `app/admin/layout.tsx`

### Task 9: AdminMobileNav — bottom tab-bar + mobile header

- [ ] **Step 1: Create AdminMobileNav.tsx**

Create `components/admin/AdminMobileNav.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/admin', label: 'Dashboard', exact: true, icon: '⊞' },
  { href: '/admin/anfragen', label: 'Anfragen', icon: '📋' },
  { href: '/admin/kalender', label: 'Kalender', icon: '📅' },
  { href: '/admin/nutzer', label: 'Nutzer', icon: '👥' },
]

export function AdminMobileNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Fixed top header bar — mobile only */}
      <header className="fixed top-0 left-0 right-0 z-40 md:hidden bg-black/30 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <span className="font-bold text-white tracking-tight">OpenStay Admin</span>
      </header>

      {/* Fixed bottom tab bar — mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-black/35 backdrop-blur-xl border-t border-white/15">
        <div className="flex items-center justify-around px-2 py-1">
          {tabs.map(tab => {
            const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors min-w-0',
                  active ? 'text-white' : 'text-white/45'
                )}
              >
                <span className="text-lg leading-none">{tab.icon}</span>
                <span className="text-[10px] font-medium leading-none">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
```

- [ ] **Step 2: Update AdminSidebar for glass + desktop-only**

Replace `components/admin/AdminSidebar.tsx` with:

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/anfragen', label: 'Anfragen' },
  { href: '/admin/kalender', label: 'Kalender' },
  { href: '/admin/nutzer', label: 'Nutzer' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col bg-black/25 backdrop-blur-xl border-r border-white/10 min-h-screen">
      <div className="px-5 py-6 border-b border-white/10">
        <p className="font-bold text-white tracking-tight">OpenStay</p>
        <p className="text-xs text-white/40 mt-0.5">Admin</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <form action={logout}>
          <button
            type="submit"
            className="w-full text-left rounded-lg px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            Abmelden
          </button>
        </form>
      </div>
    </aside>
  )
}
```

- [ ] **Step 3: Update app/admin/layout.tsx**

Replace `app/admin/layout.tsx` with:

```tsx
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminMobileNav } from '@/components/admin/AdminMobileNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <AdminMobileNav />
      <main className="flex-1 pt-16 pb-20 px-4 md:pt-8 md:pb-8 md:px-8">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 5: Commit**

```bash
git add components/admin/AdminMobileNav.tsx components/admin/AdminSidebar.tsx app/admin/layout.tsx
git commit -m "style: glass admin sidebar (desktop) + mobile nav with bottom tab-bar"
```

---

## Chunk 5: Admin Pages

**Files:**
- Modify: `components/admin/DashboardKarten.tsx`
- Modify: `components/admin/AnfragenTabelle.tsx`
- Modify: `components/admin/NutzerTabelle.tsx`
- Modify: `components/admin/KalenderBlockForm.tsx`
- Modify: `app/admin/page.tsx`
- Modify: `app/admin/anfragen/page.tsx`
- Modify: `app/admin/kalender/page.tsx`
- Modify: `app/admin/nutzer/page.tsx`

### Task 10: Glass DashboardKarten

- [ ] **Step 1: Replace DashboardKarten.tsx**

Replace `components/admin/DashboardKarten.tsx` with:

```tsx
'use client'

import Link from 'next/link'
import { DayPicker } from 'react-day-picker'
import { de } from 'date-fns/locale'
import { parseISO } from 'date-fns'
import { formatDateRange } from '@/lib/utils/datum'
import type { VisitRequest, Profile, CalendarEntry } from '@/types'

interface Props {
  pendingRequests: VisitRequest[]
  upcomingVisits: VisitRequest[]
  pendingUsers: Profile[]
  calendarEntries: CalendarEntry[]
  approvedRequests: VisitRequest[]
}

export function DashboardKarten({ pendingRequests, upcomingVisits, pendingUsers, calendarEntries, approvedRequests }: Props) {
  const blockedDays = calendarEntries.flatMap(e => {
    const days: Date[] = []
    const cur = new Date(parseISO(e.start_date))
    const end = parseISO(e.end_date)
    while (cur <= end) { days.push(new Date(cur)); cur.setDate(cur.getDate() + 1) }
    return days
  })

  const guestDays = approvedRequests.flatMap(r => {
    const days: Date[] = []
    const cur = new Date(parseISO(r.start_date))
    const end = parseISO(r.end_date)
    while (cur <= end) { days.push(new Date(cur)); cur.setDate(cur.getDate() + 1) }
    return days
  })

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/anfragen">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center mb-4">
              <span className="text-lg">📋</span>
            </div>
            <p className="text-4xl font-bold text-white">{pendingRequests.length}</p>
            <p className="text-white/60 text-sm mt-1">Offene Anfragen</p>
            {pendingRequests.length > 0 && (
              <p className="text-amber-300 text-xs mt-1">Warten auf Prüfung</p>
            )}
          </div>
        </Link>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-green-400/20 border border-green-300/30 flex items-center justify-center mb-4">
            <span className="text-lg">🏡</span>
          </div>
          <p className="text-white/60 text-sm mb-3">Nächste Besuche</p>
          {upcomingVisits.length === 0 ? (
            <p className="text-white/40 text-sm">Keine geplanten Besuche</p>
          ) : (
            <div className="space-y-2">
              {upcomingVisits.slice(0, 3).map(v => (
                <div key={v.id}>
                  <p className="font-semibold text-white text-sm">{v.name}</p>
                  <p className="text-white/50 text-xs">{formatDateRange(v.start_date, v.end_date)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link href="/admin/nutzer">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-indigo-400/20 border border-indigo-300/30 flex items-center justify-center mb-4">
              <span className="text-lg">👥</span>
            </div>
            <p className="text-4xl font-bold text-white">{pendingUsers.length}</p>
            <p className="text-white/60 text-sm mt-1">Neue Nutzer</p>
            {pendingUsers.length > 0 && (
              <p className="text-indigo-300 text-xs mt-1">Warten auf Freischaltung</p>
            )}
          </div>
        </Link>
      </div>

      {/* Mini calendar */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <p className="text-white/60 text-sm font-semibold uppercase tracking-wide mb-4">Kalenderübersicht</p>
        <DayPicker
          locale={de}
          modifiers={{ blocked: blockedDays, guest: guestDays }}
          modifiersClassNames={{ blocked: 'rdp-day-blocked', guest: 'rdp-day-other-approved' }}
          showOutsideDays
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update app/admin/page.tsx heading**

In `app/admin/page.tsx`, change `text-stone-800` → `text-white`:
```tsx
<h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add components/admin/DashboardKarten.tsx app/admin/page.tsx
git commit -m "style: glass admin dashboard cards and mini calendar"
```

---

### Task 11: Glass AnfragenTabelle

- [ ] **Step 1: Replace AnfragenTabelle.tsx**

Replace `components/admin/AnfragenTabelle.tsx` with:

```tsx
'use client'

import { useState } from 'react'
import { approveAnfrage, rejectAnfrage, cancelAnfrage } from '@/lib/actions/anfragen'
import { formatDateRange } from '@/lib/utils/datum'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import type { VisitRequest, RequestStatus } from '@/types'

const statusLabels: Record<RequestStatus, string> = {
  pending: 'Ausstehend',
  approved: 'Bestätigt',
  rejected: 'Abgelehnt',
  cancelled: 'Storniert',
}

const statusClasses: Record<RequestStatus, string> = {
  pending: 'bg-amber-400/20 text-amber-200 border border-amber-300/30',
  approved: 'bg-green-400/20 text-green-200 border border-green-300/30',
  rejected: 'bg-red-400/20 text-red-200 border border-red-300/30',
  cancelled: 'bg-white/10 text-white/50 border border-white/20',
}

export function AnfragenTabelle({ requests }: { requests: VisitRequest[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  async function handleApprove(id: string) {
    setLoading(id + '-approve')
    setActionError(null)
    try {
      const result = await approveAnfrage(id)
      if (result?.error) setActionError(result.error)
    } catch {
      setActionError('Fehler beim Bestätigen. Bitte versuche es erneut.')
    } finally {
      setLoading(null)
    }
  }

  async function handleReject(id: string) {
    setLoading(id + '-reject')
    setActionError(null)
    try {
      const result = await rejectAnfrage(id)
      if (result?.error) setActionError(result.error)
    } catch {
      setActionError('Fehler beim Ablehnen. Bitte versuche es erneut.')
    } finally {
      setLoading(null)
    }
  }

  async function handleCancel(id: string) {
    setLoading(id + '-cancel')
    setActionError(null)
    try {
      const result = await cancelAnfrage(id)
      if (result?.error) setActionError(result.error)
    } catch {
      setActionError('Fehler beim Stornieren. Bitte versuche es erneut.')
    } finally {
      setLoading(null)
      setConfirmCancel(null)
    }
  }

  if (requests.length === 0) {
    return <p className="text-white/40 text-sm py-8 text-center">Keine Anfragen vorhanden.</p>
  }

  return (
    <>
      <div className="space-y-4">
        {requests.map(r => (
          <div key={r.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-white">{r.name}</p>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusClasses[r.status]}`}>
                    {statusLabels[r.status]}
                  </span>
                </div>
                <p className="text-sm text-white/60">{r.email}{r.phone ? ` · ${r.phone}` : ''}</p>
                <p className="text-sm font-medium text-white mt-1">{formatDateRange(r.start_date, r.end_date)}</p>
                <p className="text-sm text-white/60">{r.guest_count} Person{r.guest_count !== 1 ? 'en' : ''}{r.request_type ? ` · ${r.request_type}` : ''}</p>
                {r.message && <p className="text-sm text-white/70 mt-2 italic">"{r.message}"</p>}
                <p className="text-xs text-white/30 mt-1">
                  Eingegangen: {new Date(r.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                {r.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(r.id)}
                      disabled={loading === r.id + '-approve'}
                      className="bg-green-400/20 border border-green-300/30 text-green-200 text-xs px-3 py-1.5 rounded-lg hover:bg-green-400/30 transition-colors disabled:opacity-50"
                    >
                      {loading === r.id + '-approve' ? '…' : 'Bestätigen'}
                    </button>
                    <button
                      onClick={() => handleReject(r.id)}
                      disabled={loading === r.id + '-reject'}
                      className="bg-red-400/20 border border-red-300/30 text-red-200 text-xs px-3 py-1.5 rounded-lg hover:bg-red-400/30 transition-colors disabled:opacity-50"
                    >
                      {loading === r.id + '-reject' ? '…' : 'Ablehnen'}
                    </button>
                  </>
                )}
                {r.status === 'approved' && (
                  <button
                    onClick={() => setConfirmCancel(r.id)}
                    className="bg-white/10 border border-white/20 text-white/60 text-xs px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Stornieren
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!confirmCancel} onOpenChange={() => setConfirmCancel(null)}>
        <DialogContent className="bg-indigo-900/90 backdrop-blur-xl border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Besuch stornieren?</DialogTitle>
            <DialogDescription className="text-white/60">
              Der Besucher wird per E-Mail über die Stornierung informiert und der Kalendereintrag wird entfernt.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setConfirmCancel(null)}
              className="bg-white/10 border border-white/20 text-white/70 text-sm px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={() => confirmCancel && handleCancel(confirmCancel)}
              disabled={!!loading}
              className="bg-red-400/20 border border-red-300/30 text-red-200 text-sm px-4 py-2 rounded-lg hover:bg-red-400/30 transition-colors disabled:opacity-50"
            >
              Ja, stornieren
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {actionError && <p className="text-sm text-red-300 mt-4">{actionError}</p>}
    </>
  )
}
```

- [ ] **Step 2: Read app/admin/anfragen/page.tsx**

```bash
cat app/admin/anfragen/page.tsx
```

- [ ] **Step 3: Update heading in app/admin/anfragen/page.tsx**

Find the `<h1>` element in the return block and change its className to `text-2xl font-bold text-white mb-6`. Keep all data fetching, imports, and other JSX unchanged.

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 5: Commit**

```bash
git add components/admin/AnfragenTabelle.tsx app/admin/anfragen/page.tsx
git commit -m "style: glass admin Anfragen table and page"
```

---

### Task 12: Glass NutzerTabelle + KalenderBlockForm + remaining pages

- [ ] **Step 1: Replace NutzerTabelle.tsx**

Replace `components/admin/NutzerTabelle.tsx` with:

```tsx
'use client'

import { useState } from 'react'
import { approveNutzer, blockNutzer } from '@/lib/actions/nutzer'
import type { Profile } from '@/types'

export function NutzerTabelle({ users }: { users: Profile[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  async function handleApprove(id: string) {
    setLoading(id + '-approve')
    setActionError(null)
    try {
      const result = await approveNutzer(id)
      if (result?.error) setActionError(result.error)
    } catch {
      setActionError('Fehler beim Freischalten. Bitte versuche es erneut.')
    } finally {
      setLoading(null)
    }
  }

  async function handleBlock(id: string) {
    setLoading(id + '-block')
    setActionError(null)
    try {
      const result = await blockNutzer(id)
      if (result?.error) setActionError(result.error)
    } catch {
      setActionError('Fehler beim Sperren. Bitte versuche es erneut.')
    } finally {
      setLoading(null)
    }
  }

  if (users.length === 0) {
    return <p className="text-white/40 text-sm py-8 text-center">Keine Nutzer vorhanden.</p>
  }

  return (
    <div className="space-y-3">
      {users.map(u => (
        <div key={u.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-semibold text-white">{u.name}</p>
            <p className="text-sm text-white/60">{u.email}</p>
            <p className="text-xs text-white/30 mt-1">
              Registriert: {new Date(u.created_at).toLocaleDateString('de-DE')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              u.approved
                ? 'bg-green-400/20 text-green-200 border border-green-300/30'
                : 'bg-amber-400/20 text-amber-200 border border-amber-300/30'
            }`}>
              {u.approved ? 'Freigeschaltet' : 'Ausstehend'}
            </span>
            {!u.approved ? (
              <button
                onClick={() => handleApprove(u.id)}
                disabled={loading === u.id + '-approve'}
                className="bg-white/15 border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-white/25 transition-colors disabled:opacity-50"
              >
                {loading === u.id + '-approve' ? '…' : 'Freischalten'}
              </button>
            ) : (
              <button
                onClick={() => handleBlock(u.id)}
                disabled={loading === u.id + '-block'}
                className="bg-red-400/15 border border-red-300/20 text-red-200 text-xs px-3 py-1.5 rounded-lg hover:bg-red-400/25 transition-colors disabled:opacity-50"
              >
                {loading === u.id + '-block' ? '…' : 'Sperren'}
              </button>
            )}
          </div>
        </div>
      ))}
      {actionError && <p className="text-sm text-red-300 mt-4">{actionError}</p>}
    </div>
  )
}
```

- [ ] **Step 2: Replace KalenderBlockForm.tsx**

Replace `components/admin/KalenderBlockForm.tsx` with:

```tsx
'use client'

import { useState } from 'react'
import { createKalenderBlock } from '@/lib/actions/kalender'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const gi = 'bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-white/40 focus-visible:border-white/40'
const gl = 'text-white/80 text-sm'

export function KalenderBlockForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await createKalenderBlock(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    }
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
      <h2 className="font-semibold text-white text-lg">Neuer Eintrag</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="start_date" className={gl}>Von *</Label>
          <Input id="start_date" name="start_date" type="date" required className={gi} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="end_date" className={gl}>Bis *</Label>
          <Input id="end_date" name="end_date" type="date" required className={gi} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="type" className={gl}>Typ *</Label>
          <Select name="type" required>
            <SelectTrigger className={gi}>
              <SelectValue placeholder="Typ wählen…" />
            </SelectTrigger>
            <SelectContent className="bg-indigo-900 border-white/20 text-white">
              <SelectItem value="travel" className="focus:bg-white/10 focus:text-white">Verreist</SelectItem>
              <SelectItem value="blocked" className="focus:bg-white/10 focus:text-white">Blockiert</SelectItem>
              <SelectItem value="custom" className="focus:bg-white/10 focus:text-white">Sonstiges</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="title" className={gl}>Titel *</Label>
          <Input id="title" name="title" placeholder="z.B. Urlaub" required className={gi} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes" className={gl}>Notizen (intern)</Label>
        <Textarea id="notes" name="notes" rows={2} className={gi} />
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}
      {success && <p className="text-sm text-green-300">Eintrag erstellt!</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-white text-indigo-700 font-semibold px-5 py-2 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Speichern…' : 'Eintrag anlegen'}
      </button>
    </form>
  )
}
```

- [ ] **Step 3: Read admin sub-pages to understand current structure**

```bash
cat app/admin/nutzer/page.tsx
cat app/admin/kalender/page.tsx
```

- [ ] **Step 4: Update headings in admin sub-pages**

In `app/admin/nutzer/page.tsx`: change the `<h1>` className to `text-2xl font-bold text-white mb-6`. Keep all data fetching and other JSX unchanged.

In `app/admin/kalender/page.tsx`: change the `<h1>` className to `text-2xl font-bold text-white mb-6`. Keep all data fetching and other JSX unchanged.

- [ ] **Step 5: Verify build**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 6: Run all tests**

```bash
npm run test 2>&1 | tail -20
```
Expected: 8 passing.

- [ ] **Step 7: Commit**

```bash
git add components/admin/NutzerTabelle.tsx components/admin/KalenderBlockForm.tsx \
  app/admin/nutzer/page.tsx app/admin/kalender/page.tsx
git commit -m "style: glass admin Nutzer table, KalenderBlock form, all admin pages complete"
```
