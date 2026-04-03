function Card({ children, className = '' }) {
  return (
    <section
      className={[
        'rounded-3xl border border-line bg-black-500 p-4 shadow-[0_8px_24px_rgba(34,35,63,0.04)]',
        className,
      ].join(' ')}
    >
      {children}
    </section>
  )
}

export default Card
