# OpenStay — Design Spec

**Datum:** 2026-03-15
**Status:** Approved

## Zusammenfassung

OpenStay ist eine private Web-App zur Besuchsplanung. Besucher sehen einen Kalender mit der Verfügbarkeit des Gastgebers, können Anfragen für Zeiträume stellen und den Status ihrer Anfragen verfolgen. Der Admin (Gastgeber) verwaltet Anfragen, Kalenderblöcke und Nutzer-Freischaltungen.

---

## Tech Stack

| Schicht | Technologie |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Kalender | react-day-picker |
| Backend / Datenbank | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth |
| E-Mail | Resend + React Email |
| Deployment | Vercel |

---

## Rollen & Zugang

Es gibt drei Zustände für einen Nutzer:

- **Admin** — der Gastgeber, voller Zugriff auf alle Bereiche
- **Approved User** — registrierter Besucher, vom Admin freigeschaltet
- **Pending User** — registriert, aber noch nicht freigeschaltet → sieht nur die Pending-Seite

Registrierung ist offen (jeder kann sich einen Account erstellen), aber erst nach manueller Admin-Freischaltung nutzbar.

---

## Routing

```
/                      Redirect je nach Auth-Status
/login                 Login-Seite
/registrieren          Registrierung (Name, E-Mail, Passwort)
/pending               "Freischaltung ausstehend"-Seite

/kalender              Hauptkalender (approved User + Admin)
/kalender/anfragen     Eigene Anfragen des eingeloggten Users (Liste + Status)

/admin                 Admin Dashboard
/admin/anfragen        Alle Anfragen verwalten (bestätigen / ablehnen)
/admin/kalender        Manuelle Kalenderblöcke anlegen / bearbeiten
/admin/nutzer          Nutzer freischalten / sperren
```

**Middleware** schützt alle Routen:
- Nicht eingeloggt → `/login`
- Eingeloggt, nicht approved → `/pending`
- Nicht-Admin auf `/admin/*` → `/kalender`

---

## Datenmodell

### `profiles`
Erweitert `auth.users` von Supabase.

| Feld | Typ | Beschreibung |
|---|---|---|
| id | uuid | FK zu auth.users |
| name | text | Anzeigename |
| email | text | E-Mail-Adresse |
| role | enum | `admin` oder `user` |
| approved | boolean | Standard: false |
| created_at | timestamp | Registrierungszeitpunkt |

### `calendar_entries`
Admin-verwaltete Kalenderblöcke. Einträge vom Typ `guest` werden **automatisch erstellt**, wenn der Admin eine `visit_request` bestätigt (`status → approved`). Der `linked_request_id` verknüpft den Eintrag mit der ursprünglichen Anfrage. Alle anderen Typen (`travel`, `blocked`, `custom`) werden manuell vom Admin angelegt.

| Feld | Typ | Beschreibung |
|---|---|---|
| id | uuid | Primary Key |
| type | enum | `travel`, `blocked`, `guest`, `custom` |
| title | text | Interner Titel |
| start_date | date | Startdatum |
| end_date | date | Enddatum |
| notes | text? | Optionale Notizen |
| linked_request_id | uuid? | FK zu visit_requests — nur gesetzt bei type `guest` |
| created_at | timestamp | Erstellungszeitpunkt |

### `visit_requests`
Besuchsanfragen von registrierten Usern. `name` und `email` werden beim Erstellen der Anfrage aus dem Profil des eingeloggten Users vorausgefüllt, sind aber im Formular editierbar (für den Fall, dass jemand im Namen einer anderen Person anfrägt).

| Feld | Typ | Beschreibung |
|---|---|---|
| id | uuid | Primary Key |
| user_id | uuid | FK zu profiles |
| name | text | Name des Besuchers (vorausgefüllt aus Profil, editierbar) |
| email | text | E-Mail des Besuchers (vorausgefüllt aus Profil, editierbar) |
| phone | text? | Telefon (optional) |
| guest_count | integer | Anzahl Personen |
| message | text | Nachricht / Bemerkung |
| request_type | enum? | `freunde`, `familie`, `arbeit`, `event`, `sonstiges` |
| start_date | date | Gewünschter Start |
| end_date | date | Gewünschtes Ende |
| status | enum | `pending`, `approved`, `rejected`, `cancelled` |
| created_at | timestamp | Zeitpunkt der Anfrage |
| reviewed_at | timestamp? | Zeitpunkt der Entscheidung |
| admin_notes | text? | Interne Admin-Notizen |

---

## Row Level Security

| Tabelle | User | Admin |
|---|---|---|
| `profiles` | Eigenes Profil lesen/schreiben | Alle lesen/schreiben |
| `calendar_entries` | Alle lesen | Alle lesen/schreiben |
| `visit_requests` | Eigene lesen/erstellen | Alle lesen/schreiben |

---

## Kalenderlogik

### Statusanzeige für Besucher

| Zustand | Farbe | Sichtbarkeit |
|---|---|---|
| Frei / anfragbar | Weiß | Alle |
| Verreist / blockiert | Grau | Alle (nur Datum, kein Titel) |
| Besuch bestätigt (fremd) | Blau gedimmt | Alle (nur "Belegt") |
| Eigene Anfrage ausstehend | Orange/Gelb | Nur Anfragender |
| Eigene Anfrage bestätigt | Grün | Nur Anfragender |
| Eigene Anfrage abgelehnt | Rot | Nur Anfragender |

Admin sieht alle Details aller Einträge.

### Überschneidungslogik

Überschneidungen sind **erlaubt** (mehrere Besucher zur gleichen Zeit möglich). Die Überschneidungswarnung wird geprüft gegen:
- Alle `calendar_entries` (unabhängig vom Typ)
- Alle `visit_requests` mit Status `approved`

Wenn sich ein gewünschter Zeitraum mit einem dieser Einträge überschneidet, wird dem User eine **Warnung** angezeigt, das Absenden der Anfrage ist aber trotzdem möglich. `pending`-Anfragen anderer User lösen keine Warnung aus. Der Admin entscheidet beim Review.

### Anfrage-Flow

1. User wählt Starttag und Endtag im Kalender
2. Überschneidungswarnung wird live angezeigt (falls relevant)
3. Formular öffnet sich als Modal (shadcn `Dialog` auf Desktop, shadcn `Sheet` als Bottom-Sheet auf Mobile)
4. Absenden → Status `pending` → Admin erhält E-Mail
5. Admin bestätigt oder lehnt ab → User erhält E-Mail → Kalender aktualisiert sich

Bei Bestätigung durch Admin: `visit_request.status → approved` + automatisch neuer `calendar_entry` vom Typ `guest` mit `linked_request_id`.

Bei Ablehnung: `visit_request.status → rejected`, kein `calendar_entry` wird erstellt.

`cancelled`-Status wird manuell vom Admin gesetzt (z.B. wenn ein bereits bestätigter Besuch abgesagt wird). Dabei wird der verknüpfte `calendar_entry` gelöscht und der User erhält eine Absage-E-Mail.

---

## Admin Dashboard (`/admin`)

Das Dashboard zeigt auf einen Blick:
- **Karte "Offene Anfragen":** Anzahl der Anfragen mit Status `pending`, Link zu `/admin/anfragen`
- **Karte "Nächste Besuche":** Die nächsten 3 bestätigten Besuche (Datum, Name, Personenanzahl)
- **Karte "Nutzer":** Anzahl der Nutzer mit Status pending (warten auf Freischaltung), Link zu `/admin/nutzer`
- **Mini-Kalender:** Monatsübersicht mit allen Einträgen, nur zur Orientierung (keine Bearbeitung direkt hier)

---

## Anfrageformular

Felder (Name und E-Mail werden aus dem Profil vorausgefüllt):
- Name
- E-Mail-Adresse
- Telefonnummer (optional)
- Anzahl der Personen
- Art des Besuchs: Freunde / Familie / Arbeit / Event / Sonstiges (optional)
- Nachricht / Bemerkung

Nach dem Absenden: Bestätigungsmeldung im Modal ("Deine Anfrage wurde erfolgreich gesendet. Ich prüfe sie und melde mich bald bei dir.")

---

## E-Mail-Benachrichtigungen

| Ereignis | Empfänger | Inhalt |
|---|---|---|
| Neue Registrierung | Admin | Neuer User wartet auf Freischaltung |
| Account freigeschaltet | User | Account wurde freigeschaltet |
| Neue Anfrage eingegangen | Admin | Zeitraum, Name, Personen, Nachricht |
| Anfrage bestätigt | User | Bestätigung mit Zeitraum |
| Anfrage abgelehnt | User | Höfliche Absage |
| Anfrage storniert (cancelled) | User | Absage eines bereits bestätigten Besuchs |

Implementierung via **Resend** + **React Email** Templates.

---

## UI & Design

- **Sprache:** Deutsch
- **Theme:** Hell, viel Weißraum, sanfte Schatten
- **Schrift:** Inter
- **Farbpalette:** Warme Neutraltöne (Slate/Stone als Basis) + Indigo als Akzentfarbe
- **Kalender:** Zentral, groß, klar lesbar
- **Anfrage-Formular:** shadcn `Dialog` auf Desktop, shadcn `Sheet` (Bottom-Sheet) auf Mobile
- **Admin-Bereich:** Eigenes Layout mit Sidebar, Dashboard-Karten für offene Anfragen / nächste Besuche / Nutzer

---

## MVP-Umfang

Enthalten in Version 1:
- Registrierung + Login + Pending-State
- Admin Nutzer-Freischaltung
- Öffentlicher Kalender (für approved User)
- Zeitraumsauswahl mit Überschneidungswarnung
- Anfrageformular als Modal
- Admin Dashboard
- Anfragen bestätigen / ablehnen / stornieren
- Manuelle Kalenderblöcke anlegen
- E-Mail-Benachrichtigungen (alle 6 Ereignisse)
- Responsives Design

Nicht im MVP (spätere Versionen):
- iCal / Google Calendar Sync
- Mehrsprachigkeit
- Warteliste
- Blackout-Regeln (Mindestaufenthalt, Vorlaufzeit)
- Push-Benachrichtigungen
- Exportfunktion
- Gästehistorie
