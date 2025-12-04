// Types pour l'utilisateur et l'authentification

export interface User {
  id: string
  username: string
  passwordHash: string
  email: string
  fullName: string
  profileId?: string // Référence au profil de données
  createdAt: string
  updatedAt: string
}

export interface AdminSession {
  userId: string
  isAdmin: boolean
  adminCode: string // Code utilisé : 12411241
  activatedAt: string
}

