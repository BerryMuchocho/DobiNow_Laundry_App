import Card from '../ui/Card'

function QuickActionCard({ icon, title, caption }) {
  const Icon = icon

  return (
    <Card className="rounded-3xl bg-slate-50 p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-600">
        <Icon size={18} />
      </div>
      <h3 className="mt-4 text-sm font-extrabold text-ink-900">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-ink-500">{caption}</p>
    </Card>
  )
}

export default QuickActionCard
