import {
  Html, Head, Body, Container, Section, Text, Hr, Link, Preview
} from '@react-email/components'

interface Props {
  children: React.ReactNode
  preview?: string
}

const APP_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://openstay.app'

export function EmailLayout({ children, preview }: Props) {
  return (
    <Html lang="de">
      <Head />
      {preview && <Preview>{preview}</Preview>}
      <Body style={bodyStyle}>
        {/* Brand banner */}
        <Section style={bannerStyle}>
          <Text style={brandStyle}>OpenStay</Text>
        </Section>

        {/* White content container */}
        <Container style={containerStyle}>
          {children}
        </Container>

        {/* Footer */}
        <Container style={footerContainerStyle}>
          <Hr style={hrStyle} />
          <Text style={footerStyle}>
            OpenStay · Private Besuchsplanung ·{' '}
            <Link href={APP_URL} style={footerLinkStyle}>
              {APP_URL.replace(/^https?:\/\//, '')}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const bodyStyle: React.CSSProperties = {
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  backgroundColor: '#f0f0ff',
  padding: '40px 0',
}

const bannerStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%)',
  borderRadius: '12px 12px 0 0',
  padding: '28px 32px',
  maxWidth: '520px',
  margin: '0 auto',
}

const brandStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: '800',
  color: '#ffffff',
  letterSpacing: '-0.3px',
  margin: '0',
}

const containerStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '0 0 12px 12px',
  padding: '32px 32px 36px',
  maxWidth: '520px',
  margin: '0 auto',
  border: '1px solid #e0e7ff',
  borderTop: 'none',
}

const footerContainerStyle: React.CSSProperties = {
  maxWidth: '520px',
  margin: '0 auto',
  padding: '0 32px',
}

const hrStyle: React.CSSProperties = {
  borderColor: '#e0e7ff',
  margin: '16px 0',
}

const footerStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#94a3b8',
  textAlign: 'center',
  margin: '0',
}

const footerLinkStyle: React.CSSProperties = {
  color: '#6366f1',
}
