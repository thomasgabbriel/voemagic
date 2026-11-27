import { useState } from 'react'
import { ArrowRight, Globe2, MapPin, Plane } from 'lucide-react'

interface RouteDestination {
  code: string
  city: string
  country: string
}

export function RouteTicket({ destinations }: { destinations: RouteDestination[] }) {
  const [route, setRoute] = useState(0)
  const featured = destinations[route]

  return (
    <div className="route-visual">
      <div className="orbit orbit-outer" aria-hidden="true" />
      <div className="orbit orbit-inner" aria-hidden="true" />
      <div className="ticket">
        <div className="ticket-top">
          <span className="eyebrow"><span className="signal" /> INSPIRAÇÃO DE ROTA</span>
          <Globe2 size={18} aria-hidden="true" />
        </div>
        <div className="ticket-route" aria-live="polite">
          <div><span className="airport">GRU</span><span className="airport-city">São Paulo</span></div>
          <div className="flight-line" aria-hidden="true"><Plane size={20} /></div>
          <div key={featured.code} className="ticket-destination">
            <span className="airport">{featured.code}</span><span className="airport-city">{featured.city}</span>
          </div>
        </div>
        <div className="ticket-bottom">
          <span><MapPin size={15} aria-hidden="true" /> {featured.country}</span>
          <button type="button" aria-label="Mostrar próxima rota" onClick={() => setRoute(current => (current + 1) % destinations.length)}><ArrowRight size={17} /></button>
        </div>
      </div>
    </div>
  )
}
