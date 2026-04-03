import { CheckCircle2, Dot } from 'lucide-react'
import Card from '../ui/Card'

function TrackingTimeline({ steps }) {
  return (
    <Card className="rounded-[28px] bg-slate-50">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
        Status timeline
      </p>

      <div className="mt-5 space-y-5">
        {steps.map((step, index) => (
          <div key={step.title} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={[
                  'flex h-7 w-7 items-center justify-center rounded-full',
                  step.done ? 'bg-emerald-500 text-white' : 'bg-white text-ink-400',
                ].join(' ')}
              >
                {step.done ? <CheckCircle2 size={16} /> : <Dot size={18} />}
              </div>
              {index < steps.length - 1 ? <div className="mt-2 h-full w-px bg-line" /> : null}
            </div>

            <div className="pb-5">
              <h3 className="text-sm font-extrabold text-ink-900">{step.title}</h3>
              <p className="mt-1 text-xs text-ink-500">{step.time}</p>
              <p className="mt-2 text-sm leading-6 text-ink-700">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default TrackingTimeline
