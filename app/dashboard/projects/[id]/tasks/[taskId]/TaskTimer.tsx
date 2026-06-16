'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'

interface TaskTimerProps {
  taskId: string
  initialTimeSpent: number // en secondes
}

export default function TaskTimer({ taskId, initialTimeSpent }: TaskTimerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0) // secondes depuis le démarrage
  const [totalTime, setTotalTime] = useState(initialTimeSpent)
  const [saving, setSaving] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Démarre ou arrête le chronomètre
  const toggle = () => {
    if (isRunning) {
      stop()
    } else {
      start()
    }
  }

  const start = () => {
    setIsRunning(true)
  }

  const stop = async () => {
    setIsRunning(false)

    if (elapsed === 0) return

    // Sauvegarde dans Supabase
    setSaving(true)
    const newTotal = totalTime + elapsed
    const supabase = createClient()

    const { error } = await supabase
      .from('tasks')
      .update({ time_spent: newTotal })
      .eq('id', taskId)

    if (!error) {
      setTotalTime(newTotal)
      setElapsed(0)
    }

    setSaving(false)
  }

  const reset = async () => {
    setIsRunning(false)
    setElapsed(0)

    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('tasks')
      .update({ time_spent: 0 })
      .eq('id', taskId)

    setTotalTime(0)
    setSaving(false)
  }

  // Ticker — incrémente elapsed chaque seconde
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  // Formate les secondes en HH:MM:SS
  const format = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return [
      h.toString().padStart(2, '0'),
      m.toString().padStart(2, '0'),
      s.toString().padStart(2, '0'),
    ].join(':')
  }

  // Formate en texte lisible pour le total
  const formatReadable = (seconds: number) => {
    if (seconds === 0) return 'Aucun temps enregistré'
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    const parts = []
    if (h > 0) parts.push(`${h}h`)
    if (m > 0) parts.push(`${m}min`)
    if (s > 0 && h === 0) parts.push(`${s}s`)
    return parts.join(' ')
  }

  return (
    <div className="space-y-6">

      {/* Chronomètre actuel */}
      <div className="text-center">
        <div className={`text-6xl font-mono font-bold tracking-wider mb-2 ${
          isRunning ? 'text-blue-600' : 'text-gray-900'
        }`}>
          {format(elapsed)}
        </div>
        <p className="text-sm text-gray-400">
          {isRunning ? '⏱ Chronomètre en cours...' : 'Prêt à démarrer'}
        </p>
      </div>

      {/* Boutons */}
      <div className="flex gap-3">
        <button
          onClick={toggle}
          disabled={saving}
          className={`flex-1 font-semibold py-3 rounded-xl transition-colors text-white ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isRunning ? '⏹ Arrêter et sauvegarder' : '▶ Démarrer'}
        </button>

        {!isRunning && totalTime > 0 && (
          <button
            onClick={reset}
            disabled={saving}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500 transition-colors text-sm font-medium"
          >
            🔄 Reset
          </button>
        )}
      </div>

      {saving && (
        <p className="text-center text-sm text-gray-400">Sauvegarde...</p>
      )}

      {/* Temps total */}
      <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
        <p className="text-xs text-gray-400 uppercase font-medium mb-1">
          Temps total enregistré
        </p>
        <p className="text-lg font-semibold text-gray-900">
          {formatReadable(totalTime)}
        </p>
        {totalTime > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            {format(totalTime)} au total
          </p>
        )}
      </div>

    </div>
  )
}