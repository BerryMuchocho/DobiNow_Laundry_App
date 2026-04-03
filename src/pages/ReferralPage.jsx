import { useState } from 'react'
import { ArrowLeft, Share2, Copy, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ReferralStats from '../components/referral/ReferralStats'

function ReferralPage() {
  const navigate = useNavigate()
  const referralCode = 'DOBINOW200'

  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: 'Try DobiNow',
        text: `Use my code ${referralCode} and we both get KES 200 credit!`,
      })
    }
  }

  const stats = [
    { label: 'Invites',   value: '12',   valueClass: 'text-ink-900' },
    { label: 'Earned',    value: '2.4k', valueClass: 'text-brand-600' },
    { label: 'Available', value: '800',  valueClass: 'text-green-600' },
  ]

  return (
    <div className="relative max-w-sm mx-auto min-h-screen bg-slate-100">
      <div className="overflow-y-auto px-5 pt-5 pb-10 space-y-6">

        {/* Header */}
        <header className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-ink-900 p-1">
            <ArrowLeft size={20} />
          </button>
          <span className="text-base font-bold text-brand-600">DobiNow</span>
          <div className="w-6" />
        </header>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold leading-tight text-ink-900">
            Invite friends.{' '}
            <span className="text-brand-600">Earn credit.</span>
          </h1>
          <p className="text-sm text-ink-500 leading-relaxed">
            Share the gift of pristine laundry and get rewarded for every friend who joins.
          </p>
        </div>

        {/* Hero card */}
        <div className="bg-brand-600 rounded-3xl p-5 space-y-4">
          <span className="inline-block bg-brand-500 text-white/90 text-xs font-bold
                           uppercase tracking-widest px-3 py-1.5 rounded-full">
            Exclusive Offer
          </span>
          <h2 className="text-white text-2xl font-extrabold leading-snug">
            Give KES 200, Get KES 200.
          </h2>
          <div className="bg-brand-700/50 rounded-2xl px-4 py-4 text-center space-y-1">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
              Your Unique Code
            </p>
            <p className="text-white text-xl font-extrabold tracking-[0.25em] font-mono">
              {referralCode}
            </p>
          </div>
        </div>

        {/* Buttons — side by side, compact height */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 bg-brand-600
                       hover:bg-brand-700 text-white font-semibold text-sm py-3
                       rounded-2xl transition-all"
          >
            <Share2 size={15} />
            Share Invite
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 bg-slate-200
                       hover:bg-slate-300 text-ink-900 font-semibold text-sm py-3
                       rounded-2xl transition-all"
          >
            {copied ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        {/* Stats */}
        <ReferralStats items={stats} />

      </div>
    </div>
  )
}

export default ReferralPage