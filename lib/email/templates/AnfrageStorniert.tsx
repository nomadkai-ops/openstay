import { Heading, Text } from '@react-email/components'
import { EmailLayout } from './EmailLayout'
import { formatDateRange } from '@/lib/utils/datum'

interface Props { name: string; email: string; start_date: string; end_date: string }

export function AnfrageStorniert({ name, start_date, end_date }: Props) {
  return (
    <EmailLayout preview="Besuch storniert">
      <Heading style={h1}>Besuch storniert</Heading>
      <Text style={body}>Hallo {name},</Text>
      <Text style={body}>
        dein bestätigter Besuch für{' '}
        <strong>{formatDateRange(start_date, end_date)}</strong> wurde leider storniert.
        Es tut mir leid für die Unannehmlichkeiten.
      </Text>
      <Text style={body}>
        Bei Fragen antworte einfach auf diese E-Mail.
      </Text>
    </EmailLayout>
  )
}

const h1: React.CSSProperties = { fontSize: '20px', fontWeight: '700', color: '#1e1b4b', marginBottom: '12px' }
const body: React.CSSProperties = { fontSize: '15px', color: '#475569', lineHeight: '1.6', margin: '0 0 12px' }
