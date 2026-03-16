# OpenStay — UI Redesign & Email Fix

**Datum:** 2026-03-16
**Status:** Approved

---

## Übersicht

Zwei unabhängige Arbeitsbereiche:

1. **UI Redesign** — komplettes visuelles Redesign der gesamten App auf Glassmorphism-Basis, mit voller Mobile-Responsiveness
2. **Email-Fixes** — App-Mails von eigener Domain senden, Supabase Auth-Mails von eigener Domain + Custom-Design, React Email Templates neu gestalten

---

## 1. UI Redesign

### Design-System

**Globales Theme:**
- Hintergrund: durchgängiger CSS-Gradient `135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%` — gilt für alle Seiten (`min-h-screen`)
- Glaskarten: `background: rgba(255,255,255,0.12)`, `backdrop-filter: blur(16px)`, `border: 1px solid rgba(255,255,255,0.2)`, `border-radius: 12px`
- Text primär: `text-white`
- Text sekundär: `text-white/60`
- Font: Inter (unverändert)
- Buttons Primary: `bg-white text-indigo-700 font-semibold hover:bg-white/90`
- Buttons Ghost: `bg-white/15 text-white border border-white/20 hover:bg-white/25`
- Input-Felder: `bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-white/50`

**react-day-picker CSS-Strategie:**
Der bestehende `import 'react-day-picker/dist/style.css'` wird **entfernt**. Stattdessen wird ein eigener CSS-Block (in `app/globals.css` oder als `<style>`-Tag in `KalenderAnsicht`) alle notwendigen `.rdp-*`-Zustände abdecken: nav-buttons, caption, range-start/end, today, selected, disabled/past sowie die custom modifiers. Kein `!important`-Flickwerk — klene, vollständige Neudefinition aller rdp-Klassen.

**shadcn/ui Glass-Styling:**
Glassstile werden als `className`-Overrides **an den Verwendungsstellen** übergeben (Approach A — kein Umbau der Component-Source in `components/ui/`). Das hält die shadcn-Primitives unverändert und erlaubt gezielte Overrides pro Seite/Formular.

**Dark Mode:**
Dark Mode ist **out of scope**. Keine `dark:`-Varianten, kein `next-themes`, keine Änderungen an der Tailwind `darkMode`-Konfiguration. Das durchgängige Glassmorphism-Theme ist per Definition dunkel — es gibt keinen Light/Dark-Toggle.

**Kalender-Tag-Farben (react-day-picker modifiers):**

| Status | Farbe |
|---|---|
| Frei | `rgba(255,255,255,0.06)` — sehr subtil |
| Geblockt / Reise / Custom | `rgba(255,255,255,0.25)` — helles Weiß |
| Fremdbesuch bestätigt | `rgba(99,102,241,0.55)` — Indigo |
| Eigene Anfrage ausstehend | `rgba(251,191,36,0.55)` — Amber |
| Eigene Anfrage bestätigt | `rgba(134,239,172,0.45)` — Grün |
| Eigene Anfrage abgelehnt | `rgba(248,113,113,0.45)` — Rot |
| Heute | `ring-2 ring-white/60` — weißer Ring |
| Ausgewählt (Range) | `rgba(255,255,255,0.3)` — heller Weiß-Overlay |

### Auth-Seiten (`/login`, `/registrieren`, `/pending`)

- Voller Gradient-Hintergrund
- Zentriertes Glas-Panel (`max-w-sm mx-auto`): Logo + Titel oben, Formular / Text darunter
- Labels und Inputs im Glassstil
- Submit-Button: Primary-Stil (weißer Button)

### Besucher-Kalender (`/kalender`)

**Layout Desktop:**
- `min-h-screen` mit Gradient-Hintergrund
- Top-Nav-Bar (Glassleiste): Logo links, rechts Name + "Meine Anfragen"-Button + Abmelden
- Darunter: zentrierter Bereich `max-w-3xl mx-auto px-4 py-8`
- Kalender-Legende (horizontale Icon-Reihe mit Farbpunkten + Labels)
- Großer `DayPicker` — zentriert, `showOutsideDays`, react-day-picker default styles überschrieben mit Glassstil-CSS
- Nach Zeitraumsauswahl: eine Glas-Bar erscheint unterhalb des Kalenders mit Datumsangabe + "Anfrage stellen"-Button. **Interaktionsflow:** Diese Bar ersetzt auf Desktop den sofortigen Modal-Öffner — der User sieht erst die Bar, klickt dann "Anfrage stellen", erst dann öffnet sich der Dialog. Auf Mobile öffnet der Button direkt das Bottom-Sheet (unverändert). In `KalenderAnsicht.tsx`: State `selectedRange` bleibt, aber `setModalOpen(true)` wird vom `handleSelect`-Callback entkoppelt und an den Bar-Button gebunden.

**Layout Mobile:**
- Gleicher Gradient, Top-Nav kollabiert auf Logo + Hamburger-Icon (oder nur Logo + minimale Icons)
- Kalender nimmt volle Breite ein
- Nach Auswahl: `Sheet` (Bottom-Sheet) öffnet sich mit kompakten Infos + Button

### Besucher Anfragen-Seite (`/kalender/anfragen`)

- Glasspanel mit Liste der eigenen Anfragen
- Status-Badges im Glassstil (Amber/Grün/Rot/Grau)

### Admin-Bereich

**Desktop-Layout:**
- Linke Glasssidebar: `w-16` (Icon-Only) oder `w-56` (Icon + Label) — bleibt wie bisher `w-56` mit Glas-Styling
  - Hintergrund: `rgba(0,0,0,0.25)` mit `backdrop-filter: blur(20px)`, rechts `border-r border-white/10`
  - Logo-Bereich oben: "OpenStay" in weiß
  - Nav-Links: aktiv = `bg-white/20 text-white`, inaktiv = `text-white/60 hover:bg-white/10`
  - Logout-Button unten
- Main-Content: `flex-1 p-8`, Gradient-Hintergrund durchscheinen lassen

**Mobile-Layout:**
- `AdminSidebar` wird auf Mobile ausgeblendet (`hidden md:flex`)
- Die `AdminMobileNav`-Komponente wird **direkt in `app/admin/layout.tsx`** gerendert (nicht in AdminSidebar) — sie enthält:
  - Oben: schmale Glasheader-Bar mit "OpenStay Admin" (`fixed top-0 left-0 right-0 z-40`)
  - Unten: fester `Bottom Tab-Bar` (`fixed bottom-0 left-0 right-0 z-40`)
    - 4 Tabs: Dashboard / Anfragen / Kalender / Nutzer
    - Hintergrund: `bg-black/35 backdrop-blur-xl border-t border-white/15`
    - Aktiver Tab: weißes Icon + weißer Label-Text
    - Inaktiver Tab: `text-white/50`
- `<main>` bekommt auf Mobile `pt-12 pb-16` (Platz für Header oben + Tab-Bar unten), auf Desktop `p-8`

**Admin Dashboard (`/admin`):**
- 3 Glasskarten in einer Reihe (`grid-cols-1 md:grid-cols-3`)
- Jede Karte: Emoji-Icon in farbigem Glas-Badge, große Zahl, Subtitle
- Darunter: Kalender-Karte (Glasspanel, volle Breite)

**Admin Anfragen (`/admin/anfragen`), Kalender (`/admin/kalender`), Nutzer (`/admin/nutzer`):**
- Tabellen / Formulare in Glasspanels
- Tabellen-Header: `bg-white/5`, Rows: `border-b border-white/10`, Hover: `bg-white/10`
- Action-Buttons (Bestätigen / Ablehnen): Primary/Ghost im Glassstil

### AnfrageModal / Sheet

- Dialog (Desktop): Glas-Overlay über Gradient-Hintergrund — `bg-black/40 backdrop-blur-sm`, Panel selbst: `bg-indigo-900/80 backdrop-blur-xl border border-white/20`
- Sheet (Mobile): Bottom-Sheet im selben Glassstil
- Formularfelder: Glassstil wie oben definiert
- **Überschneidungswarnung** (bisher `bg-amber-50 border-amber-200 text-amber-800`): wird zu `bg-amber-400/20 border border-amber-300/40 text-amber-200` — lesbar auf dunklem Hintergrund
- **Erfolgsmeldung nach Absenden** (bisher stone-Farben): wird zu `text-white` / `text-white/70` passend zum Glasspanel

---

## 2. Email-Fixes

### 2a. Supabase Auth-Mails — Custom SMTP

**Problem:** Auth-Bestätigungsmails kommen von `noreply@mail.supabase.io` mit Supabase-Default-Design.

**Lösung:** In Supabase Dashboard → Auth → SMTP Settings:
- Host: `smtp.resend.com`
- Port: `465`
- User: `resend`
- Password: `RESEND_API_KEY`
- Sender Name: `OpenStay`
- Sender Email: Wert aus `RESEND_FROM_EMAIL`

Dies ist reine Dashboard-Konfiguration, kein Code-Change. Doku dafür wird in den Setup-Hinweisen ergänzt.

### 2b. Supabase Auth Email Templates

**Problem:** Registrierungsbestätigung, Passwort-Reset etc. haben Supabase-Default-Design.

**Lösung:** In Supabase Dashboard → Auth → Email Templates: HTML-Templates eintragen mit:
- Gradient-Header-Banner (Indigo/Violett)
- Weißer Body-Bereich
- Indigo-CTA-Button
- OpenStay-Branding

Die fertigen HTML-Strings werden als Datei `supabase/email-templates/` abgelegt, damit sie versioniert und einfach ins Dashboard kopierbar sind.

### 2c. React Email Templates Redesign

**Problem:** Die 6 bestehenden Templates (`NeueRegistrierung`, `AccountFreigeschaltet`, `NeueAnfrage`, `AnfrageBestaetigt`, `AnfrageAbgelehnt`, `AnfrageStorniert`) haben ein sehr minimales Design.

**Lösung:**
1. Neuer gemeinsamer Wrapper `lib/email/templates/EmailLayout.tsx`:
   - Gradient-Header-Banner mit "OpenStay"-Branding
   - Weißer Container-Body
   - Footer mit App-URL
2. Alle 6 Templates nutzen `EmailLayout` als Wrapper
3. Templates die einen App-Link sinnvoll machen (`AccountFreigeschaltet`, `AnfrageBestaetigt`) bekommen einen Indigo-CTA-Button mit `process.env.NEXT_PUBLIC_SITE_URL`

### 2d. Resend Domain & Umgebungsvariablen

**Problem:** Mails werden nicht gesendet weil Resend noch nicht konfiguriert ist.

**Lösung (konkrete Code-Artefakte):**
- `.env.local.example`: Kommentar ergänzen mit Hinweis auf Resend Domain-Verifizierung und Custom SMTP
- `README.md` (neu erstellen falls nicht vorhanden): Abschnitt "Setup" mit Schritt-für-Schritt-Anleitung: Resend Account, Domain verifizieren, DNS-Einträge, Supabase Custom SMTP eintragen, Env-Vars in Vercel setzen

---

## Implementierungsreihenfolge (Empfehlung)

1. Design-System aufbauen (Tailwind-Klassen, globales CSS für react-day-picker)
2. Auth-Seiten redesignen
3. Besucher-Kalender redesignen (inkl. KalenderAnsicht + AnfrageModal)
4. Admin-Sidebar + Layout mobile-responsive machen
5. Admin-Seiten (Dashboard, Anfragen, Kalender, Nutzer) redesignen
6. React Email Templates redesign + EmailLayout
7. Supabase Auth Email Template HTML-Dateien erstellen
8. Dokumentation / Setup-Hinweise aktualisieren

---

## Nicht im Scope

- Funktionale Änderungen (Datenmodell, Server Actions, Auth-Logik)
- Neue Features
- iCal-Sync, Mehrsprachigkeit oder andere MVP++-Features
