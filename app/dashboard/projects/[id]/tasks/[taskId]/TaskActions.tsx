'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface TaskActionsProps {
  taskId: string
  projectId: string
  currentStatus: string
}

export default function TaskActions({
  taskId,
  projectId,
  currentStatus,
}: TaskActionsProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  const statuses = [
    { value: 'todo',        label: '📋 À faire',   color: 'border-blue-300 bg-blue-50 text-blue-700' },
    { value: 'in_progress', label: '⚡ En cours',   color: 'border-yellow-300 bg-yellow-50 text-yellow-700' },
    { value: 'done',        label: '✅ Terminée',   color: 'border-green-300 bg-green-50 text-green-700' },
  ]

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId)

    if (!error) {
      setStatus(newStatus)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 mb-4">
        Clique sur un statut pour mettre à jour la tâche
      </p>
      <div className="grid grid-cols-1 gap-3">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => handleStatusChange(s.value)}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg border-2 text-sm font-medium transition-colors text-left ${
              status === s.value
                ? s.color
                : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{s.label}</span>
              {status === s.value && (
                <span className="text-xs">✓ Actuel</span>
              )}
            </div>
          </button>
        ))}
      </div>
      {loading && (
        <p className="text-sm text-gray-400 text-center">Mise à jour...</p>
      )}
    </div>
  )
}