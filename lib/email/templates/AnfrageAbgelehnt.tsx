import { Html, Head, Body, Container, Heading, Text } from '@react-email/components'
import { formatDateRange } from '@/lib/utils/datum'

interface Props { name: string; email: string; start_date: string; end_date: string }

export function AnfrageAbgelehnt({ name, start_date, end_date }: Props) {
  return (
    <Html lang="de">
      <Head />
      <Body style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#fafaf9', padding: '40px 0' }}>
        <Container style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px', maxWidth: '480px', margin: '0 auto', border: '1px solid #e7e5e4' }}>
          <Heading style={{ fontSize: '20px', color: '#1c1917', marginBottom: '8px' }}>Anfrage abgelehnt</Heading>
          <Text style={{ color: '#57534e', fontSize: '14px' }}>Hallo {name},</Text>
          <Text style={{ color: '#57534e', fontSize: '14px' }}>
            leider kann ich deinen Besuchswunsch für <strong>{formatDateRange(start_date, end_date)}</strong> in diesem Zeitraum nicht bestätigen. Ich hoffe, wir finden bald einen anderen passenden Termin!
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
