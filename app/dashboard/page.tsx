import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Header from '@/components/Header'
import StatsCard from '@/components/StatsCard'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Récupère les projets
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  // Récupère les tâches
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')

  // Calcule les statistiques
  const todoCount = tasks?.filter(t => t.status === 'todo').length || 0
  const inProgressCount = tasks?.filter(t => t.status === 'in_progress').length || 0
  const doneCount = tasks?.filter(t => t.status === 'done').length || 0

  const fullName = user.user_metadata?.full_name

  return (
    <div>
      <Header userEmail={user.email!} fullName={fullName} />

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Titre */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Bonjour {fullName || 'là'} 👋
          </h2>
          <p className="text-gray-500 mt-1">
            Voici un aperçu de tes projets et tâches
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatsCard
            title="À faire"
            count={todoCount}
            icon="📋"
            color="border-blue-500"
          />
          <StatsCard
            title="En cours"
            count={inProgressCount}
            icon="⚡"
            color="border-yellow-500"
          />
          <StatsCard
            title="Terminées"
            count={doneCount}
            icon="✅"
            color="border-green-500"
          />
        </div>

        {/* Projets */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Mes projets</h3>
            <Link
              href="/dashboard/projects/new"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Nouveau projet
            </Link>
          </div>

          {/* Liste des projets */}
          {projects && projects.length > 0 ? (
            <div className="space-y-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      {project.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <span className="text-gray-400">→</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* État vide */
            <div className="text-center py-12">
              <span className="text-5xl">📁</span>
              <p className="text-gray-500 mt-4">Aucun projet pour l'instant</p>
              <p className="text-sm text-gray-400 mt-1">
                Crée ton premier projet pour commencer
              </p>
              <Link
                href="/dashboard/projects/new"
                className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
              >
                Créer un projet
              </Link>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}