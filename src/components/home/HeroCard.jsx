import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import laundryBasket from '../../assets/laundry-basket1.png'

function HeroCard() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-45.5 overflow-hidden rounded-3xl bg-linear-to-br from-[#17c1f6] via-[#17b0f0] to-[#1991ec] px-5 py-6 text-white">
      {/* soft background glow */}
      <div className="pointer-events-none absolute -bottom-8 right-0 h-32 w-32 rounded-full bg-white/12 blur-sm" />

      {/* laundry image layer */}
      <img
        src={laundryBasket}
        alt=""
        className="pointer-events-none absolute bottom-0 right-0 z-0 h-auto w-110 object-contain opacity-35"
      />

      {/* optional soft tint over image so it blends into blue background */}
      <div className="pointer-events-none absolute inset-0 bg-[#1098e8]/8" />

      {/* content */}
      <div className="relative z-10 flex min-h-32.5 max-w-44 flex-col items-start justify-end gap-4">
        <h2 className="text-xl font-extrabold leading-[1.08] tracking-[-0.04em]">
          Need laundry picked up today?
        </h2>

        <Button
          variant="outline"
          className="min-h-10 border-none bg-white px-4 text-brand-600 shadow-none"
          onClick={() => navigate('/location')}
        >
          <span className="flex items-center gap-1">
            Book Pickup
            <ArrowRight size={15} />
          </span>
        </Button>
      </div>
    </section>
  )
}

export default HeroCard