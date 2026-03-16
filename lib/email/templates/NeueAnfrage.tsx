import { Heading, Text } from '@react-email/components'
import { EmailLayout } from './EmailLayout'
import { formatDateRange } from '@/lib/utils/datum'

interface Props {
  name: string
  email: string
  start_date: string
  end_date: string
  guest_count: number
  message: string
}

export function NeueAnfrage({ name, email, start_date, end_date, guest_count, message }: Props) {
  return (
    <EmailLayout preview={`Neue Besuchsanfrage von ${name}`}>
      <Heading style={h1}>Neue Besuchsanfrage</Heading>
      <Text style={body}>Es ist eine neue Anfrage eingegangen:</Text>
      <div style={infoBox}>
        <Text style={infoRow}><strong>Name:</strong> {name}</Text>
        <Text style={infoRow}><strong>E-Mail:</strong> {email}</Text>
        <Text style={infoRow}><strong>Zeitraum:</strong> {formatDateRange(start_date, end_date)}</Text>
        <Text style={infoRow}><strong>Personen:</strong> {guest_count}</Text>
      </div>
      <Text style={label}>Nachricht</Text>
      <div style={messageBox}>
        <Text style={messageText}>{message}</Text>
      </div>
    </EmailLayout>
  )
}

const h1: React.CSSProperties = { fontSize: '20px', fontWeight: '700', color: '#1e1b4b', marginBottom: '12px' }
const body: React.CSSProperties = { fontSize: '15px', color: '#475569', lineHeight: '1.6', margin: '0 0 12px' }
const infoBox: React.CSSProperties = { background: '#f0f0ff', borderRadius: '8px', padding: '16px 20px', margin: '16px 0' }
const infoRow: React.CSSProperties = { fontSize: '14px', color: '#1e1b4b', margin: '0 0 4px' }
const label: React.CSSProperties = { fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '16px 0 4px' }
const messageBox: React.CSSProperties = { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px' }
const messageText: React.CSSProperties = { fontSize: '14px', color: '#475569', margin: '0', lineHeight: '1.6' }
