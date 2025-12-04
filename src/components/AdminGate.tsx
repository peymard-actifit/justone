import { useState } from 'react'
import { Lock } from 'lucide-react'

const ADMIN_CODE = '12411241'

interface AdminGateProps {
  children: React.ReactNode
  onActivate: () => void
}

export default function AdminGate({ children, onActivate }: AdminGateProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isActive, setIsActive] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (code === ADMIN_CODE) {
      setIsActive(true)
      onActivate()
      setError('')
    } else {
      setError('Code incorrect')
      setCode('')
    }
  }

  if (isActive) {
    return <>{children}</>
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="card w-full max-w-md animate-scale-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Mode Administrateur</h2>
          <p className="text-dark-400 text-sm">
            Entrez le code administrateur pour accéder aux paramètres avancés
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-code" className="block text-sm font-medium mb-2">
              Code administrateur
            </label>
            <input
              type="password"
              id="admin-code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setError('')
              }}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white text-center text-2xl tracking-widest"
              maxLength={8}
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full">
            Accéder au mode administrateur
          </button>
        </form>
      </div>
    </div>
  )
}

