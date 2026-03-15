import { Resend } from 'resend'
import { render } from '@react-email/components'
import { NeueRegistrierung } from './templates/NeueRegistrierung'
import { AccountFreigeschaltet } from './templates/AccountFreigeschaltet'
import { NeueAnfrage } from './templates/NeueAnfrage'
import { AnfrageBestaetigt } from './templates/AnfrageBestaetigt'
import { AnfrageAbgelehnt } from './templates/AnfrageAbgelehnt'
import { AnfrageStorniert } from './templates/AnfrageStorniert'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL!
const ADMIN = process.env.ADMIN_EMAIL!

async function send(to: string, subject: string, html: string) {
  try {
    await resend.emails.send({ from: FROM, to, subject, html })
  } catch (err) {
    console.error('[email] Failed to send to', to, err)
  }
}

export async function sendNeueRegistrierung(data: { name: string; email: string }) {
  const html = await render(NeueRegistrierung(data))
  await send(ADMIN, `Neuer Nutzer: ${data.name}`, html)
}

export async function sendAccountFreigeschaltet(data: { name: string; email: string }) {
  const html = await render(AccountFreigeschaltet({ name: data.name }))
  await send(data.email, 'Dein OpenStay-Account wurde freigeschaltet', html)
}

export async function sendNeueAnfrage(data: {
  name: string; email: string; start_date: string; end_date: string; guest_count: number; message: string
}) {
  const html = await render(NeueAnfrage(data))
  await send(ADMIN, `Neue Besuchsanfrage von ${data.name}`, html)
}

export async function sendAnfrageBestaetigt(data: {
  name: string; email: string; start_date: string; end_date: string
}) {
  const html = await render(AnfrageBestaetigt(data))
  await send(data.email, 'Dein Besuch wurde bestätigt!', html)
}

export async function sendAnfrageAbgelehnt(data: {
  name: string; email: string; start_date: string; end_date: string
}) {
  const html = await render(AnfrageAbgelehnt(data))
  await send(data.email, 'Deine Besuchsanfrage', html)
}

export async function sendAnfrageStorniert(data: {
  name: string; email: string; start_date: string; end_date: string
}) {
  const html = await render(AnfrageStorniert(data))
  await send(data.email, 'Besuch storniert', html)
}
