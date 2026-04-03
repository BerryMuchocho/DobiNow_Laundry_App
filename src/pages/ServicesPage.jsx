import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ServiceOptionCard from '../components/booking/ServiceOptionCard'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import { services } from '../data/services'
import { useBookingStore } from '../store/bookingStore'

function ServicesPage() {
  const navigate = useNavigate()
  const selectedService = useBookingStore((state) => state.selectedService)
  const setSelectedService = useBookingStore((state) => state.setSelectedService)

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
          <p className="mt-1 text-sm font-bold text-ink-500">Service selection</p>
        </div>
      </header>

      <SectionHeader
        title="Choose a service."
        subtitle="Select the care option that matches your fabrics, speed, and budget."
      />

      <div className="space-y-3">
        {services.map((service) => (
          <ServiceOptionCard
            key={service.id}
            service={service}
            selected={selectedService.id === service.id}
            onSelect={() => setSelectedService(service)}
          />
        ))}
      </div>

      <div className="sticky-action">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
              Selected service
            </p>
            <p className="mt-1 text-sm font-extrabold text-ink-900">
              {selectedService.title} • {selectedService.priceLabel}
            </p>
          </div>
        </div>
        <Button fullWidth onClick={() => navigate('/checkout')}>
          Continue to checkout
        </Button>
      </div>
    </div>
  )
}

export default ServicesPage
