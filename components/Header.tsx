'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface HeaderProps {
  userEmail: string
  fullName?: string
}

export default function Header({ userEmail, fullName }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">✅</span>
          <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
        </div>

        {/* Utilisateur */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {fullName || 'Utilisateur'}
            </p>
            <p className="text-xs text-gray-500">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Déconnexion
          </button>
        </div>

      </div>
    </header>
  )
}