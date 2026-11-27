import { useRef, useState, type FormEvent } from 'react'
import { ArrowRight, MapPin, Pencil, Plane, X } from 'lucide-react'
import { featuredRoutes } from '../../travel-routes'
import { AirportField, emptyAirport, type AirportValue } from './airport-field'
import { airportLabel, loadAirports, type Airport } from './airports'

function selectAirport(airports: Airport[], code: string, custom?: Airport): AirportValue {
  const selected = custom ?? airports.find(airport => airport.code === code)
  return selected ? { selected, text: airportLabel(selected) } : emptyAirport
}

export function RouteTicket() {
  const [route, setRoute] = useState(0)
  const [overrides, setOverrides] = useState<Record<number, { origin: Airport; destination: Airport }>>({})
  const featured = overrides[route] ?? featuredRoutes[route]
  const dialog = useRef<HTMLDialogElement>(null)
  const [airports, setAirports] = useState<Airport[] | null>(null)
  const [origin, setOrigin] = useState<AirportValue>(emptyAirport)
  const [destination, setDestination] = useState<AirportValue>(emptyAirport)
  const [loadingError, setLoadingError] = useState(false)
  const [error, setError] = useState('')

  function openEditor() {
    const element = dialog.current
    if (!element) return
    setError('')
    setLoadingError(false)
    setAirports(null)
    if (!element.open) element.showModal()
    void loadAirports().then(catalog => {
      setOrigin(selectAirport(catalog, featured.origin.code, overrides[route]?.origin))
      setDestination(selectAirport(catalog, featured.destination.code, overrides[route]?.destination))
      setAirports(catalog)
    }, () => setLoadingError(true))
  }

  function saveRoute(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!origin.selected || !destination.selected) {
      setError('Selecione uma origem e um destino na lista de aeroportos.')
      return
    }
    if (origin.selected.id === destination.selected.id) {
      setError('Escolha aeroportos diferentes para a origem e o destino.')
      return
    }
    const updated = { origin: origin.selected, destination: destination.selected }
    setOverrides(current => ({ ...current, [route]: updated }))
    dialog.current?.close()
  }

  return (
    <div className="route-visual">
      <div className="orbit orbit-outer" aria-hidden="true" />
      <div className="orbit orbit-inner" aria-hidden="true" />
      <div className="ticket">
        <div className="ticket-top">
          <span className="eyebrow"><span className="signal" /> INSPIRAÇÃO DE ROTA</span>
          <button type="button" aria-label="Editar origem e destino da rota" onClick={openEditor}><Pencil size={16} aria-hidden="true" /></button>
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
      <dialog ref={dialog} className="route-editor" aria-labelledby="route-editor-title">
        <form onSubmit={saveRoute}>
          <div className="route-editor-header">
            <h2 id="route-editor-title">Editar rota</h2>
            <button type="button" aria-label="Fechar edição de rota" onClick={() => dialog.current?.close()}><X size={21} /></button>
          </div>
          {airports ? (
            <>
              <AirportField label="Origem" value={origin} onChange={value => { setOrigin(value); setError('') }}
                airports={airports} />
              <AirportField label="Destino" value={destination} onChange={value => { setDestination(value); setError('') }}
                airports={airports} />
              {error && <p className="quote-error" role="alert">{error}</p>}
              <button type="submit" className="button primary">Salvar rota</button>
            </>
          ) : loadingError ? (
            <div><p role="alert">Não foi possível carregar os aeroportos.</p><button type="button" className="button primary" onClick={openEditor}>Tentar novamente</button></div>
          ) : <p role="status">Carregando aeroportos…</p>}
        </form>
      </dialog>
    </div>
  )
}
