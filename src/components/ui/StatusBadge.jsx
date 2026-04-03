function StatusBadge({ children, tone = 'info' }) {
  const tones = {
    info: 'bg-brand-50 text-brand-600',
    success: 'bg-success-soft text-success-strong',
    neutral: 'bg-slate-100 text-ink-700',
    warning: 'bg-amber-50 text-amber-700',
  }

  return (
    <span className={['rounded-full px-3 py-1 text-[11px] font-bold', tones[tone]].join(' ')}>
      {children}
    </span>
  )
}

export default StatusBadge
