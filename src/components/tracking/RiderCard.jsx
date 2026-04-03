import { Phone, MessageSquare } from 'lucide-react'

function RiderCard({ riderName, riderPhone, riderRating, riderPhoto }) {
  return (
    /*
     * Deep blue card — matches the design's solid brand-blue background.
     * We're not using the generic <Card> wrapper here because it applies
     * default white backgrounds and padding we'd have to fight against.
     */
    <div className="bg-brand-600 rounded-2xl px-4 py-4 flex items-center gap-4">

      {/* Rider photo — circular, with a dark ring to lift it off the blue background */}
      <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/20 shrink-0">
        {riderPhoto ? (
          <img
            src={riderPhoto}
            alt={riderName}
            className="w-full h-full object-cover"
          />
        ) : (
          // Fallback initials avatar when no photo is available
          <div className="w-full h-full bg-brand-700 flex items-center justify-center
                          text-white font-bold text-lg">
            {riderName?.charAt(0) ?? '?'}
          </div>
        )}
      </div>

      {/* Rider name + rating — takes up the remaining space */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-base leading-tight truncate">
          {riderName}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {/* Star rating */}
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-white/80 text-xs font-medium">
            {riderRating} • Your Dobi Rider
          </span>
        </div>
      </div>

      {/* Action buttons — circular icon buttons for phone and chat */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => window.open(`tel:${riderPhone}`)}
          className="w-10 h-10 rounded-full bg-brand-500 hover:bg-brand-400
                     flex items-center justify-center transition-all"
          aria-label="Call rider"
        >
          <Phone size={16} className="text-white" />
        </button>
        <button
          className="w-10 h-10 rounded-full bg-brand-500 hover:bg-brand-400
                     flex items-center justify-center transition-all"
          aria-label="Message rider"
        >
          <MessageSquare size={16} className="text-white" />
        </button>
      </div>

    </div>
  )
}

export default RiderCard