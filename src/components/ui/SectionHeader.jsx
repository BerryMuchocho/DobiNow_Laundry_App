function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="space-y-2">
      {eyebrow ? (
        <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-600">
          {eyebrow}
        </p>
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-[30px] font-extrabold leading-[1.02] tracking-[-0.04em] text-ink-900">
            {title}
          </h1>
          {subtitle ? <p className="text-sm leading-6 text-ink-500">{subtitle}</p> : null}
        </div>
        {action}
      </div>
    </div>
  )
}

export default SectionHeader
