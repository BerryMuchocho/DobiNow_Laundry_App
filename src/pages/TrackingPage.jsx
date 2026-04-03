import { useState } from 'react'
import { ArrowLeft, ChevronDown, ChevronUp, Headphones, CalendarClock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import RiderCard from '../components/tracking/RiderCard'
import TrackingTimeline from '../components/tracking/TrackingTimeline'
import { useBookingStore } from '../store/bookingStore'
import { formatCurrency } from '../utils/formatCurrency'

function TrackingPage() {
  const navigate = useNavigate()
  const currentOrder = useBookingStore((state) => state.currentOrder)
  const displayTotal = currentOrder.totalLabel ?? formatCurrency(currentOrder.total ?? 0)

  // Controls the Order Details expand/collapse toggle
  const [detailsOpen, setDetailsOpen] = useState(true)

  return (
    <div className="relative mx-auto min-h-screen max-w-sm overflow-hidden bg-slate-100">
      <div className="h-full space-y-5 overflow-y-auto px-5 pb-10 pt-5">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-lg font-bold text-brand-600"
          >
            <ArrowLeft size={20} />
            DobiNow
          </button>
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand-50">
            <img src="/avatar-placeholder.png" alt="User" className="h-full w-full object-cover" />
          </div>
        </header>

        <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
          Order #{currentOrder.id}
        </p>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold leading-tight text-ink-900">
            Track your order
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            {currentOrder.status}
          </span>
        </div>

        <div className="rounded-2xl bg-white p-4">
          <TrackingTimeline steps={currentOrder.timeline} />
        </div>

        <RiderCard
          riderName={currentOrder.riderName}
          riderPhone={currentOrder.riderPhone}
          riderRating={currentOrder.riderRating}
          riderPhoto={currentOrder.riderPhoto}
        />

        <div className="rounded-2xl bg-white px-4 pb-2 pt-4">
          <button
            type="button"
            onClick={() => setDetailsOpen((prev) => !prev)}
            className="mb-3 flex w-full items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50">
                <CalendarClock size={16} className="text-brand-600" />
              </div>
              <span className="text-base font-bold text-ink-900">Order Details</span>
            </div>
            {detailsOpen ? (
              <ChevronUp size={18} className="text-ink-400" />
            ) : (
              <ChevronDown size={18} className="text-ink-400" />
            )}
          </button>

          {detailsOpen && (
            <div className="space-y-3 border-t border-slate-100 pb-2 pt-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-500">Items</span>
                <span className="font-bold text-ink-900">{currentOrder.itemCount} Laundry Items</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-500">Service</span>
                <span className="font-bold text-ink-900">{currentOrder.serviceTitle}</span>
              </div>
              {/* We prefer the preformatted label, then fall back to formatting the numeric total. */}
              <div className="flex items-center justify-between">
                <span className="text-ink-500">Total</span>
                <span className="font-bold text-brand-600">{displayTotal}</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => window.open(`tel:${currentOrder.supportPhone}`)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-200 py-4 text-sm font-semibold text-ink-900 transition-all hover:bg-slate-300"
          >
            <Headphones size={16} />
            Call support
          </button>
          <button
            type="button"
            onClick={() => navigate('/reschedule')}
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-200 py-4 text-sm font-semibold text-ink-900 transition-all hover:bg-slate-300"
          >
            <CalendarClock size={16} />
            Reschedule
          </button>
        </div>
      </div>
    </div>
  )
}

export default TrackingPage
