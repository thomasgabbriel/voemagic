import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Destination } from '../../travel-routes'

export function DestinationCarousel({ destinations, onSelect }: { destinations: Destination[]; onSelect: (code: string) => void }) {
  const track = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  function updateEdges() {
    const element = track.current
    if (!element) return
    const start = element.scrollLeft <= 1
    const end = element.scrollLeft + element.clientWidth >= element.scrollWidth - 1
    setEdges(current => current.start === start && current.end === end ? current : { start, end })
  }

  useEffect(() => {
    const element = track.current
    if (!element) return
    const observer = new ResizeObserver(updateEdges)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  function scroll(direction: -1 | 1) {
    const element = track.current
    if (!element) return
    const first = element.children[0]
    const second = element.children[1]
    if (!first || !second) return
    const step = second.getBoundingClientRect().left - first.getBoundingClientRect().left
    element.scrollBy({ left: direction * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  return (
    <div className="destination-carousel" role="group" aria-label="Carrossel de destinos">
      <div className="destination-controls">
        <button type="button" aria-label="Destinos anteriores" aria-controls="destination-track" disabled={edges.start} onClick={() => scroll(-1)}><ArrowLeft size={20} /></button>
        <button type="button" aria-label="Próximos destinos" aria-controls="destination-track" disabled={edges.end} onClick={() => scroll(1)}><ArrowRight size={20} /></button>
      </div>
      <div id="destination-track" className="destination-grid" ref={track} onScroll={updateEdges}>
        {destinations.map(({ city, country, code, image, alt }) => (
          <a key={code} className="destination" href="#cotacao" onClick={() => onSelect(code)} aria-label={`Cotar viagem para ${city}`}>
            <img src={`/images/${image}.webp`} alt={alt} width="700" height="700" loading="lazy" />
            <div className="destination-code eyebrow">{code}</div>
            <div className="destination-caption"><div><span className="eyebrow">{country}</span><h3>{city}</h3></div><span className="destination-arrow"><ArrowUpRight size={22} /></span></div>
          </a>
        ))}
      </div>
    </div>
  )
}
