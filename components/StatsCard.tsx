interface StatsCardProps {
  title: string
  count: number
  icon: string
  color: string
}

export default function StatsCard({ title, count, icon, color }: StatsCardProps) {
  return (
    <div className={`bg-white rounded-xl p-6 border-l-4 ${color} shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{count}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  )
}