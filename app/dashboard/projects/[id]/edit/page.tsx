import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import EditTaskForm from '@/app/dashboard/projects/[id]/tasks/[taskId]/EditTaskForm'

interface PageProps {
  params: Promise<{ id: string; taskId: string }>
}

export default async function EditTaskPage({ params }: PageProps) {
  const { id: projectId, taskId } = await params
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: task } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single()

  if (!task) notFound()

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link
            href={`/dashboard/projects/${projectId}/tasks/${taskId}`}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Retour
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-lg font-semibold text-gray-900">
            Modifier la tâche
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Modifier la tâche
          </h2>
          <EditTaskForm task={task} projectId={projectId} />
        </div>
      </main>

    </div>
  )
}