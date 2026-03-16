import { logout } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'

export default function PendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 shadow-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">OpenStay</h1>
            <p className="text-white/60 text-sm mt-1">Freischaltung ausstehend</p>
          </div>
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto">
              <span className="text-2xl" aria-hidden="true">⏳</span>
            </div>
            <p className="text-white font-medium">Dein Account wird geprüft</p>
            <p className="text-white/60 text-sm leading-relaxed">
              Deine Registrierung ist eingegangen. Du erhältst eine E-Mail, sobald dein Account freigeschaltet wurde.
            </p>
          </div>
          <form action={logout}>
            <Button
              type="submit"
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              Abmelden
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
