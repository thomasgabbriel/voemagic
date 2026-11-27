import { useState } from 'react'
import { destinations, type Destination } from '../../travel-routes'

type Postcard = Pick<Destination, 'city' | 'country' | 'image'>

const leftPostcards: Postcard[] = [
  destinations[0],
  { city: 'Nova York', country: 'Estados Unidos', image: 'postcard-new-york' },
  destinations[2],
  { city: 'Rio de Janeiro', country: 'Brasil', image: 'rio' },
  destinations[4],
]

const rightPostcards: Postcard[] = [
  destinations[1],
  { city: 'Tóquio', country: 'Japão', image: 'postcard-tokyo' },
  destinations[3],
  { city: 'Cidade do Cabo', country: 'África do Sul', image: 'postcard-cape-town' },
  destinations[5],
]

function PostcardScene({ postcards }: { postcards: Postcard[] }) {
  const [index, setIndex] = useState(0)
  const postcard = postcards[index]

  return (
    <div className="hero-scene" onPointerEnter={event => {
      if (event.pointerType === 'mouse') setIndex(current => (current + 1) % postcards.length)
    }}>
      <div className="hero-scene-card">
        <div key={postcard.image} className="hero-scene-photo">
          <img src={`/images/${postcard.image}.webp`} alt="" width="700" height="700" loading="lazy" />
          <span className="hero-scene-caption">
            <span className="eyebrow">{postcard.country}</span>
            <strong>{postcard.city}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}

export function HeroPostcards() {
  return (
    <div className="hero-scenes" aria-hidden="true">
      <PostcardScene postcards={leftPostcards} />
      <PostcardScene postcards={rightPostcards} />
    </div>
  )
}
