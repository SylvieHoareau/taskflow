'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function NewTaskPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Le titre de la tâche est obligatoire')
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

    // Crée la tâche dans Supabase
    const { error } = await supabase
      .from('tasks')
      .insert({
        title: title.trim(),
        description: description.trim() || null,
        priority,
        due_date: dueDate || null,
        project_id: projectId,
        created_by: user.id,
        status: 'todo',
      })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Redirige vers la page du projet
    router.push(`/dashboard/projects/${projectId}`)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Link
            href={`/dashboard/projects/${projectId}`}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Retour
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-lg font-semibold text-gray-900">
            Nouvelle tâche
          </h1>
        </div>
      </header>

      {/* Formulaire */}
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm p-8">

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Créer une tâche
          </h2>
          <p className="text-gray-500 mb-8">
            Ajoute une tâche à ce projet
          </p>

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">

            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Créer la page d'accueil..."
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
                placeholder="Décris ce qu'il faut faire..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Priorité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorité
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'low', label: '🟢 Basse', color: 'border-green-300 bg-green-50 text-green-700' },
                  { value: 'medium', label: '🟡 Moyenne', color: 'border-yellow-300 bg-yellow-50 text-yellow-700' },
                  { value: 'high', label: '🔴 Haute', color: 'border-red-300 bg-red-50 text-red-700' },
                ].map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPriority(p.value)}
                    className={`py-2.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                      priority === p.value
                        ? p.color
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date d'échéance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'échéance <span className="text-gray-400">(optionnel)</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCreate}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors"
              >
                {loading ? 'Création...' : 'Créer la tâche'}
              </button>
              <Link
                href={`/dashboard/projects/${projectId}`}
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