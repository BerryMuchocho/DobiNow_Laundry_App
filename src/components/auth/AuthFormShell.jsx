import { ArrowLeft, MapPin } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'

function AuthFormShell({ eyebrow, title, subtitle, children, footer }) {
  const navigate = useNavigate()

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
        <Link to="/" className="flex items-center gap-2 text-brand-600">
          <MapPin size={18} />
          <span className="text-lg font-bold">DobiNow</span>
        </Link>
        <div className="h-11 w-11" />
      </header>

      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <Card className="rounded-[30px] bg-white p-5">{children}</Card>

      {footer ? <div className="pb-6 text-center text-sm text-ink-500">{footer}</div> : null}
    </div>
  )
}

export default AuthFormShell
