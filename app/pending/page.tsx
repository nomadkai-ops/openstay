import { logout } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PendingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
            <span className="text-2xl">⏳</span>
          </div>
          <CardTitle className="text-xl">Freischaltung ausstehend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-stone-500 text-sm">
            Dein Account wartet noch auf die Freischaltung durch den Admin.
            Du erhältst eine E-Mail, sobald du freigeschaltet wurdest.
          </p>
          <form action={logout}>
            <Button variant="outline" type="submit" className="w-full">
              Abmelden
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
