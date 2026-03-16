import { Heading, Text, Button } from '@react-email/components'
import { EmailLayout } from './EmailLayout'
import { formatDateRange } from '@/lib/utils/datum'

interface Props { name: string; email: string; start_date: string; end_date: string }

const APP_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://openstay.app'

export function AnfrageBestaetigt({ name, start_date, end_date }: Props) {
  return (
    <EmailLayout preview="Dein Besuch wurde bestätigt!">
      <Heading style={h1}>Besuch bestätigt! 🎉</Heading>
      <Text style={body}>Hallo {name},</Text>
      <Text style={body}>
        deine Besuchsanfrage wurde bestätigt. Ich freue mich auf deinen Besuch!
      </Text>
      <div style={dateBadge}>
        <Text style={dateLabel}>Dein Zeitraum</Text>
        <Text style={dateText}>{formatDateRange(start_date, end_date)}</Text>
      </div>
      <Button href={`${APP_URL}/kalender/anfragen`} style={ctaButton}>
        Meine Anfragen anzeigen →
      </Button>
    </EmailLayout>
  )
}

const h1: React.CSSProperties = { fontSize: '20px', fontWeight: '700', color: '#1e1b4b', marginBottom: '12px' }
const body: React.CSSProperties = { fontSize: '15px', color: '#475569', lineHeight: '1.6', margin: '0 0 12px' }
const dateBadge: React.CSSProperties = { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px 20px', margin: '16px 0' }
const dateLabel: React.CSSProperties = { fontSize: '11px', fontWeight: '600', color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }
const dateText: React.CSSProperties = { fontSize: '16px', fontWeight: '700', color: '#14532d', margin: '0' }
const ctaButton: React.CSSProperties = {
  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '14px',
  textDecoration: 'none',
  display: 'inline-block',
  marginTop: '8px',
}
