import { ArrowRight, Ticket } from 'lucide-react'
import type { Airport } from './airports'
import logoUrl from '../../assets/voemagic-logo.webp?inline'

export type QuotePassField = 'type' | 'route' | 'departure' | 'return' | 'passengers' | 'preferences'

interface BoardingPassProps {
  activeField: QuotePassField | null
  origin: Airport | null
  destination: Airport | null
  roundTrip: boolean
  departure: string
  returnDate: string
  flexible: boolean
  passengers: number
  preferences: { label: string; value: string }[]
}

function AirportSummary({ label, airport }: { label: string; airport: Airport | null }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>
        <strong key={airport?.code}>{airport?.code ?? '—'}</strong>
        <span>{airport ? airport.city || airport.name : 'A definir'}</span>
      </dd>
    </div>
  )
}

export function QuoteBoardingPass({ origin, destination, roundTrip, departure, returnDate, flexible, passengers, preferences, activeField }: BoardingPassProps) {
  const highlight = (field: QuotePassField) => activeField === field ? 'true' : undefined

  return (
    <aside className="quote-pass" aria-label="Prévia da cotação">
      <header className="quote-pass-header">
        <span className="quote-pass-type" data-highlight={highlight('type')}>{roundTrip ? 'Ida e volta' : 'Somente ida'}</span>
      </header>
      <div className="quote-pass-body">
        <div className="quote-pass-route" data-highlight={highlight('route')}>
          <dl>
            <AirportSummary label="Origem" airport={origin} />
            <AirportSummary label="Destino" airport={destination} />
          </dl>
          <div className="quote-pass-track" aria-hidden="true"><ArrowRight size={17} /></div>
        </div>
        <dl className="quote-pass-details">
          <div data-highlight={highlight('departure')}><dt>Ida</dt><dd>{departure}</dd></div>
          {roundTrip && <div data-highlight={highlight('return')}><dt>Volta</dt><dd>{returnDate}</dd></div>}
          <div data-highlight={highlight('passengers')}><dt>Passageiros</dt><dd>{passengers}</dd></div>
        </dl>
        <ul className="quote-pass-preferences" aria-label="Preferências da viagem" data-highlight={highlight('preferences')}>
            {!flexible && preferences.length === 0 && <li className="quote-pass-empty">Preferências a definir</li>}
            {flexible && <li>Datas flexíveis</li>}
            {preferences.map(({ label, value }) => <li key={label}>{label}: {value}</li>)}
          </ul>
      </div>
      <footer className="quote-pass-stub">
        <Ticket size={17} aria-hidden="true" />
        <span>Cotação de passagens</span>
        <img className="quote-pass-logo" src={logoUrl} alt="VoeMagic" width="360" height="142" />
      </footer>
    </aside>
  )
}
