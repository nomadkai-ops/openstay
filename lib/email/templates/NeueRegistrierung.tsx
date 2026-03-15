import { Html, Head, Body, Container, Heading, Text } from '@react-email/components'

interface Props {
  name: string
  email: string
}

export function NeueRegistrierung({ name, email }: Props) {
  return (
    <Html lang="de">
      <Head />
      <Body style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#fafaf9', padding: '40px 0' }}>
        <Container style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px', maxWidth: '480px', margin: '0 auto', border: '1px solid #e7e5e4' }}>
          <Heading style={{ fontSize: '20px', color: '#1c1917', marginBottom: '8px' }}>Neuer Nutzer wartet auf Freischaltung</Heading>
          <Text style={{ color: '#57534e', fontSize: '14px' }}>
            <strong>{name}</strong> ({email}) hat sich bei OpenStay registriert und wartet auf deine Freischaltung.
          </Text>
          <Text style={{ color: '#57534e', fontSize: '14px' }}>
            Melde dich im Admin-Bereich an, um den Account freizuschalten.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
