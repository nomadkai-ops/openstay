import { RegistrierungForm } from '@/components/auth/RegistrierungForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegistrierenPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Account erstellen</CardTitle>
          <CardDescription>Registriere dich für OpenStay</CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrierungForm />
        </CardContent>
      </Card>
    </main>
  )
}
