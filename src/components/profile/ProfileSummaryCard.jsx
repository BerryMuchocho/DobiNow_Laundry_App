import { Star } from 'lucide-react'
import Card from '../ui/Card'

function ProfileSummaryCard() {
  return (
    <Card className="rounded-[30px] bg-ink-900 p-5 text-white">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/12 text-xl font-extrabold">
          DM
        </div>
        <div>
          <h3 className="text-lg font-extrabold">Damaris Mwende</h3>
          <p className="mt-1 text-sm text-white/70">Fedha, Embakasi, Nairobi</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-[22px] bg-white/10 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/60">Member status</p>
          <p className="mt-1 text-sm font-bold">Priority customer</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/14">
          <Star size={18} />
        </div>
      </div>
    </Card>
  )
}

export default ProfileSummaryCard
