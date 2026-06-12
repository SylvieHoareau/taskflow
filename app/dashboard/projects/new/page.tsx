'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function NewProjectPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Le nom du projet est obligatoire')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()

    // Récupère l'utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    // Crée le projet dans Supabase
    const { error } = await supabase
      .from('projects')
      .insert({
        name: name.trim(),
        description: description.trim() || null,
        owner_id: user.id,
      })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Redirige vers le dashboard
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header simplifié */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Retour
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-lg font-semibold text-gray-900">
            Nouveau projet
          </h1>
        </div>
      </header>

      {/* Formulaire */}
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm p-8">

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Créer un projet
          </h2>
          <p className="text-gray-500 mb-8">
            Un projet regroupe toutes les tâches d`&apos;`un même sujet
          </p>

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">

            {/* Nom du projet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du projet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Refonte site web, Application mobile..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-gray-400">(optionnel)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décris l'objectif de ce projet..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCreate}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors"
              >
                {loading ? 'Création...' : 'Créer le projet'}
              </button>
              <Link
                href="/dashboard"
                className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors"
              >
                Annuler
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}