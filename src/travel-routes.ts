import type { Airport } from './components/ui/airports'

export type RouteAirport = Pick<Airport, 'code' | 'city' | 'country'>
export interface Destination extends RouteAirport {
  image: string
  alt: string
}

export const destinations: Destination[] = [
  { city: 'Madrid', country: 'Espanha', code: 'MAD', image: 'madrid', alt: 'Gran Vía e Edifício Metrópolis em Madrid' },
  { city: 'Dublin', country: 'Irlanda', code: 'DUB', image: 'dublin', alt: 'Ha’penny Bridge sobre o rio Liffey em Dublin' },
  { city: 'Lisboa', country: 'Portugal', code: 'LIS', image: 'lisboa', alt: 'Elétrico amarelo em uma rua de Lisboa' },
  { city: 'Paris', country: 'França', code: 'CDG', image: 'paris', alt: 'Torre Eiffel acima dos telhados de Paris' },
  { city: 'Londres', country: 'Reino Unido', code: 'LHR', image: 'londres', alt: 'Big Ben e o Palácio de Westminster à beira do Tâmisa' },
  { city: 'Roma', country: 'Itália', code: 'FCO', image: 'roma', alt: 'Coliseu de Roma iluminado pelo sol' },
]

const saoPaulo = { code: 'GRU', city: 'São Paulo', country: 'Brasil' }
const originsByDestination: Record<string, RouteAirport> = {
  LIS: { code: 'REC', city: 'Recife', country: 'Brasil' },
  CDG: { code: 'GIG', city: 'Rio de Janeiro', country: 'Brasil' },
}

export const featuredRoutes = destinations.map(destination => ({
  origin: originsByDestination[destination.code] ?? saoPaulo,
  destination,
}))
