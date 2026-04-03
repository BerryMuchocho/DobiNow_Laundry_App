function Input({ icon: Icon, className = '', ...props }) {
  return (
    <label
      className={[
        'flex items-center gap-3 rounded-[20px] border border-line bg-surface-soft px-4 py-3',
        className,
      ].join(' ')}
    >
      {Icon ? <Icon size={18} className="text-ink-500" /> : null}
      <input
        className="w-full border-none bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-500"
        {...props}
      />
    </label>
  )
}

export default Input
