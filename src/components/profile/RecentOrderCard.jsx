import Button from '../ui/Button'
import Card from '../ui/Card'

function RecentOrderCard({ order }) {
  return (
    <Card className="rounded-[26px] bg-slate-50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-ink-900">{order.serviceTitle}</h3>
          <p className="mt-1 text-xs text-ink-500">{order.date}</p>
        </div>
        <p className="text-sm font-extrabold text-ink-900">{order.totalLabel}</p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
          {order.status}
        </p>
        <Button variant="outline" className="min-h-10 px-3">
          Rebook
        </Button>
      </div>
    </Card>
  )
}

export default RecentOrderCard
