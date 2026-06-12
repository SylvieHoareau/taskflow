import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'

interface Project {
  id: string
  name: string
  description: string | null
}

interface Task {
  id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  // Vérifie que l'utilisateur est connecté
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Récupère le projet
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (!project) notFound()

  // Récupère les tâches du projet
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  const todoTasks = tasks?.filter(t => t.status === 'todo') || []
  const inProgressTasks = tasks?.filter(t => t.status === 'in_progress') || []
  const doneTasks = tasks?.filter(t => t.status === 'done') || []

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Retour
            </Link>
            <span className="text-gray-300">|</span>
            <h1 className="text-lg font-semibold text-gray-900">
              {project.name}
            </h1>
          </div>
          <Link
              href={`/dashboard/projects/${id}/edit`}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              ✏️ Modifier
          </Link>
          <Link
            href={`/dashboard/projects/${id}/tasks/new`}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Nouvelle tâche
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Description du projet */}
        {project.description && (
          <p className="text-gray-500 mb-8">{project.description}</p>
        )}

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900">{todoTasks.length}</p>
            <p className="text-sm text-gray-500 mt-1">À faire</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-l-4 border-yellow-500 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900">{inProgressTasks.length}</p>
            <p className="text-sm text-gray-500 mt-1">En cours</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-l-4 border-green-500 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900">{doneTasks.length}</p>
            <p className="text-sm text-gray-500 mt-1">Terminées</p>
          </div>
        </div>

        {/* Colonnes Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Colonne À faire */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
              À faire ({todoTasks.length})
            </h3>
            <div className="space-y-3">
              {todoTasks.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Aucune tâche</p>
              ) : (
                todoTasks.map(task => (
                  <TaskCard key={task.id} task={task} projectId={id} />
                ))
              )}
            </div>
          </div>

          {/* Colonne En cours */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>
              En cours ({inProgressTasks.length})
            </h3>
            <div className="space-y-3">
              {inProgressTasks.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Aucune tâche</p>
              ) : (
                inProgressTasks.map(task => (
                  <TaskCard key={task.id} task={task} projectId={id} />
                ))
              )}
            </div>
          </div>

          {/* Colonne Terminées */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
              Terminées ({doneTasks.length})
            </h3>
            <div className="space-y-3">
              {doneTasks.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Aucune tâche</p>
              ) : (
                doneTasks.map(task => (
                  <TaskCard key={task.id} task={task} projectId={id} />
                ))
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

// Composant carte de tâche
function TaskCard({ task, projectId }: { task: Task, projectId: string }) {
  const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-600',
  }

  const priorityLabels: Record<string, string> = {
    low: 'Basse',
    medium: 'Moyenne',
    high: 'Haute',
  }

  return (
    <Link
      href={`/dashboard/projects/${projectId}/tasks/${task.id}`}
      className="block border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:bg-blue-50 transition-colors"
    >
      <p className="font-medium text-gray-900 text-sm">{task.title}</p>
      {task.description && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between mt-2">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
          {priorityLabels[task.priority]}
        </span>
        {task.due_date && (
          <span className="text-xs text-gray-400">
            {new Date(task.due_date).toLocaleDateString('fr-FR')}
          </span>
        )}
      </div>
    </Link>
  )
}