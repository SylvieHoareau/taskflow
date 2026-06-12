import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function HomePage() {
   const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Si déjà connecté → dashboard
  if (user) redirect('/dashboard')
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* Header */}
      <header className="px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <span className="text-xl font-bold text-gray-900">TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/auth/register"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center">

        <div className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          🚀 Gérez vos projets simplement
        </div>

        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Organisez vos tâches,<br />
          <span className="text-blue-600">livrez vos projets</span>
        </h1>

        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          TaskFlow vous permet de gérer vos projets et tâches en équipe,
          avec un tableau Kanban intuitif et une synchronisation en temps réel.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/auth/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
          >
            Créer mon compte →
          </Link>
          <Link
            href="/auth/login"
            className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-xl border border-gray-200 transition-colors text-lg"
          >
            Se connecter
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {[
            {
              icon: '📋',
              title: 'Kanban intuitif',
              description: 'Visualisez vos tâches en colonnes À faire, En cours et Terminées',
            },
            {
              icon: '⚡',
              title: 'Temps réel',
              description: 'Les modifications sont synchronisées instantanément avec Supabase',
            },
            {
              icon: '🔒',
              title: 'Sécurisé',
              description: 'Vos données sont protégées par les politiques RLS de Supabase',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left"
            >
              <span className="text-4xl">{feature.icon}</span>
              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stack technique */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-400 uppercase font-medium mb-6">
            Stack technique
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[
              { name: 'Next.js', color: 'text-gray-900' },
              { name: 'TypeScript', color: 'text-blue-600' },
              { name: 'Supabase', color: 'text-green-600' },
              { name: 'Tailwind CSS', color: 'text-cyan-600' },
              { name: 'PostgreSQL', color: 'text-indigo-600' },
            ].map((tech) => (
              <span
                key={tech.name}
                className={`font-semibold text-lg ${tech.color}`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-gray-400">
        TaskFlow — Projet d`&apos;apprentissage Full Stack
      </footer>

    </div>
  )
}