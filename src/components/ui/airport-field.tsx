import { useId, useMemo, useState, type KeyboardEvent } from 'react'
import { MapPin, X } from 'lucide-react'
import { airportLabel, findAirports, type Airport } from './airports'

export interface AirportValue {
  text: string
  selected: Airport | null
}

export const emptyAirport: AirportValue = { text: '', selected: null }

export function AirportField({ label, value, onChange, airports, loadingError, onLoad, invalid }: {
  label: string
  value: AirportValue
  onChange: (value: AirportValue) => void
  airports: Airport[] | null
  loadingError?: boolean
  onLoad?: () => void
  invalid?: boolean
}) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const [active, setActive] = useState(-1)
  const open = focused && !value.selected && value.text.trim().length > 0
  const matches = useMemo(() => open && airports ? findAirports(airports, value.text) : [], [airports, open, value.text])

  function choose(airport: Airport) {
    onChange({ text: airportLabel(airport), selected: airport })
    setActive(-1)
  }

  function handleKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      setFocused(false)
      return
    }
    if (!matches.length) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      const next = active < 0 ? (direction === 1 ? 0 : matches.length - 1) : (active + direction + matches.length) % matches.length
      setActive(next)
      document.getElementById(`${id}-${next}`)?.scrollIntoView({ block: 'nearest' })
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      choose(matches[active] ?? matches[0])
    }
  }

  return (
    <div className="airport-field">
      <label htmlFor={id}>{label}</label>
      <div className="airport-input">
        <MapPin size={16} aria-hidden="true" />
        <input id={id} role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={open ? `${id}-list` : undefined}
          aria-activedescendant={open && matches[active] ? `${id}-${active}` : undefined} aria-required="true"
          aria-invalid={invalid} aria-describedby={invalid ? 'quote-error' : undefined} autoComplete="off"
          value={value.text} placeholder="Cidade ou aeroporto" onKeyDown={handleKey}
          onFocus={() => { setFocused(true); onLoad?.() }}
          onBlur={() => { setFocused(false); setActive(-1) }}
          onChange={event => { onChange({ text: event.target.value, selected: null }); setFocused(true); setActive(-1) }} />
        {value.text && <button type="button" className="field-clear" aria-label={`Limpar ${label.toLowerCase()}`}
          onClick={() => { onChange(emptyAirport); setActive(-1); document.getElementById(id)?.focus() }}><X size={15} /></button>}
      </div>
      {open && (
        <div className="airport-popover">
          <ul id={`${id}-list`} role="listbox" aria-label={`Sugestões de ${label.toLowerCase()}`}>
            {matches.map((airport, index) => (
              <li key={airport.id} id={`${id}-${index}`} role="option" aria-selected={index === active}
                onMouseDown={event => event.preventDefault()} onClick={() => choose(airport)}>
                <code>{airport.code}</code><span><strong>{airport.city || airport.name}</strong>
                <small>{airport.city ? `${airport.name} · ` : ''}{airport.country}</small></span>
              </li>
            ))}
          </ul>
          {!matches.length && <p role="status">{loadingError ? 'Falha ao carregar aeroportos. Saia do campo e tente novamente.' : airports ? 'Nenhum aeroporto encontrado.' : 'Carregando aeroportos…'}</p>}
        </div>
      )}
    </div>
  )
}
