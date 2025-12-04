import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, LogOut, Edit as EditIcon, Sparkles } from 'lucide-react'
import NavigationBar from '../components/NavigationBar'
import DataEditor from '../components/DataEditor'
import AdminGate from '../components/AdminGate'
import type { DataField, UserProfile } from '../types/database'

interface User {
  id: string
  username: string
  fullName: string
  email: string
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showEditData, setShowEditData] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    loadProfile(parsedUser.id)
  }, [navigate])

  const loadProfile = async (userId: string) => {
    try {
      const res = await fetch(`/api/profile/${userId}`)
      if (res.ok) {
        const data = await res.json()
        setProfile(data.profile)
      } else {
        // Créer un profil par défaut
        const defaultProfile: UserProfile = {
          id: Date.now().toString(),
          userId,
          baseLanguage: 'fr',
          fields: [],
          tags: [],
          metadata: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setProfile(defaultProfile)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveFields = async (fields: DataField[]) => {
    if (!profile || !user) return

    const updatedProfile: UserProfile = {
      ...profile,
      fields,
      updatedAt: new Date().toISOString(),
    }

    try {
      await fetch(`/api/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile),
      })
      setProfile(updatedProfile)
      setShowEditData(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    }
  }

  const handleAddField = (field: DataField) => {
    if (!profile) return
    setProfile({
      ...profile,
      fields: [...profile.fields, field],
    })
  }

  const handleDeleteField = (fieldId: string) => {
    if (!profile) return
    setProfile({
      ...profile,
      fields: profile.fields.filter(f => f.id !== fieldId),
    })
  }

  const logout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <div className="animated-bg" />
      <div className="grid-bg" />

      {/* Header */}
      <header className="relative z-10 px-6 py-4 border-b border-white/5 bg-dark-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">J1</span>
            </div>
            <span className="text-xl font-bold">
              Just<span className="text-gradient">1</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Bouton Édition */}
            <button
              onClick={() => setShowEditData(!showEditData)}
              className={`btn ${showEditData ? 'btn-primary' : 'btn-secondary'}`}
            >
              <EditIcon className="w-4 h-4" />
              Édition
            </button>

            {/* Bouton IA */}
            <button
              onClick={() => navigate('/ai')}
              className="btn btn-secondary"
            >
              <Sparkles className="w-4 h-4" />
              IA
            </button>

            {/* Menu utilisateur */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>

              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-56 card py-2 z-20 animate-scale-in">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="font-medium text-sm">{user?.fullName}</p>
                      <p className="text-xs text-dark-400">{user?.username}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        // TODO: Ouvrir modal changement password
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-white/5"
                    >
                      Modifier le mot de passe
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        setIsAdmin(true)
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-white/5"
                    >
                      Mode administrateur
                    </button>
                    <div className="border-t border-white/10 my-1" />
                    <button
                      onClick={logout}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 text-red-400"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Déconnexion
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <NavigationBar />

      {/* Main Content */}
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {showEditData ? (
            <AdminGate onActivate={() => {}}>
              <DataEditor
                fields={profile?.fields || []}
                baseLanguage={profile?.baseLanguage || 'fr'}
                onSave={handleSaveFields}
                onAddField={handleAddField}
                onDeleteField={handleDeleteField}
              />
            </AdminGate>
          ) : (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Bienvenue, <span className="text-gradient">{user?.fullName.split(' ')[0]}</span>
                </h1>
                <p className="text-dark-400">
                  Gérez vos données personnelles et créez vos CVs
                </p>
              </div>

              {/* Stats */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="card">
                  <div className="text-2xl font-bold mb-1">{profile?.fields.length || 0}</div>
                  <div className="text-sm text-dark-400">Champs de données</div>
                </div>
                <div className="card">
                  <div className="text-2xl font-bold mb-1">{profile?.tags.length || 0}</div>
                  <div className="text-sm text-dark-400">Tags</div>
                </div>
                <div className="card">
                  <div className="text-2xl font-bold mb-1">
                    {profile?.fields.reduce((acc, f) => acc + f.values.length, 0) || 0}
                  </div>
                  <div className="text-sm text-dark-400">Traductions</div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowEditData(true)}
                    className="btn btn-secondary text-left justify-start"
                  >
                    <EditIcon className="w-4 h-4" />
                    Éditer mes données
                  </button>
                  <button
                    onClick={() => navigate('/formats')}
                    className="btn btn-secondary text-left justify-start"
                  >
                    Voir les formats de CV
                  </button>
                  <button
                    onClick={() => navigate('/export')}
                    className="btn btn-secondary text-left justify-start"
                  >
                    Exporter mes données
                  </button>
                  <button
                    onClick={() => navigate('/ai')}
                    className="btn btn-secondary text-left justify-start"
                  >
                    <Sparkles className="w-4 h-4" />
                    Assistant IA
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Admin Gate */}
      {isAdmin && (
        <AdminGate onActivate={() => setIsAdmin(false)}>
          <div className="fixed inset-0 z-50 bg-dark-900/95 p-8 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Mode Administrateur</h2>
              <div className="card">
                <p className="text-dark-400 mb-4">
                  Vous avez accès aux paramètres avancés : tags, langues, formats de CV, etc.
                </p>
                <button onClick={() => setIsAdmin(false)} className="btn btn-primary">
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </AdminGate>
      )}
    </div>
  )
}
