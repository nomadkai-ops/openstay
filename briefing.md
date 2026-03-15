Klar, hier ist ein ausführliches Briefing, das du direkt an einen KI Agenten weitergeben kannst:

# Briefing für eine Web App zur Besuchsplanung

Ich möchte eine Web App entwickeln, mit der Freunde, Familie oder andere Besucher online sehen können, wann ich verreist bin, wann bereits Besuch bei mir geplant ist und für welche Zeiträume noch Anfragen möglich sind. Die App soll es Besuchern erlauben, direkt über ein Interface einen gewünschten Zeitraum anzufragen. Ich als Admin möchte diese Anfrage anschließend prüfen und bestätigen oder ablehnen können.

Die App soll modern, sehr übersichtlich und möglichst einfach zu bedienen sein. Der Fokus liegt klar auf einer angenehmen Nutzererfahrung, sowohl für Besucher als auch für mich als Admin.

## Ziel der App

Die App soll die private Besuchsplanung vereinfachen. Besucher sollen nicht mehr per Chat erst lange nach freien Zeiträumen fragen müssen, sondern direkt in einem Kalender sehen können, welche Zeiträume verfügbar, blockiert oder bereits belegt sind. Gleichzeitig soll aber nicht jeder einfach selbst Termine buchen können. Stattdessen sollen Besucher eine Anfrage stellen, die ich manuell freigebe oder ablehne.

## Grundidee

Es gibt zwei Seiten bzw. zwei Rollen:

### 1. Öffentlicher Besucherbereich

Hier sehen Besucher einen Kalender mit meiner Verfügbarkeit und können eine Anfrage für einen Zeitraum stellen.

### 2. Admin Bereich

Hier sehe ich alle eingegangenen Anfragen, kann sie annehmen oder ablehnen und verwalte zusätzlich manuell meine eigenen Abwesenheiten, bestehende Besuche und Blockierungen.

## Hauptfunktionen

## Öffentlicher Bereich

### Kalenderansicht

Besucher sollen einen Kalender sehen, in dem unterschiedliche Zeiträume visuell klar markiert sind.

Es soll folgende Status geben:

* Verreist / nicht verfügbar
* Bereits Besuch vorhanden
* Frei / anfragbar
* Angefragt / ausstehend, optional nur intern sichtbar
* Bestätigt

Der Kalender soll idealerweise monatlich dargestellt werden und auf Desktop wie Mobile gut funktionieren.

### Zeitraum anfragen

Besucher sollen einen Starttag und einen Endtag auswählen können. Danach öffnet sich ein Formular.

### Formular für Anfrage

Das Formular soll mindestens folgende Felder enthalten:

* Name
* E Mail Adresse
* Optional Telefonnummer
* Anzahl der Personen
* Nachricht / Bemerkung
* Optional Art des Besuchs, zum Beispiel Freunde, Familie, Arbeit, Event, Sonstiges

Nach dem Absenden soll die Anfrage gespeichert werden, aber noch nicht automatisch als bestätigt gelten.

### Feedback nach dem Absenden

Nach erfolgreicher Anfrage soll der Besucher eine klare Rückmeldung sehen, zum Beispiel:

"Deine Anfrage wurde erfolgreich gesendet. Ich prüfe sie und melde mich bald bei dir."

Optional wäre auch eine automatische E Mail an den Besucher sinnvoll.

## Admin Bereich

### Login

Es soll einen geschützten Admin Bereich geben, auf den nur ich Zugriff habe.

### Dashboard

Im Dashboard möchte ich auf einen Blick sehen:

* Alle offenen Anfragen
* Bestätigte Besuche
* Meine eingetragenen Reisezeiten / Blockierungen
* Kommende Aufenthalte
* Kalenderübersicht mit allen Status

### Anfrageverwaltung

Für jede Anfrage möchte ich folgende Informationen sehen:

* Gewünschter Zeitraum
* Name
* E Mail
* Anzahl der Personen
* Nachricht
* Zeitpunkt der Anfrage
* Status

Ich möchte Anfragen mit einem Klick bestätigen oder ablehnen können.

### Verhalten bei Bestätigung

Wenn ich eine Anfrage bestätige, soll der Zeitraum automatisch als "Besuch bestätigt" im Kalender erscheinen.

Optional:

* Der Besucher erhält automatisch eine Bestätigungs E Mail
* Die Anfrage wird auf "bestätigt" gesetzt

### Verhalten bei Ablehnung

Wenn ich eine Anfrage ablehne:

* Die Anfrage wird auf "abgelehnt" gesetzt
* Optional erhält der Besucher automatisch eine höfliche Ablehnungs E Mail
* Der Zeitraum bleibt weiterhin frei oder wird nicht verändert

### Manuelle Kalenderverwaltung

Ich möchte selbst Zeiträume im Kalender anlegen können, auch ohne Besucheranfrage. Zum Beispiel:

* Eigene Reise / Urlaub
* Bereits privat geplanter Besuch
* Blockierter Zeitraum
* Vielleicht auch "nur bedingt verfügbar"

Diese Einträge sollen im Kalender mit eigener Farbe oder Kennzeichnung erscheinen.

## Logik und Regeln

### Verfügbarkeitslogik

Nicht jeder Zeitraum soll anfragbar sein. Die App soll prüfen:

* Liegt der gewünschte Zeitraum in einem blockierten oder verreisten Zeitraum?
* Überschneidet sich der gewünschte Zeitraum mit einem bereits bestätigten Besuch?
* Sind doppelte oder sich überschneidende Buchungen erlaubt oder nicht?

Standardmäßig sollen Überschneidungen nicht erlaubt sein, außer ich entscheide später, dass mehrere Gäste parallel möglich sind.

### Anfrage Status

Es soll mindestens diese Status geben:

* pending
* approved
* rejected
* cancelled, optional

### Datumslogik

Die Auswahl soll auf Tagesbasis erfolgen. Uhrzeiten sind zunächst nicht nötig. Fokus ist auf Übernachtungs bzw. Besuchszeiträumen.

## Design und UX Anforderungen

Die App soll modern, clean und hochwertig wirken. Nicht technisch oder wie ein langweiliges Verwaltungstool, sondern eher wie ein schönes kleines Buchungsportal.

Wichtige Designprinzipien:

* Minimalistisch
* Sehr intuitiv
* Freundlich
* Gut lesbar
* Mobile first oder mindestens stark mobil optimiert
* Kalender klar verständlich
* Saubere Farbsemantik für verfügbare und blockierte Zeiträume

Wünschenswert wäre ein Look, der ein bisschen zwischen persönlichem Dashboard und Boutique Booking Experience liegt.

## Empfohlene Nutzerführung

### Besucher Flow

1. Besucher öffnet die Seite
2. Sieht direkt den Kalender
3. Erkennt freie und blockierte Zeiträume
4. Wählt einen anfragbaren Zeitraum
5. Füllt das Formular aus
6. Sendet die Anfrage ab
7. Erhält Bestätigung, dass die Anfrage eingegangen ist

### Admin Flow

1. Ich logge mich ein
2. Sehe offene Anfragen im Dashboard
3. Öffne eine Anfrage
4. Prüfe Zeitraum und Infos
5. Bestätige oder lehne ab
6. Kalender wird automatisch aktualisiert

## Technische Anforderungen

Ich bin offen für einen modernen, einfach wartbaren Stack. Die App soll sauber gebaut werden und später erweiterbar sein.

### Möglicher Tech Stack

Empfehlung, falls sinnvoll:

* Frontend: Next.js oder React
* UI: Tailwind CSS
* Kalenderkomponente: FullCalendar oder eine moderne React Calendar Lösung
* Backend: Supabase oder Firebase oder eigenes Backend mit Node.js
* Datenbank: PostgreSQL, falls Supabase genutzt wird
* Auth für Admin: Supabase Auth oder NextAuth
* E Mail Benachrichtigungen: Resend, SendGrid oder ähnliche Lösung
* Deployment: Vercel

Wenn der KI Agent einen besseren pragmatischen Stack empfiehlt, kann er diesen auch wählen, solange er schnell umsetzbar und sauber skalierbar ist.

## Datenmodell

Es soll mindestens folgende Datenstrukturen geben:

### Users / Admin

* id
* email
* password hash oder Auth Provider
* role

### Availability Blocks / Calendar Entries

* id
* type, zum Beispiel travel, guest, blocked, custom
* title
* start_date
* end_date
* notes
* created_by
* linked_request_id, optional

### Visit Requests

* id
* name
* email
* phone, optional
* guest_count
* message
* request_type, optional
* start_date
* end_date
* status
* created_at
* reviewed_at, optional
* admin_notes, optional

## Gewünschte Features in Version 1

Für die erste Version reicht ein sauberer MVP mit diesen Kernfunktionen:

* Öffentliche Kalenderansicht
* Zeitraumsauswahl
* Anfrageformular
* Speicherung von Anfragen
* Admin Login
* Admin Dashboard
* Anfrage bestätigen / ablehnen
* Manuelle Kalenderblöcke anlegen
* Kalenderansicht im Admin Bereich
* Sauberes responsives Design

## Optionale Features für spätere Versionen

Falls sinnvoll, kann die App schon so aufgebaut werden, dass später folgende Features ergänzt werden können:

* Automatische E Mail Benachrichtigungen
* iCal oder Google Calendar Sync
* Mehrsprachigkeit, zum Beispiel Deutsch und Englisch
* Blackout Regeln, zum Beispiel Mindestaufenthalt oder Vorlaufzeit
* Warteliste
* Besucher Upload von Zusatzinfos
* Notizen für interne Planung
* Filter nach Besuchsart
* Push Benachrichtigungen
* Exportfunktion
* Gästehistorie

## Wichtige Anforderungen an den KI Agenten

Bitte entwickle die App mit Fokus auf:

* klare saubere Architektur
* modernes UI
* mobile Optimierung
* verständliche Kalenderlogik
* einfache Admin Verwaltung
* gute UX
* sauber strukturierter Code
* Erweiterbarkeit für spätere Features

Bitte denke das Projekt wie ein echtes Produkt und nicht nur wie eine technische Demo.

## Erwartetes Ergebnis vom KI Agenten

Ich möchte, dass auf Basis dieses Briefings folgendes erstellt wird:

1. Eine durchdachte Produktstruktur
2. Eine Empfehlung für den Tech Stack
3. Eine saubere Seitenstruktur
4. Ein Datenmodell
5. Ein UI Konzept
6. Ein Umsetzungsplan für den MVP
7. Anschließend idealerweise direkt die Entwicklung der App

## Tonalität der App

Die App soll persönlich, freundlich und vertrauenswürdig wirken. Sie ist kein Hotelbuchungssystem und keine förmliche Business App, sondern ein privates Planungsportal mit hochwertigem Look.

## Kurzfassung in einem Satz

Ich brauche eine moderne Web App, in der Besucher meine Verfügbarkeit in einem Kalender sehen, einen Besuchszeitraum anfragen können und ich diese Anfragen anschließend im Admin Bereich bestätigen oder ablehnen kann.

Wenn du willst, formuliere ich dir das direkt noch in einer Version um, die perfekt als Prompt für Lovable, Replit Agent, v0 oder Bolt geeignet ist.


---
Für **diese Webapp** brauchst du im Kern nur vier Dinge:

**1. Hosting für die App**
Dort läuft dein Frontend und deine Serverlogik. Für so ein Projekt ist Vercel sehr naheliegend. Vercel hat einen kostenlosen Hobby Plan für persönliche Projekte, der für einen MVP oft reicht. Der Pro Plan startet bei **20 USD pro Monat** plus eventuelle Mehrnutzung. ([Vercel][1])

**2. Datenbank + Auth + API**
Damit speicherst du Reisezeiten, Besuchsanfragen, Status, Admin Login usw. Supabase passt dafür sehr gut. Es gibt einen Free Plan zum Starten und der Pro Plan startet bei **25 USD pro Monat**. Supabase sagt außerdem, dass zusätzliche Projekte in einer bezahlten Organisation weitere Compute Kosten verursachen können, also man sollte idealerweise erstmal bei **einem Projekt** bleiben. ([Supabase][2])

**3. Domain**
Du brauchst eine eigene Domain nur dann, wenn du nicht auf einer Standard URL wie `deineapp.vercel.app` laufen willst. Eine `.com` Domain kostet bei Namecheap aktuell etwa **11.28 USD im ersten Jahr** und **18.48 USD bei Verlängerung**. Eine `.eu` liegt dort aktuell bei etwa **6.98 USD im ersten Jahr** und **10.98 USD bei Verlängerung**. ([namecheap.com][3])

**4. Optional E Mail Versand**
Nur nötig, wenn Besucher automatische Bestätigungen oder Absagen per Mail bekommen sollen. Resend hat einen kostenlosen Plan mit **100 E Mails pro Tag**, 1 Domain und 1 Webhook Endpoint. Der bezahlte Plan hat laut Resend keine tägliche Grenze und Overages sind möglich; ein offizielles Beispiel zeigt **50.000 E Mails für 20 USD** im Pro Plan und danach **0.90 USD pro zusätzliche 1.000 E Mails**. Für deine App dürfte der Free Plan anfangs meist locker reichen. ([resend.com][4])

## Was dich das realistisch kosten wird

### Variante 1: MVP so günstig wie möglich

Wenn du klein startest, reicht oft:

* Vercel Hobby: **0 USD**
* Supabase Free: **0 USD**
* Resend Free: **0 USD**
* Domain: **ca. 7 bis 12 USD pro Jahr** je nach Endung

Dann liegst du effektiv bei ungefähr **0 bis 1 USD pro Monat**, plus Domain umgelegt, also sehr wenig. ([Vercel][1])

### Variante 2: Solider produktiver Start

Wenn du es direkt etwas stabiler aufsetzen willst:

* Vercel Pro: **20 USD / Monat**
* Supabase Pro: **25 USD / Monat**
* Domain: umgelegt grob **1 USD / Monat**
* Resend: oft erst mal **0 USD**, später eventuell **20 USD / Monat**, wenn du viele Mails verschickst

Dann bist du realistisch bei etwa **46 USD / Monat** ohne bezahlten Maildienst oder etwa **66 USD / Monat**, falls du auch Resend Pro brauchst. ([Vercel][1])

### Variante 3: Was ich dir für den Anfang empfehlen würde

Für deine App würde ich erstmal so starten:

* **Vercel Hobby**
* **Supabase Free**
* **eigene Domain**
* **Resend Free nur falls E Mails nötig sind**

Das reicht sehr wahrscheinlich für den Anfang völlig aus, solange du keine hohen Besucherzahlen hast und die App eher privat oder halbprivat genutzt wird. Später kannst du immer noch auf Pro hochgehen. Vercel und Supabase sind genau für diesen Weg gedacht: klein starten, später hochskalieren. ([Vercel][1])

## Was du technisch konkret besitzen oder einrichten musst

Du brauchst also am Ende:

* einen **GitHub Account** für den Code
* einen **Vercel Account** fürs Deployment
* einen **Supabase Account** für Datenbank und Admin Login
* optional einen **Resend Account** für E Mails
* optional eine **eigene Domain**

Mehr brauchst du für diese Art Webapp nicht. SSL ist bei Vercel standardmäßig dabei, und DNS kannst du über deinen Domain Registrar setzen. Vercel beschreibt automatische Deployments und den globalen CDN schon im Hobby Plan. ([Vercel][1])

Mein ehrlicher Rat: **Für deinen Use Case würde ich nicht sofort Geld ausgeben**, außer vielleicht für die Domain. Erst wenn die App wirklich genutzt wird oder du Dinge wie bessere Limits, Team Features oder garantierte Performance willst, lohnt sich Pro. ([Vercel][1])

Ich kann dir als Nächstes auch direkt eine **klare Empfehlung mit genauem Stack** geben, also z.B. *nimm Vercel + Supabase + Resend*, inklusive Begründung, warum das für deine App die beste Kombination ist.

[1]: https://vercel.com/pricing "Vercel Pricing: Hobby, Pro, and Enterprise plans"
[2]: https://supabase.com/pricing?utm_source=chatgpt.com "Pricing & Fees"
[3]: https://www.namecheap.com/domains/registration/gtld/com/ ".com Domain Registration | Buy a .com Domain Name - Namecheap"
[4]: https://resend.com/pricing "Pricing · Resend"