import { useState } from 'react'
import { ArrowRight, MapPin, Plane } from 'lucide-react'
import { featuredRoutes } from '../../travel-routes'

export function RouteTicket() {
  const [route, setRoute] = useState(0)
  const featured = featuredRoutes[route]

  return (
    <div className="route-visual">
      <div className="orbit orbit-outer" aria-hidden="true" />
      <div className="orbit orbit-inner" aria-hidden="true" />
      <div className="ticket">
        <div className="ticket-top">
          <span className="eyebrow"><span className="signal" /> INSPIRAÇÃO DE ROTA</span>
        </div>
        <div className="ticket-route" aria-live="polite">
          <div><span className="airport">{featured.origin.code}</span><span className="airport-city">{featured.origin.city}</span></div>
          <div className="flight-line" aria-hidden="true"><Plane size={20} /></div>
          <div key={featured.destination.code} className="ticket-destination">
            <span className="airport">{featured.destination.code}</span><span className="airport-city">{featured.destination.city}</span>
          </div>
        </div>
        <div className="ticket-bottom">
          <span><MapPin size={15} aria-hidden="true" /> {featured.origin.country} → {featured.destination.country}</span>
          <button type="button" aria-label="Mostrar próxima rota" onClick={() => setRoute(current => (current + 1) % featuredRoutes.length)}><ArrowRight size={17} /></button>
        </div>
      </div>
    </div>
  )
}
