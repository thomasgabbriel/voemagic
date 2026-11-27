import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, MessageCircle, Star } from 'lucide-react'
import { customerReviews } from '../../customer-reviews'

function Rating({ value }: { value: number }) {
  const label = value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
  return (
    <span className="review-stars" role="img" aria-label={`${label} de 5 estrelas`}>
      {Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} fill={index < Math.round(value) ? 'currentColor' : 'none'} aria-hidden="true" />)}
    </span>
  )
}

export function CustomerReviews() {
  const track = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ start: true, end: true })
  const count = customerReviews.length
  const average = count ? customerReviews.reduce((sum, review) => sum + review.rating, 0) / count : 0

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

  function scrollReviews(direction: -1 | 1) {
    const element = track.current
    if (!element || element.children.length < 2) return
    const distance = element.children[1].getBoundingClientRect().left - element.children[0].getBoundingClientRect().left
    element.scrollBy({
      left: direction * distance,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
  }

  return (
    <section id="avaliacoes" className="section customer-reviews" aria-labelledby="reviews-title">
      <div className="section-heading">
        <h2 id="reviews-title">O que nossos <em>clientes dizem</em></h2>
        {count > 0 && (
          <div className="review-summary">
            <strong>{average.toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}</strong>
            <Rating value={average} />
            <span>{count} {count === 1 ? 'avaliação' : 'avaliações'}</span>
          </div>
        )}
      </div>

      {count === 0 ? (
        <div className="review-empty">
          <MessageCircle size={22} aria-hidden="true" />
          <p>Ainda não há avaliações publicadas aqui.</p>
        </div>
      ) : (
        <>
          {(!edges.start || !edges.end) && <div className="destination-controls">
            <button type="button" disabled={edges.start} onClick={() => scrollReviews(-1)} aria-controls="review-track" aria-label="Avaliações anteriores"><ArrowLeft size={18} aria-hidden="true" /></button>
            <button type="button" disabled={edges.end} onClick={() => scrollReviews(1)} aria-controls="review-track" aria-label="Próximas avaliações"><ArrowRight size={18} aria-hidden="true" /></button>
          </div>}
          <ul id="review-track" className="review-track" ref={track} onScroll={updateEdges}>
            {customerReviews.map(review => (
              <li key={review.id} className="review-card">
                <div className="review-author">
                  <span aria-hidden="true">{review.author.trim().charAt(0).toLocaleUpperCase('pt-BR')}</span>
                  <strong>{review.author}</strong>
                </div>
                <Rating value={review.rating} />
                <blockquote>{review.comment}</blockquote>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
