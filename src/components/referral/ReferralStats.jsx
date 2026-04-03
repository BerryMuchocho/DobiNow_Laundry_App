import Card from '../ui/Card'

function ReferralStats({ items }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <Card key={item.label} className="rounded-3xl bg-slate-50 p-4 text-center">
          <p className="text-xl font-extrabold text-ink-900">{item.value}</p>
          <p className="mt-1 text-xs text-ink-500">{item.label}</p>
        </Card>
      ))}
    </div>
  )
}

export default ReferralStats
