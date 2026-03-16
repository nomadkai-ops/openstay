import { Heading, Text, Button } from '@react-email/components'
import { EmailLayout } from './EmailLayout'

interface Props { name: string }

const APP_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://openstay.app'

export function AccountFreigeschaltet({ name }: Props) {
  return (
    <EmailLayout preview="Dein OpenStay-Account wurde freigeschaltet!">
      <Heading style={h1}>Du wurdest freigeschaltet! 🎉</Heading>
      <Text style={body}>Hallo {name},</Text>
      <Text style={body}>
        dein OpenStay-Account wurde freigeschaltet. Du kannst dich jetzt anmelden und den Kalender einsehen, um deine Besuchsanfrage zu stellen.
      </Text>
      <Button href={`${APP_URL}/kalender`} style={ctaButton}>
        Zum Kalender →
      </Button>
    </EmailLayout>
  )
}

const h1: React.CSSProperties = { fontSize: '20px', fontWeight: '700', color: '#1e1b4b', marginBottom: '12px' }
const body: React.CSSProperties = { fontSize: '15px', color: '#475569', lineHeight: '1.6', margin: '0 0 12px' }
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
