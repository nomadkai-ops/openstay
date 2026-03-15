import { Html, Head, Body, Container, Heading, Text, Section } from '@react-email/components'
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
    <Html lang="de">
      <Head />
      <Body style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#fafaf9', padding: '40px 0' }}>
        <Container style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px', maxWidth: '480px', margin: '0 auto', border: '1px solid #e7e5e4' }}>
          <Heading style={{ fontSize: '20px', color: '#1c1917', marginBottom: '8px' }}>Neue Besuchsanfrage</Heading>
          <Section style={{ backgroundColor: '#f5f5f4', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
            <Text style={{ color: '#1c1917', fontSize: '14px', margin: '0 0 4px 0' }}><strong>Von:</strong> {name} ({email})</Text>
            <Text style={{ color: '#1c1917', fontSize: '14px', margin: '0 0 4px 0' }}><strong>Zeitraum:</strong> {formatDateRange(start_date, end_date)}</Text>
            <Text style={{ color: '#1c1917', fontSize: '14px', margin: '0 0 4px 0' }}><strong>Personen:</strong> {guest_count}</Text>
            <Text style={{ color: '#1c1917', fontSize: '14px', margin: '0' }}><strong>Nachricht:</strong> {message}</Text>
          </Section>
          <Text style={{ color: '#57534e', fontSize: '14px' }}>
            Melde dich im Admin-Bereich an, um die Anfrage zu bestätigen oder abzulehnen.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
