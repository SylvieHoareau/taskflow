import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import TaskActions from './TaskActions'
import TaskTimer from './TaskTimer'

interface PageProps {
  params: Promise<{ id: string; taskId: string }>
}

export default async function TaskPage({ params }: PageProps) {
  const { id: projectId, taskId } = await params
  const supabase = await createServerSupabaseClient()

  // Vérifie que l'utilisateur est connecté
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Récupère la tâche
  const { data: task } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single()

  if (!task) notFound()

  // Récupère le projet
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (!project) notFound()

  const priorityConfig: Record<string, { label: string; color: string }> = {
    low:    { label: 'Basse',   color: 'bg-green-100 text-green-700' },
    medium: { label: 'Moyenne', color: 'bg-yellow-100 text-yellow-700' },
    high:   { label: 'Haute',   color: 'bg-red-100 text-red-600' },
  }

  const statusConfig: Record<string, { label: string; color: string }> = {
    todo:        { label: 'À faire',   color: 'bg-blue-100 text-blue-700' },
    in_progress: { label: 'En cours',  color: 'bg-yellow-100 text-yellow-700' },
    done:        { label: 'Terminée',  color: 'bg-green-100 text-green-700' },
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link
            href={`/dashboard/projects/${projectId}`}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Retour
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">{project.name}</span>
          <span className="text-gray-300">|</span>
            <h1 className="text-lg font-semibold text-gray-900 truncate">
                {task.title}
            </h1>
            </div>
            <Link
            href={`/dashboard/projects/${projectId}/tasks/${taskId}/edit`}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
                ✏️ Modifier
            </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Contenu principal */}
          <div className="md:col-span-2 space-y-6">

            {/* Titre + description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {task.title}
              </h2>
              {task.description ? (
                <p className="text-gray-600 leading-relaxed">
                  {task.description}
                </p>
              ) : (
                <p className="text-gray-400 italic">Aucune description</p>
              )}
            </div>

            {/* Changer le statut */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Statut de la tâche
              </h3>
              <TaskActions
                taskId={taskId}
                projectId={projectId}
                currentStatus={task.status}
              />
            </div>

            {/* Chronomètre */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-6">
                ⏱ Chronomètre
              </h3>
              <TaskTimer
                taskId={taskId}
                initialTimeSpent={task.time_spent || 0}
              />
            </div>

          </div>

          {/* Sidebar infos */}
          <div className="space-y-4">

            {/* Statut actuel */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                Statut
              </p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusConfig[task.status].color}`}>
                {statusConfig[task.status].label}
              </span>
            </div>

            {/* Priorité */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                Priorité
              </p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${priorityConfig[task.priority].color}`}>
                {priorityConfig[task.priority].label}
              </span>
            </div>

            {/* Date d'échéance */}
            {task.due_date && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                  Échéance
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(task.due_date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}

            {/* Date de création */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                Créée le
              </p>
              <p className="text-sm text-gray-600">
                {new Date(task.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}