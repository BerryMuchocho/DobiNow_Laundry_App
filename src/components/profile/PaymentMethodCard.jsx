import { CreditCard } from 'lucide-react'
import Card from '../ui/Card'

function PaymentMethodCard() {
  return (
    <Card className="rounded-[26px]">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <CreditCard size={18} />
        </div>
        <div>
          <p className="text-sm font-extrabold text-ink-900">M-Pesa •••• 9912</p>
          <p className="mt-1 text-xs text-ink-500">Primary payment method</p>
        </div>
      </div>
    </Card>
  )
}

export default PaymentMethodCard
