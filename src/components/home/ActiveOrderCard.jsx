import { ArrowRight, Truck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import { useBookingStore } from '../../store/bookingStore'

function ActiveOrderCard() {
  const navigate = useNavigate()
  const currentOrder = useBookingStore((state) => state.currentOrder)

  return (
    <Card className="rounded-[22px] bg-white px-4 py-3">
      <button
        type="button"
        onClick={() => navigate('/tracking')}
        className="grid w-full grid-cols-[1fr_auto] items-center gap-3 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#ecfff2] text-success-strong">
            <Truck size={18} />
          </div>

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#b0b5c3]">
              Active order
            </p>
            <p className="mt-1 text-[13px] font-bold text-ink-900">
              {currentOrder.status}, {currentOrder.eta}
            </p>
          </div>
        </div>

        <ArrowRight size={16} className="justify-self-end text-ink-500" />
      </button>
    </Card>
  )
}

export default ActiveOrderCard
