import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeftRight, ArrowUpRight, Minus, Plus } from 'lucide-react'
import { AirportField, emptyAirport, type AirportValue } from './airport-field'
import { airportLabel, loadAirports, type Airport } from './airports'
import { whatsappUrl } from '../../contact'
import { QuoteBoardingPass, type QuotePassField } from './quote-boarding-pass'

const purposes = ['Imigrar', 'Intercâmbio', 'Passeio'] as const
type TravelPurpose = typeof purposes[number]

const yesNo = ['Sim', 'Não']
const questions = [
  { name: 'criancas', summary: 'Crianças', label: 'Tem crianças na viagem?', options: yesNo },
  { name: 'bagagem', summary: 'Bagagem despachada', label: 'Precisa de bagagem despachada?', options: [...yesNo, 'A definir'] },
  { name: 'pet', summary: 'Pet', label: 'Vai viajar com pet?', options: yesNo },
]

function localToday() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDate(date: string) {
  return date ? date.split('-').reverse().join('/') : 'A definir'
}

export interface SuggestedDestination {
  code: string
  originCode?: string
}

export function FlightQuote({ suggestedDestination }: { suggestedDestination: SuggestedDestination | null }) {
  const [airports, setAirports] = useState<Airport[] | null>(null)
  const [loadingError, setLoadingError] = useState(false)
  const [origin, setOrigin] = useState<AirportValue>(emptyAirport)
  const [destination, setDestination] = useState<AirportValue>(emptyAirport)
  const [wantsRoundTrip, setWantsRoundTrip] = useState(true)
  const [purpose, setPurpose] = useState<TravelPurpose | null>(null)
  const requiresOneWay = purpose === 'Imigrar' || purpose === 'Intercâmbio'
  const roundTrip = wantsRoundTrip && !requiresOneWay
  const [departure, setDeparture] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [flexible, setFlexible] = useState(false)
  const [passengers, setPassengers] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [error, setError] = useState<{ field: string; message: string } | null>(null)
  const [activeField, setActiveField] = useState<QuotePassField | null>(null)
  const today = localToday()

  function requestCatalog() {
    if (airports) return
    setLoadingError(false)
    void loadAirports().then(setAirports, () => setLoadingError(true))
  }

  useEffect(() => {
    if (!suggestedDestination) return
    let cancelled = false
    void loadAirports().then(catalog => {
      if (cancelled) return
      setAirports(catalog)
      const airport = catalog.find(item => item.code === suggestedDestination.code)
      if (airport) setDestination({ text: airportLabel(airport), selected: airport })
      if (suggestedDestination.originCode) {
        const start = catalog.find(item => item.code === suggestedDestination.originCode)
        if (start) setOrigin({ text: airportLabel(start), selected: start })
      }
      setError(null)
    }, () => {
      if (!cancelled) setLoadingError(true)
    })
    return () => { cancelled = true }
  }, [suggestedDestination])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    function fail(field: string, message: string) {
      setError({ field, message })
      const input = field === 'origin' || field === 'destination'
        ? form.querySelectorAll<HTMLInputElement>('[role=combobox]')[field === 'origin' ? 0 : 1]
        : form.querySelector<HTMLInputElement>(`[name="${field}"]`)
      input?.focus()
    }
    if (!origin.selected) return fail('origin', 'Selecione uma origem na lista de aeroportos.')
    if (!destination.selected) return fail('destination', 'Selecione um destino na lista de aeroportos.')
    if (origin.selected.id === destination.selected.id) return fail('destination', 'Escolha um destino diferente da origem.')
    if (!departure && !flexible) return fail('ida', 'Informe a data de ida ou marque que tem flexibilidade nas datas.')
    if (departure && departure < today) return fail('ida', 'A data de ida deve ser hoje ou posterior.')
    if (roundTrip && !returnDate && !flexible) return fail('volta', 'Informe a data de volta ou marque que tem flexibilidade nas datas.')
    if (roundTrip && returnDate && returnDate < (departure || today)) return fail('volta', 'A data de volta deve ser igual ou posterior à data de ida e não pode estar no passado.')
    const missing = questions.find(question => !answers[question.name])
    if (missing) return fail(missing.name, `Responda: ${missing.label}`)

    setError(null)
    const message = [
      'Olá, VoeMagic! Gostaria de uma cotação de passagens aéreas.',
      '',
      `✈️ Origem: ${airportLabel(origin.selected)}`,
      `📍 Destino: ${airportLabel(destination.selected)}`,
      `🔄 Tipo de viagem: ${roundTrip ? 'Ida e volta' : 'Somente ida'}`,
      ...(purpose ? [`🧭 Objetivo da viagem: ${purpose}`] : []),
      `📅 Data de ida: ${formatDate(departure)}`,
      ...(roundTrip ? [`📅 Data de volta: ${formatDate(returnDate)}`] : []),
      `📅 Datas flexíveis: ${flexible ? 'Sim' : 'Não'}`,
      `👥 Passageiros: ${passengers}`,
      `👶 Crianças na viagem: ${answers.criancas}`,
      `🧳 Bagagem despachada: ${answers.bagagem}`,
      `🐾 Viagem com pet: ${answers.pet}`,
      '',
      'Aguardo minha cotação!',
    ].join('\n')
    window.location.assign(`${whatsappUrl}?text=${encodeURIComponent(message)}`)
  }

  const dateError = (name: string) => ({
    'aria-invalid': error?.field === name,
    'aria-describedby': error?.field === name ? 'quote-error' : undefined,
  })

  return (
    <div className="quote-layout">
      <form id="cotacao" className="quote" aria-labelledby="quote-title" noValidate onSubmit={submit} onChange={() => setError(null)}
        onFocus={event => {
          const field = event.target.closest<HTMLElement>('[data-pass-field]')?.dataset.passField
          setActiveField((field as QuotePassField | undefined) ?? null)
        }}
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) setActiveField(null)
        }}>
        <h2 id="quote-title">Cotar <em>passagens</em></h2>
        <fieldset className="quote-trip" data-pass-field="type">
          <legend className="sr-only">Tipo de viagem</legend>
          <label><input type="radio" name="tipo" checked={roundTrip} disabled={requiresOneWay} onChange={() => setWantsRoundTrip(true)} /> Ida e volta</label>
          <label><input type="radio" name="tipo" checked={!roundTrip} onChange={() => setWantsRoundTrip(false)} /> Somente ida</label>
        </fieldset>
        <div className="quote-route" data-pass-field="route">
          <AirportField label="Origem" value={origin} onChange={value => { setOrigin(value); setError(null) }}
            airports={airports} loadingError={loadingError} onLoad={requestCatalog} invalid={error?.field === 'origin'} />
          <button type="button" className="swap-airports" aria-label="Inverter origem e destino" onClick={() => { setOrigin(destination); setDestination(origin); setError(null) }}><ArrowLeftRight size={17} /></button>
          <AirportField label="Destino" value={destination} onChange={value => { setDestination(value); setError(null) }}
            airports={airports} loadingError={loadingError} onLoad={requestCatalog} invalid={error?.field === 'destination'} />
        </div>
        <div className="quote-dates">
          <label data-pass-field="departure">Data de ida<input type="date" name="ida" min={today} value={departure} required={!flexible} {...dateError('ida')} onChange={event => setDeparture(event.target.value)} /></label>
          {(roundTrip || requiresOneWay) && <label data-pass-field="return">Data de volta<input type="date" name="volta" min={departure > today ? departure : today}
            value={roundTrip ? returnDate : ''} disabled={!roundTrip} required={roundTrip && !flexible}
            {...dateError('volta')} onChange={event => setReturnDate(event.target.value)} /></label>}
        </div>
        <div className="quote-options" data-pass-field="preferences">
          <label className="quote-flex"><input type="checkbox" name="flexibilidade" checked={flexible} onChange={event => setFlexible(event.target.checked)} /> Tenho flexibilidade nas datas</label>
          <fieldset className="quote-purpose">
            <legend className="sr-only">Objetivo da viagem</legend>
            {purposes.map(option => (
              <label key={option}><input type="checkbox" name="objetivo" value={option} checked={purpose === option}
                onChange={() => setPurpose(current => current === option ? null : option)} /> {option}</label>
            ))}
          </fieldset>
        </div>
        {requiresOneWay && <p className="quote-purpose-note" role="status">Para {purpose === 'Imigrar' ? 'imigração' : 'intercâmbio'}, a cotação será somente ida.</p>}
        <div className="quote-passengers" data-pass-field="passengers">
          <div><strong id="passenger-label">Passageiros</strong><small>Inclua as crianças no total.</small></div>
          <div className="counter" role="group" aria-labelledby="passenger-label">
            <button type="button" aria-label="Remover passageiro" disabled={passengers <= 1} onClick={() => setPassengers(count => Math.max(1, count - 1))}><Minus size={15} /></button>
            <output aria-live="polite">{passengers}</output>
            <button type="button" aria-label="Adicionar passageiro" onClick={() => setPassengers(count => count + 1)}><Plus size={15} /></button>
          </div>
        </div>
        <div className="quote-questions" data-pass-field="preferences">
          {questions.map(({ name, label, options }) => (
            <fieldset key={name} aria-describedby={error?.field === name ? 'quote-error' : undefined}>
              <legend>{label}</legend>
              <div>{options.map(option => <label key={option}><input type="radio" name={name} value={option} checked={answers[name] === option} onChange={() => setAnswers(current => ({ ...current, [name]: option }))} required /> {option}</label>)}</div>
            </fieldset>
          ))}
        </div>
        {error && <p id="quote-error" className="quote-error" role="alert">{error.message}</p>}
        <button className="button primary quote-submit" type="submit">Solicitar cotação <ArrowUpRight size={18} /></button>
      </form>
      <QuoteBoardingPass activeField={activeField} origin={origin.selected} destination={destination.selected} roundTrip={roundTrip}
        departure={formatDate(departure)} returnDate={formatDate(returnDate)} flexible={flexible} passengers={passengers}
        preferences={[
          ...(purpose ? [{ label: 'Objetivo', value: purpose }] : []),
          ...questions.filter(({ name }) => answers[name]).map(({ name, summary }) => ({ label: summary, value: answers[name] })),
        ]} />
    </div>
  )
}
