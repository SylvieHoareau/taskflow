'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface EditProjectFormProps {
  project: {
    id: string
    name: string
    description: string | null
  }
}

export default function EditProjectForm({ project }: EditProjectFormProps) {
  const router = useRouter()
  const [name, setName] = useState(project.name)
  const [description, setDescription] = useState(project.description || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleUpdate = async () => {
    if (!name.trim()) {
      setError('Le nom est obligatoire')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase
      .from('projects')
      .update({
        name: name.trim(),
        description: description.trim() || null,
      })
      .eq('id', project.id)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(`/dashboard/projects/${project.id}`)
    router.refresh()
  }

  const handleDelete = async () => {
    setDeleting(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', project.id)

    if (error) {
      setError(error.message)
      setDeleting(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="space-y-6">

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Nom */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nom du projet <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Boutons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <button
          onClick={() => router.back()}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors"
        >
          Annuler
        </button>
      </div>

      {/* Suppression */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-medium text-red-600 mb-3">
          Zone dangereuse
        </h4>
        <p className="text-xs text-gray-400 mb-3">
          ⚠️ Supprimer un projet supprime aussi toutes ses tâches
        </p>
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 font-medium py-3 rounded-lg transition-colors text-sm"
          >
            🗑 Supprimer ce projet
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
            <p className="text-sm text-red-700 font-medium">
              Es-tu sûre ? Toutes les tâches de ce projet seront supprimées.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
              >
                {deleting ? 'Suppression...' : 'Oui, supprimer'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-white text-gray-700 font-medium py-2.5 rounded-lg border border-gray-200 transition-colors text-sm"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}