function DatePill({ label, sublabel, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'min-w-23 rounded-[22px] border px-4 py-3 text-left',
        active ? 'border-brand-500 bg-brand-50' : 'border-line bg-white',
      ].join(' ')}
    >
      <p className="text-sm font-extrabold text-ink-900">{label}</p>
      <p className="mt-1 text-xs text-ink-500">{sublabel}</p>
    </button>
  )
}

export default DatePill
