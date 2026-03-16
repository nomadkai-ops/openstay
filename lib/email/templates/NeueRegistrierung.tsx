import { Heading, Text } from '@react-email/components'
import { EmailLayout } from './EmailLayout'

interface Props { name: string; email: string }

export function NeueRegistrierung({ name, email }: Props) {
  return (
    <EmailLayout preview={`Neue Registrierung: ${name}`}>
      <Heading style={h1}>Neue Registrierung</Heading>
      <Text style={body}>Es hat sich ein neuer Nutzer registriert:</Text>
      <div style={infoBox}>
        <Text style={infoRow}><strong>Name:</strong> {name}</Text>
        <Text style={infoRow}><strong>E-Mail:</strong> {email}</Text>
      </div>
      <Text style={body}>
        Melde dich im Admin-Bereich an, um den Account freizuschalten.
      </Text>
    </EmailLayout>
  )
}

const h1: React.CSSProperties = { fontSize: '20px', fontWeight: '700', color: '#1e1b4b', marginBottom: '12px' }
const body: React.CSSProperties = { fontSize: '15px', color: '#475569', lineHeight: '1.6', margin: '0 0 12px' }
const infoBox: React.CSSProperties = { background: '#f0f0ff', borderRadius: '8px', padding: '16px 20px', margin: '16px 0' }
const infoRow: React.CSSProperties = { fontSize: '14px', color: '#1e1b4b', margin: '0 0 4px' }
