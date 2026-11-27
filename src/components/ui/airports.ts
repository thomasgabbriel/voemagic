export interface Airport {
  id: string
  code: string
  city: string
  name: string
  country: string
  rank: number
  search: string
  normalizedCity: string
  normalizedName: string
}

type Row = [string, string, string, string, number, string]
const regionNames = new Intl.DisplayNames(['pt-BR'], { type: 'region' })
const metros: Row[] = [
  ['SAO', 'São Paulo', 'Todos os aeroportos', 'BR', 8, 'metro-SAO'],
  ['RIO', 'Rio de Janeiro', 'Todos os aeroportos', 'BR', 8, 'metro-RIO'],
  ['BHZ', 'Belo Horizonte', 'Todos os aeroportos', 'BR', 8, 'metro-BHZ'],
  ['NYC', 'Nova York', 'Todos os aeroportos', 'US', 8, 'metro-NYC'],
  ['LON', 'Londres', 'Todos os aeroportos', 'GB', 8, 'metro-LON'],
  ['PAR', 'Paris', 'Todos os aeroportos', 'FR', 8, 'metro-PAR'],
  ['ROM', 'Roma', 'Todos os aeroportos', 'IT', 8, 'metro-ROM'],
  ['MIL', 'Milão', 'Todos os aeroportos', 'IT', 8, 'metro-MIL'],
  ['BUE', 'Buenos Aires', 'Todos os aeroportos', 'AR', 8, 'metro-BUE'],
  ['TYO', 'Tóquio', 'Todos os aeroportos', 'JP', 8, 'metro-TYO'],
  ['SEL', 'Seul', 'Todos os aeroportos', 'KR', 8, 'metro-SEL'],
  ['CHI', 'Chicago', 'Todos os aeroportos', 'US', 8, 'metro-CHI'],
  ['WAS', 'Washington', 'Todos os aeroportos', 'US', 8, 'metro-WAS'],
  ['YTO', 'Toronto', 'Todos os aeroportos', 'CA', 8, 'metro-YTO'],
  ['YMQ', 'Montreal', 'Todos os aeroportos', 'CA', 8, 'metro-YMQ'],
  ['STO', 'Estocolmo', 'Todos os aeroportos', 'SE', 8, 'metro-STO'],
  ['MOW', 'Moscou', 'Todos os aeroportos', 'RU', 8, 'metro-MOW'],
  ['OSA', 'Osaka', 'Todos os aeroportos', 'JP', 8, 'metro-OSA'],
  ['BJS', 'Pequim', 'Todos os aeroportos', 'CN', 8, 'metro-BJS'],
  ['SPK', 'Sapporo', 'Todos os aeroportos', 'JP', 8, 'metro-SPK'],
  ['REK', 'Reykjavík', 'Todos os aeroportos', 'IS', 8, 'metro-REK'],
  ['TCI', 'Tenerife', 'Todos os aeroportos', 'ES', 8, 'metro-TCI'],
  ['BAK', 'Baku', 'Todos os aeroportos', 'AZ', 8, 'metro-BAK'],
]

const aliases: Record<string, [city: string, name?: string, keywords?: string]> = {
  NYC: ['Nova York', undefined, 'New York'],
  LON: ['Londres', undefined, 'London'],
  ROM: ['Roma', undefined, 'Rome'],
  MIL: ['Milão', undefined, 'Milan'],
  TYO: ['Tóquio', undefined, 'Tokyo'],
  SEL: ['Seul', undefined, 'Seoul'],
  STO: ['Estocolmo', undefined, 'Stockholm'],
  MOW: ['Moscou', undefined, 'Moscow'],
  BJS: ['Pequim', undefined, 'Beijing'],
  GRU: ['São Paulo', 'Aeroporto Internacional de Guarulhos', 'Guarulhos'],
  CGH: ['São Paulo', 'Aeroporto de Congonhas'],
  VCP: ['Campinas', 'Aeroporto Internacional de Viracopos', 'São Paulo'],
  GIG: ['Rio de Janeiro', 'Aeroporto Internacional do Galeão'],
  SDU: ['Rio de Janeiro', 'Aeroporto Santos Dumont'],
  MAD: ['Madrid', 'Aeroporto Adolfo Suárez Madrid-Barajas', 'Madri'],
  FCO: ['Roma', 'Aeroporto de Roma-Fiumicino', 'Rome'],
  CIA: ['Roma', undefined, 'Rome'],
  JTR: ['Santorini', 'Aeroporto de Santorini', 'Thira'],
  LIS: ['Lisboa', 'Aeroporto Humberto Delgado', 'Lisbon'],
  JFK: ['Nova York', undefined, 'New York'],
  LGA: ['Nova York', undefined, 'New York'],
  EWR: ['Newark', undefined, 'Nova York New York'],
  LHR: ['Londres', undefined, 'London'],
  LGW: ['Londres', undefined, 'London'],
  STN: ['Londres', undefined, 'London'],
  LTN: ['Londres', undefined, 'London'],
  LCY: ['Londres', undefined, 'London'],
}

export function normalize(value: string) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu, ' ').trim()
}

let catalog: Promise<Airport[]> | undefined

export function loadAirports() {
  catalog ??= fetch('/data/airports.json')
    .then(response => {
      if (!response.ok) throw new Error('Falha ao carregar a base')
      return response.json() as Promise<[Record<string, string>, Row[]]>
    })
    .then(([countries, rows]) => {
      const localized = Object.fromEntries(Object.keys(countries).map(code => [code, regionNames.of(code) || countries[code]]))
      return [...metros, ...rows].map(([code, originalCity, originalName, region, rank, id]) => {
        const [city = originalCity, name = originalName, keywords = ''] = aliases[code] ?? []
        const country = localized[region] ?? region
        return {
          id, code, city, name, country, rank,
          normalizedCity: normalize(city),
          normalizedName: normalize(name),
          search: normalize([code, city, originalCity, name, originalName, country, countries[region], keywords].join(' ')),
        }
      })
    })
    .catch((error: unknown) => {
      catalog = undefined
      throw error
    })
  return catalog
}

export function findAirports(airports: Airport[], value: string) {
  const query = normalize(value)
  if (!query) return []
  const words = query.split(' ')
  return airports.flatMap(airport => {
    if (!words.every(word => airport.search.includes(word))) return []
    const code = airport.code.toLowerCase()
    const { normalizedCity: city, normalizedName: name } = airport
    const score = code === query ? 1000 :
      (city === query ? 80 : city.startsWith(query) ? 55 : name.startsWith(query) ? 35 : code.startsWith(query) ? 25 : 0)
    return [{ airport, score: score + airport.rank * 5 }]
  }).sort((a, b) => b.score - a.score).slice(0, 7).map(({ airport }) => airport)
}

export function airportLabel(airport: Airport) {
  return `${airport.city || airport.name} — ${airport.code}`
}
