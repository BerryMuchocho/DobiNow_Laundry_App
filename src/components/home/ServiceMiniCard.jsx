import Card from '../ui/Card'

function ServiceMiniCard({ icon, title, caption }) {
  const Icon = icon

  return (
    <Card className="flex min-h-34.5 flex-col rounded-5.5 bg-white p-4">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#f2f6ff] text-brand-600">
        <Icon size={18} />
      </div>
      <div className="mt-auto space-y-1">
        <h3 className="text-[15px] font-extrabold leading-5 text-ink-900">{title}</h3>
        <p className="text-xs font-bold text-brand-600">{caption}</p>
      </div>
    </Card>
  )
}

export default ServiceMiniCard
