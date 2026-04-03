import { ArrowLeft, CalendarDays } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AddressSummaryCard from '../components/booking/AddressSummaryCard'
import DatePill from '../components/booking/DatePill'
import TimeSlotCard from '../components/booking/TimeSlotCard'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import { useBookingStore } from '../store/bookingStore'

const pickupDates = [
  { label: 'Today', sublabel: '20 Mar' },
  { label: 'Tomorrow', sublabel: '21 Mar' },
  { label: 'Saturday', sublabel: '22 Mar' },
]

const timeSlots = [
  { label: '8:00 AM - 10:00 AM', capacity: 'Best for home pickup', fee: 'Free' },
  { label: '10:00 AM - 12:00 PM', capacity: 'Fastest availability', fee: 'Free' },
  { label: '2:00 PM - 4:00 PM', capacity: 'Afternoon slot', fee: 'KES 150' },
]

function SchedulePage() {
  const navigate = useNavigate()
  const pickup = useBookingStore((state) => state.orderFlow.pickup)
  const dropoff = useBookingStore((state) => state.orderFlow.dropoff)
  const returnToPickup = useBookingStore((state) => state.orderFlow.returnToPickup)
  const selectedDate = useBookingStore((state) => state.selectedDate)
  const selectedDateLabel = useBookingStore((state) => state.selectedDateLabel)
  const selectedTimeSlot = useBookingStore((state) => state.selectedTimeSlot)
  const setSelectedDate = useBookingStore((state) => state.setSelectedDate)
  const setSelectedTimeSlot = useBookingStore((state) => state.setSelectedTimeSlot)
  const canContinue = pickup.isConfirmed && (returnToPickup || dropoff.isConfirmed)

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-ink-700"
        >
          <ArrowLeft size={18} />
        </button>
        <p className="text-sm font-extrabold text-ink-900">DobiNow</p>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-900 text-sm font-extrabold text-white">
          DM
        </div>
      </header>

      <SectionHeader
        title="Choose your pickup time."
        subtitle="We will collect from your selected address and keep you updated at every step."
      />

      <AddressSummaryCard address={pickup} title="Pickup location" />

      {!returnToPickup ? <AddressSummaryCard address={dropoff} title="Drop-off location" /> : null}

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-brand-600" />
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
            Select date
          </p>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1">
          {pickupDates.map((date) => (
            <DatePill
              key={date.label}
              label={date.label}
              sublabel={date.sublabel}
              active={selectedDate === date.label}
              onClick={() => setSelectedDate(date.label, date.sublabel)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
          Available slots
        </p>
        {timeSlots.map((slot) => (
          <TimeSlotCard
            key={slot.label}
            slot={slot}
            selected={selectedTimeSlot === slot.label}
            onClick={() => setSelectedTimeSlot(slot.label)}
          />
        ))}
      </section>

      <div className="sticky-action">
        {/* The sticky footer mirrors the focused booking summary pattern from mobile apps. */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
              Selected pickup
            </p>
            <p className="mt-1 text-sm font-extrabold text-ink-900">
              {selectedDate}, {selectedDateLabel} • {selectedTimeSlot}
            </p>
          </div>
        </div>
        <Button fullWidth onClick={() => navigate('/services')} disabled={!canContinue}>
          Continue to services
        </Button>
        {!canContinue ? (
          <p className="mt-3 text-xs leading-5 text-red-500">
            Confirm both required locations before selecting services.
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default SchedulePage
