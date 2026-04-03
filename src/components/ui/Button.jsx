function Button({
  children,
  variant = 'primary',
  className = '',
  fullWidth = false,
  type = 'button',
  ...props
}) {
  const variants = {
    primary: 'bg-brand-500 text-white shadow-[0_14px_30px_rgba(47,128,237,0.28)]',
    secondary: 'bg-brand-50 text-brand-600',
    ghost: 'bg-slate-100 text-ink-700',
    outline: 'border border-line bg-white text-ink-900',
    success: 'bg-emerald-500 text-white',
  }

  return (
    <button
      type={type}
      className={[
        'inline-flex min-h-11 items-center justify-center rounded-2xl px-4 text-[13px] font-extrabold transition-transform active:scale-[0.98]',
        variants[variant],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
