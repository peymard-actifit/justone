import { Link, useLocation } from 'react-router-dom'
import { 
  Database, 
  Sparkles, 
  Globe, 
  TrendingUp, 
  Share2, 
  Search, 
  FileCheck,
  Webhook,
  Edit
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: typeof Database
  path: string
  description: string
}

const navItems: NavItem[] = [
  {
    id: 'data',
    label: 'Données',
    icon: Database,
    path: '/dashboard',
    description: 'Gérer vos données personnelles',
  },
  {
    id: 'ai',
    label: 'IA',
    icon: Sparkles,
    path: '/ai',
    description: 'Assistant IA pour vos CV',
  },
  {
    id: 'justweb',
    label: 'JustWeb',
    icon: Globe,
    path: '/justweb',
    description: 'Créer votre site web personnel',
  },
  {
    id: 'justboost',
    label: 'JustBoost',
    icon: TrendingUp,
    path: '/justboost',
    description: 'Conseils pour améliorer votre profil',
  },
  {
    id: 'justpush',
    label: 'JustPush',
    icon: Share2,
    path: '/justpush',
    description: 'Partager sur les réseaux sociaux',
  },
  {
    id: 'justfind',
    label: 'JustFind',
    icon: Search,
    path: '/justfind',
    description: 'Rechercher des offres et projets',
  },
  {
    id: 'jobdone',
    label: 'JobDone',
    icon: FileCheck,
    path: '/jobdone',
    description: 'Certifications employeurs',
  },
  {
    id: 'justrpa',
    label: 'JustRPA',
    icon: Webhook,
    path: '/justrpa',
    description: 'Remplissage automatisé de formulaires',
  },
]

export default function NavigationBar() {
  const location = useLocation()

  return (
    <nav className="border-b border-white/5 bg-dark-900/50 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname.startsWith(item.path)
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 transition-all
                  ${isActive 
                    ? 'border-primary-500 text-primary-400' 
                    : 'border-transparent text-dark-400 hover:text-white hover:border-white/20'
                  }
                `}
                title={item.description}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

