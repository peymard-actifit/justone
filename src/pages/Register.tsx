import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  const generateUsername = (fullName: string) => {
    const parts = fullName.trim().split(' ')
    if (parts.length < 2) return ''
    const first = parts[0].charAt(0).toLowerCase()
    const last = parts[parts.length - 1].toLowerCase().replace(/[^a-z]/g, '')
    return `${first}${last}`
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fullName = e.target.value
    setFormData({
      ...formData,
      fullName,
      username: generateUsername(fullName),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error('Register API error:', data)
        setError(data.error || data.details || 'Une erreur est survenue')
        return
      }

      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (error) {
      console.error('Register fetch error:', error)
      setError(`Erreur de connexion au serveur: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md relative z-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-dark-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        <div className="card animate-slide-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">J1</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Créer un compte</h1>
            <p className="text-dark-400">Commencez à gérer vos CV professionnels</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName">Nom complet</label>
              <input
                type="text"
                id="fullName"
                placeholder="Patrick Eymard"
                value={formData.fullName}
                onChange={handleNameChange}
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="email">Email professionnel</label>
              <input
                type="email"
                id="email"
                placeholder="patrick.eymard@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="username">Identifiant</label>
              <input
                type="text"
                id="username"
                placeholder="peymard"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                autoComplete="username"
              />
              <p className="text-dark-500 text-xs mt-1">
                Généré automatiquement, vous pouvez le modifier
              </p>
            </div>

            <div>
              <label htmlFor="password">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Minimum 6 caractères"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Retapez votre mot de passe"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                autoComplete="new-password"
              />
              {formData.password && formData.confirmPassword && (
                <p className={`text-xs mt-1 ${
                  formData.password === formData.confirmPassword 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {formData.password === formData.confirmPassword 
                    ? '✓ Les mots de passe correspondent' 
                    : '✗ Les mots de passe ne correspondent pas'}
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Création...
                </span>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Créer mon compte
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-dark-400 text-sm mb-3">Déjà inscrit ?</p>
            <Link to="/login" className="btn btn-ghost text-sm">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

