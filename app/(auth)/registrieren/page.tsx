import { RegistrierungForm } from '@/components/auth/RegistrierungForm'

export default function RegistrierungPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">OpenStay</h1>
          <p className="text-white/60 mt-1 text-sm">Neuen Account erstellen</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <RegistrierungForm />
        </div>
      </div>
    </div>
  )
}
