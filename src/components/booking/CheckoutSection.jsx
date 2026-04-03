import Card from '../ui/Card'
import StatusBadge from '../ui/StatusBadge'

function CheckoutSection({ title, rows, badge }) {
  return (
    <Card className="rounded-[26px]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-extrabold text-ink-900">{title}</h3>
        {badge ? <StatusBadge tone="neutral">{badge}</StatusBadge> : null}
      </div>

      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-3 text-sm">
            <span className="text-ink-500">{row.label}</span>
            <span className="text-right font-bold text-ink-900">{row.value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default CheckoutSection
