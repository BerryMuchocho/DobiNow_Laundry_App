import { Copy, Gift } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'

function ReferralHeroCard({ code }) {
  return (
    <Card className="rounded-[30px] bg-brand-500 p-5 text-white">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14">
        <Gift size={22} />
      </div>

      <h3 className="mt-4 text-[26px] font-extrabold leading-[1.05] tracking-[-0.04em]">
        Invite friends. Earn credit.
      </h3>
      <p className="mt-2 text-sm leading-6 text-white/82">
        Give KES 300 off the first pickup and earn KES 300 when their first order is complete.
      </p>

      <div className="mt-5 rounded-3xl bg-white px-4 py-4 text-ink-900">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
          Your referral code
        </p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xl font-extrabold tracking-[0.14em]">{code}</span>
          <Button variant="secondary" className="min-h-10 px-3">
            <span className="flex items-center gap-2">
              <Copy size={16} />
              Copy
            </span>
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ReferralHeroCard
