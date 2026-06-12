'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface EditTaskFormProps {
  task: {
    id: string
    title: string
    description: string | null
    priority: string
    due_date: string | null
  }
  projectId: string
}

export default function EditTaskForm({ task, projectId }: EditTaskFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [priority, setPriority] = useState(task.priority)
  const [dueDate, setDueDate] = useState(task.due_date || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Modifier la tâche
  const handleUpdate = async () => {
    if (!title.trim()) {
      setError('Le titre est obligatoire')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase
      .from('tasks')
      .update({
        title: title.trim(),
        description: description.trim() || null,
        priority,
        due_date: dueDate || null,
      })
      .eq('id', task.id)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(`/dashboard/projects/${projectId}/tasks/${task.id}`)
    router.refresh()
  }

  // Supprimer la tâche
  const handleDelete = async () => {
    setDeleting(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', task.id)

    if (error) {
      setError(error.message)
      setDeleting(false)
      return
    }

    router.push(`/dashboard/projects/${projectId}`)
    router.refresh()
  }

  return (
    <div className="space-y-6">

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Titre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Titre <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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

      {/* Priorité */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Priorité
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'low',    label: '🟢 Basse',   color: 'border-green-300 bg-green-50 text-green-700' },
            { value: 'medium', label: '🟡 Moyenne',  color: 'border-yellow-300 bg-yellow-50 text-yellow-700' },
            { value: 'high',   label: '🔴 Haute',    color: 'border-red-300 bg-red-50 text-red-600' },
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
          Date d`&apos;`échéance <span className="text-gray-400">(optionnel)</span>
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Boutons modifier */}
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

      {/* Zone de suppression */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h4 className="text-sm font-medium text-red-600 mb-3">
          Zone dangereuse
        </h4>
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 font-medium py-3 rounded-lg transition-colors text-sm"
          >
            🗑 Supprimer cette tâche
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
            <p className="text-sm text-red-700 font-medium">
              Es-tu sûre de vouloir supprimer cette tâche ? Cette action est irréversible.
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
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg border border-gray-200 transition-colors text-sm"
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