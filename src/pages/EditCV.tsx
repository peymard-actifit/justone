import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save, User, Briefcase, GraduationCap, Star, Plus, Trash2, ChevronRight } from 'lucide-react'

interface CVData {
  id: string
  name: string
  language: string
  identity: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address?: string
    city?: string
    postalCode?: string
    country?: string
  }
  title?: string
  subtitle?: string
  summary?: string
  experiences: Array<{ id: string; company: string; position: string; startDate: string; endDate?: string; description: string }>
  education: Array<{ id: string; school: string; degree: string; field?: string; endDate?: string }>
  skills: Array<{ id: string; name: string; category?: string }>
}

type Step = 'identity' | 'title' | 'skills' | 'experience' | 'education'

const steps: { id: Step; label: string; icon: typeof User }[] = [
  { id: 'identity', label: 'Identité', icon: User },
  { id: 'title', label: 'Titre & Résumé', icon: Star },
  { id: 'skills', label: 'Compétences', icon: Star },
  { id: 'experience', label: 'Expériences', icon: Briefcase },
  { id: 'education', label: 'Formation', icon: GraduationCap },
]

export default function EditCV() {
  const navigate = useNavigate()
  const { id: cvId } = useParams()
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [cv, setCV] = useState<CVData | null>(null)
  const [currentStep, setCurrentStep] = useState<Step>('identity')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { navigate('/login'); return }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    loadCV(parsedUser.id)
  }, [navigate, cvId])

  const loadCV = async (userId: string) => {
    try {
      const res = await fetch(`/api/cv/${cvId}`, { headers: { 'x-user-id': userId } })
      if (!res.ok) { navigate('/dashboard'); return }
      const data = await res.json()
      setCV(data.cv)
    } catch { console.error('Error loading CV') }
    finally { setIsLoading(false) }
  }

  const saveCV = async () => {
    if (!cv || !user) return
    setIsSaving(true)
    try {
      await fetch(`/api/cv/${cvId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify(cv),
      })
      setHasChanges(false)
    } catch { console.error('Error saving') }
    finally { setIsSaving(false) }
  }

  const updateIdentity = (field: string, value: string) => {
    if (!cv) return
    setCV({ ...cv, identity: { ...cv.identity, [field]: value } })
    setHasChanges(true)
  }

  const updateCV = (updates: Partial<CVData>) => {
    if (!cv) return
    setCV({ ...cv, ...updates })
    setHasChanges(true)
  }

  const addSkill = () => {
    if (!cv) return
    setCV({ ...cv, skills: [...cv.skills, { id: Date.now().toString(), name: '', category: '' }] })
    setHasChanges(true)
  }

  const updateSkill = (id: string, field: string, value: string) => {
    if (!cv) return
    setCV({ ...cv, skills: cv.skills.map(s => s.id === id ? { ...s, [field]: value } : s) })
    setHasChanges(true)
  }

  const removeSkill = (id: string) => {
    if (!cv) return
    setCV({ ...cv, skills: cv.skills.filter(s => s.id !== id) })
    setHasChanges(true)
  }

  const addExperience = () => {
    if (!cv) return
    setCV({ ...cv, experiences: [...cv.experiences, { id: Date.now().toString(), company: '', position: '', startDate: '', description: '' }] })
    setHasChanges(true)
  }

  const updateExperience = (id: string, field: string, value: string) => {
    if (!cv) return
    setCV({ ...cv, experiences: cv.experiences.map(e => e.id === id ? { ...e, [field]: value } : e) })
    setHasChanges(true)
  }

  const removeExperience = (id: string) => {
    if (!cv) return
    setCV({ ...cv, experiences: cv.experiences.filter(e => e.id !== id) })
    setHasChanges(true)
  }

  const addEducation = () => {
    if (!cv) return
    setCV({ ...cv, education: [...cv.education, { id: Date.now().toString(), school: '', degree: '' }] })
    setHasChanges(true)
  }

  const updateEducation = (id: string, field: string, value: string) => {
    if (!cv) return
    setCV({ ...cv, education: cv.education.map(e => e.id === id ? { ...e, [field]: value } : e) })
    setHasChanges(true)
  }

  const removeEducation = (id: string) => {
    if (!cv) return
    setCV({ ...cv, education: cv.education.filter(e => e.id !== id) })
    setHasChanges(true)
  }

  if (isLoading || !cv) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
    </div>
  }

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="relative z-10 px-6 py-4 border-b border-white/5 bg-dark-900/50 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-semibold">{cv.name}</h1>
              <p className="text-sm text-dark-400">{cv.language.toUpperCase()}</p>
            </div>
          </div>
          <button onClick={saveCV} disabled={isSaving || !hasChanges} className="btn btn-primary">
            <Save className="w-4 h-4" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </header>

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <nav className="w-64 min-h-[calc(100vh-73px)] border-r border-white/5 p-4 hidden lg:block">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all mb-1 ${
                currentStep === step.id ? 'bg-primary-500/10 text-primary-400' : 'hover:bg-white/5 text-dark-400'
              }`}
            >
              <step.icon className="w-5 h-5" />
              <span className="font-medium">{step.label}</span>
              {currentStep === step.id && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-4xl">
          {currentStep === 'identity' && (
            <div className="space-y-6 animate-fade-in">
              <div><h2 className="text-2xl font-bold mb-2">Informations Personnelles</h2></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label>Prénom</label><input type="text" value={cv.identity.firstName} onChange={(e) => updateIdentity('firstName', e.target.value)} placeholder="Patrick" /></div>
                <div><label>Nom</label><input type="text" value={cv.identity.lastName} onChange={(e) => updateIdentity('lastName', e.target.value)} placeholder="Eymard" /></div>
                <div><label>Email</label><input type="email" value={cv.identity.email} onChange={(e) => updateIdentity('email', e.target.value)} placeholder="email@example.com" /></div>
                <div><label>Téléphone</label><input type="tel" value={cv.identity.phone} onChange={(e) => updateIdentity('phone', e.target.value)} placeholder="+33 6 12 34 56 78" /></div>
                <div className="sm:col-span-2"><label>Adresse</label><input type="text" value={cv.identity.address || ''} onChange={(e) => updateIdentity('address', e.target.value)} /></div>
                <div><label>Ville</label><input type="text" value={cv.identity.city || ''} onChange={(e) => updateIdentity('city', e.target.value)} /></div>
                <div><label>Code postal</label><input type="text" value={cv.identity.postalCode || ''} onChange={(e) => updateIdentity('postalCode', e.target.value)} /></div>
              </div>
            </div>
          )}

          {currentStep === 'title' && (
            <div className="space-y-6 animate-fade-in">
              <div><h2 className="text-2xl font-bold mb-2">Titre et Résumé</h2></div>
              <div className="space-y-4">
                <div><label>Titre principal</label><input type="text" value={cv.title || ''} onChange={(e) => updateCV({ title: e.target.value })} placeholder="DIRECTEUR IT/SI" /></div>
                <div><label>Sous-titre</label><input type="text" value={cv.subtitle || ''} onChange={(e) => updateCV({ subtitle: e.target.value })} placeholder="CIO, CDO, CTO" /></div>
                <div><label>Résumé</label><textarea rows={5} value={cv.summary || ''} onChange={(e) => updateCV({ summary: e.target.value })} placeholder="Décrivez votre profil..." /></div>
              </div>
            </div>
          )}

          {currentStep === 'skills' && (
            <div className="space-y-6 animate-fade-in">
              <div><h2 className="text-2xl font-bold mb-2">Compétences</h2></div>
              <div className="space-y-3">
                {cv.skills.map((skill) => (
                  <div key={skill.id} className="card flex items-center gap-3">
                    <input type="text" placeholder="Compétence" value={skill.name} onChange={(e) => updateSkill(skill.id, 'name', e.target.value)} className="flex-1" />
                    <input type="text" placeholder="Catégorie" value={skill.category || ''} onChange={(e) => updateSkill(skill.id, 'category', e.target.value)} className="w-40" />
                    <button onClick={() => removeSkill(skill.id)} className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
              <button onClick={addSkill} className="btn btn-secondary"><Plus className="w-4 h-4" />Ajouter</button>
            </div>
          )}

          {currentStep === 'experience' && (
            <div className="space-y-6 animate-fade-in">
              <div><h2 className="text-2xl font-bold mb-2">Expériences</h2></div>
              {cv.experiences.map((exp) => (
                <div key={exp.id} className="card space-y-4">
                  <div className="flex justify-between"><span className="font-medium">Expérience</span><button onClick={() => removeExperience(exp.id)} className="text-red-400"><Trash2 className="w-4 h-4" /></button></div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label>Entreprise</label><input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} /></div>
                    <div><label>Poste</label><input type="text" value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} /></div>
                    <div><label>Date début</label><input type="text" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="2020" /></div>
                    <div><label>Date fin</label><input type="text" value={exp.endDate || ''} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} placeholder="2023" /></div>
                    <div className="sm:col-span-2"><label>Description</label><textarea rows={3} value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} /></div>
                  </div>
                </div>
              ))}
              <button onClick={addExperience} className="btn btn-secondary"><Plus className="w-4 h-4" />Ajouter</button>
            </div>
          )}

          {currentStep === 'education' && (
            <div className="space-y-6 animate-fade-in">
              <div><h2 className="text-2xl font-bold mb-2">Formation</h2></div>
              {cv.education.map((edu) => (
                <div key={edu.id} className="card space-y-4">
                  <div className="flex justify-between"><span className="font-medium">Formation</span><button onClick={() => removeEducation(edu.id)} className="text-red-400"><Trash2 className="w-4 h-4" /></button></div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label>École</label><input type="text" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} /></div>
                    <div><label>Diplôme</label><input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} /></div>
                    <div><label>Spécialité</label><input type="text" value={edu.field || ''} onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} /></div>
                    <div><label>Année</label><input type="text" value={edu.endDate || ''} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} /></div>
                  </div>
                </div>
              ))}
              <button onClick={addEducation} className="btn btn-secondary"><Plus className="w-4 h-4" />Ajouter</button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <button
              onClick={() => { const i = steps.findIndex(s => s.id === currentStep); if (i > 0) setCurrentStep(steps[i - 1].id) }}
              disabled={currentStep === steps[0].id}
              className="btn btn-ghost"
            >← Précédent</button>
            <button
              onClick={() => { const i = steps.findIndex(s => s.id === currentStep); if (i < steps.length - 1) setCurrentStep(steps[i + 1].id) }}
              disabled={currentStep === steps[steps.length - 1].id}
              className="btn btn-primary"
            >Suivant →</button>
          </div>
        </main>
      </div>
    </div>
  )
}

