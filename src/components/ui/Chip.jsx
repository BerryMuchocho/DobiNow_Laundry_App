function Chip({ children, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full px-4 py-2 text-xs font-semibold transition-colors',
        active ? 'bg-ink-900 text-white' : 'bg-slate-100 text-ink-700',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export default Chip
