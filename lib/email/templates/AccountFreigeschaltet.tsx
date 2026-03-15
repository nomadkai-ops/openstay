import { Html, Head, Body, Container, Heading, Text } from '@react-email/components'

interface Props {
  name: string
}

export function AccountFreigeschaltet({ name }: Props) {
  return (
    <Html lang="de">
      <Head />
      <Body style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#fafaf9', padding: '40px 0' }}>
        <Container style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px', maxWidth: '480px', margin: '0 auto', border: '1px solid #e7e5e4' }}>
          <Heading style={{ fontSize: '20px', color: '#1c1917', marginBottom: '8px' }}>Du wurdest freigeschaltet!</Heading>
          <Text style={{ color: '#57534e', fontSize: '14px' }}>Hallo {name},</Text>
          <Text style={{ color: '#57534e', fontSize: '14px' }}>
            dein OpenStay-Account wurde freigeschaltet. Du kannst dich jetzt anmelden und den Kalender einsehen.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
