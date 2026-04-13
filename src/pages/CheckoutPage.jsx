import { ArrowLeft, CreditCard, TicketPercent, Truck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import SectionHeader from '../components/ui/SectionHeader'
import { services } from '../data/services'
import { useBookingStore } from '../store/bookingStore'
import { formatCurrency } from '../utils/formatCurrency'

const LAUNDRY_MART_COLLECTION_NOTES = 'Collect from the front desk inside DobiNow Laundry Mart.'

function CheckoutPage() {
  const navigate = useNavigate()
  // Reading each field separately avoids a new object snapshot on every render.
  const pickup = useBookingStore((state) => state.orderFlow.pickup)
  const dropoff = useBookingStore((state) => state.orderFlow.dropoff)
  const returnToPickup = useBookingStore((state) => state.orderFlow.returnToPickup)
  const selectedDate = useBookingStore((state) => state.selectedDate)
  const selectedDateLabel = useBookingStore((state) => state.selectedDateLabel)
  const selectedTimeSlot = useBookingStore((state) => state.selectedTimeSlot)
  const selectedService = useBookingStore((state) => state.selectedService)
  const confirmBooking = useBookingStore((state) => state.confirmBooking)

  // These fallbacks prevent the page from crashing if the store is temporarily empty.
  const safeService = selectedService ?? services[0]
  const safeDate = selectedDate ?? 'Today'
  const safeDateLabel = selectedDateLabel ?? 'Pickup date'
  const safeTimeSlot = selectedTimeSlot ?? 'Choose a time slot'
  const safePickup = pickup?.isConfirmed ? pickup : null
  const isSelfDropoffOrder = safePickup?.source === 'laundry-mart'
  const safeDropoff = returnToPickup ? safePickup : dropoff?.isConfirmed ? dropoff : null
  const hasDeliveryService = safeDropoff?.source !== 'laundry-mart'
  const dropoffNotes =
    safeDropoff?.source === 'laundry-mart' ? LAUNDRY_MART_COLLECTION_NOTES : safeDropoff?.instructions

  const deliveryFee = hasDeliveryService ? 150 : 0
  const total = safeService.price + deliveryFee
  const hasBookingDetails = Boolean(safePickup && safeDropoff && selectedService)

  const handleConfirm = () => {
    // In the MVP we store the new mock order locally, then move to tracking.
    confirmBooking()
    navigate('/tracking')
  }

  const priceRows = [
    { label: safeService.title, value: safeService.priceLabel },
    {
      label: hasDeliveryService ? 'Pickup & delivery' : 'Collection after cleaning',
      value: hasDeliveryService ? formatCurrency(deliveryFee) : 'No delivery charge',
    },
    { label: 'Total', value: formatCurrency(total) },
  ]

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-ink-700"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">DobiNow</p>
          <p className="mt-1 text-sm font-bold text-ink-500">Checkout</p>
        </div>
      </header>

      <SectionHeader
        title="Review your order."
        subtitle={
          isSelfDropoffOrder
            ? 'Check your service, laundry drop-off details, and how you want to receive the clean laundry.'
            : 'Check your service, pickup timing, and payment details before confirming.'
        }
      />

      {!hasBookingDetails ? (
        <Card className="rounded-[26px] bg-white">
          {/* This message is safer than letting the screen fail silently. */}
          <h2 className="text-base font-extrabold text-ink-900">Booking details are missing.</h2>
          <p className="mt-2 text-sm leading-6 text-ink-500">
            Please go back and choose your {isSelfDropoffOrder ? 'drop-off' : 'pickup'} details again before checkout.
          </p>
          <Button fullWidth className="mt-4" onClick={() => navigate('/services')}>
            Return to service selection
          </Button>
        </Card>
      ) : null}

      <Card className="rounded-[28px] bg-brand-500 p-5 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Service summary</p>
        <h3 className="mt-2 text-lg font-extrabold">{safeService.title}</h3>
        <p className="mt-2 text-sm leading-6 text-white/78">{safeService.description}</p>
        <p className="mt-4 text-2xl font-extrabold">{safeService.priceLabel}</p>
      </Card>

      <Card className="rounded-[26px] bg-white">
        <h3 className="text-sm font-extrabold text-ink-900">
          {isSelfDropoffOrder ? 'Laundry drop-off details' : 'Pickup details'}
        </h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-start justify-between gap-3 text-sm">
            <span className="text-ink-500">{isSelfDropoffOrder ? 'Drop-off location' : 'Address'}</span>
            <span className="text-right font-bold text-ink-900">{safePickup?.address ?? 'Not selected'}</span>
          </div>
          {safePickup?.instructions ? (
            <div className="flex items-start justify-between gap-3 text-sm">
              <span className="text-ink-500">{isSelfDropoffOrder ? 'Drop-off notes' : 'Instructions'}</span>
              <span className="text-right font-bold text-ink-900">{safePickup.instructions}</span>
            </div>
          ) : null}
          <div className="flex items-start justify-between gap-3 text-sm">
            <span className="text-ink-500">{isSelfDropoffOrder ? 'Planned drop-off date' : 'Date'}</span>
            <span className="text-right font-bold text-ink-900">{safeDate}, {safeDateLabel}</span>
          </div>
          <div className="flex items-start justify-between gap-3 text-sm">
            <span className="text-ink-500">{isSelfDropoffOrder ? 'Planned drop-off window' : 'Time slot'}</span>
            <span className="text-right font-bold text-ink-900">{safeTimeSlot}</span>
          </div>
        </div>
      </Card>

      <Card className="rounded-[26px] bg-white">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-extrabold text-ink-900">
            {isSelfDropoffOrder ? 'After cleaning' : 'Drop-off details'}
          </h3>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-ink-700">
            {isSelfDropoffOrder
              ? safeDropoff?.source === 'laundry-mart'
                ? 'Self collection'
                : 'Delivery selected'
              : returnToPickup
                ? safeDropoff?.source === 'laundry-mart'
                  ? 'Self collection'
                  : 'Same as pickup'
                : 'Custom drop-off'}
          </span>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-start justify-between gap-3 text-sm">
            <span className="text-ink-500">
              {safeDropoff?.source === 'laundry-mart' ? 'Collection point' : 'Address'}
            </span>
            <span className="text-right font-bold text-ink-900">{safeDropoff?.address ?? 'Not selected'}</span>
          </div>
          {dropoffNotes ? (
            <div className="flex items-start justify-between gap-3 text-sm">
              <span className="text-ink-500">
                {safeDropoff?.source === 'laundry-mart' ? 'Collection notes' : 'Instructions'}
              </span>
              <span className="text-right font-bold text-ink-900">{dropoffNotes}</span>
            </div>
          ) : null}
          <div className="flex items-start justify-between gap-3 text-sm">
            <span className="text-ink-500">
              {safeDropoff?.source === 'laundry-mart' ? 'Ready by' : 'Estimated return'}
            </span>
            <span className="text-right font-bold text-ink-900">
              {safeDropoff?.source === 'laundry-mart' ? 'We will notify you' : `${safeDate}, 7:30 PM`}
            </span>
          </div>
        </div>
      </Card>

      <Card className="rounded-[26px]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <CreditCard size={18} />
          </div>
          <div>
            <p className="text-sm font-extrabold text-ink-900">M-Pesa •••• 9912</p>
            <p className="mt-1 text-xs text-ink-500">Pay on confirmation</p>
          </div>
        </div>
      </Card>

      <label className="flex items-center gap-3 rounded-[20px] border border-line bg-surface-soft px-4 py-3">
        <TicketPercent size={18} className="text-ink-500" />
        <input
          placeholder="Add promo code"
          className="w-full border-none bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-500"
        />
      </label>

      <Card className="rounded-[26px] bg-white">
        <h3 className="text-sm font-extrabold text-ink-900">Price summary</h3>
        <div className="mt-4 space-y-3">
          {priceRows.map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-3 text-sm">
              <span className="text-ink-500">{row.label}</span>
              <span className="text-right font-bold text-ink-900">{row.value}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="sticky-action">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-bold text-ink-500">Total</span>
          <span className="text-lg font-extrabold text-ink-900">{formatCurrency(total)}</span>
        </div>
        <Button fullWidth onClick={handleConfirm} disabled={!hasBookingDetails}>
          <span className="flex items-center gap-2">
            <Truck size={16} />
            Confirm booking
          </span>
        </Button>
      </div>
    </div>
  )
}

export default CheckoutPage
