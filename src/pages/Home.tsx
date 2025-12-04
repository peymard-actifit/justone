import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Upload, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'

export default function Home() {
  const [isHovered, setIsHovered] = useState<string | null>(null)

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">J1</span>
            </div>
            <span className="text-xl font-bold">
              Just<span className="text-gradient">1</span>
            </span>
          </div>
          <Link to="/login" className="btn btn-ghost text-sm">
            Se connecter
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 px-6 pt-16 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>Nouvelle génération de gestion de CV</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-slide-up">
              Créez votre
              <br />
              <span className="text-gradient">CV Exécutif</span>
            </h1>
            
            <p className="text-xl text-dark-400 max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Un outil élégant pour les dirigeants et managers.
              <br />
              Structurez votre parcours avec précision et impact.
            </p>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <Link
                to="/register"
                className="card-hover group text-left animate-slide-up"
                style={{ animationDelay: '0.2s' }}
                onMouseEnter={() => setIsHovered('new')}
                onMouseLeave={() => setIsHovered(null)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isHovered === 'new' 
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600' 
                      : 'bg-primary-500/10'
                  }`}>
                    <FileText className={`w-6 h-6 transition-colors ${
                      isHovered === 'new' ? 'text-white' : 'text-primary-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                      Nouveau CV
                      <ArrowRight className={`w-4 h-4 transition-all duration-300 ${
                        isHovered === 'new' ? 'translate-x-1 opacity-100' : 'opacity-0'
                      }`} />
                    </h3>
                    <p className="text-dark-400 text-sm">
                      Créez votre CV étape par étape avec notre assistant guidé
                    </p>
                  </div>
                </div>
              </Link>

              <div
                className="card-hover group text-left animate-slide-up opacity-60 cursor-not-allowed"
                style={{ animationDelay: '0.3s' }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-accent-500/10">
                    <Upload className="w-6 h-6 text-accent-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">
                      Importer un CV
                    </h3>
                    <p className="text-dark-400 text-sm">
                      Bientôt disponible - Import PDF
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Zap, title: 'Rapide & Intuitif', description: 'Interface moderne pour une productivité maximale', delay: '0.4s' },
              { icon: Shield, title: 'Données Sécurisées', description: 'Vos informations sont chiffrées et sécurisées', delay: '0.5s' },
              { icon: Sparkles, title: 'Export Professionnel', description: 'Générez des PDFs impeccables en un clic', delay: '0.6s' }
            ].map((feature, index) => (
              <div
                key={index}
                className="card text-center animate-slide-up"
                style={{ animationDelay: feature.delay }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-dark-500 text-sm">
            © 2025 Just1 — Conçu pour l'excellence professionnelle
          </p>
        </div>
      </footer>
    </div>
  )
}

