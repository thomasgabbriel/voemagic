import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowUp, ArrowUpRight, Compass, Headphones, MapPin, Menu, MessageCircle, Plane, Route, X } from 'lucide-react'
import '@fontsource-variable/manrope'
import '@fontsource-variable/inter-tight'
import '@fontsource-variable/geist-mono'
import '@fontsource/instrument-serif/latin-400-italic.css'
import './styles.css'
import logoUrl from './assets/voemagic-logo.webp?inline'
import { PixelField } from './components/ui/pixel-field'
import { FlightQuote, type SuggestedDestination } from './components/ui/flight-quote'
import { RouteTicket } from './components/ui/route-ticket'
import { TravelBenefits } from './components/ui/travel-benefits'
import { whatsappUrl } from './contact'

const destinations = [
  { city: 'Madrid', country: 'Espanha', code: 'MAD', image: 'madrid', alt: 'Gran Vía e Edifício Metrópolis em Madrid' },
  { city: 'Dublin', country: 'Irlanda', code: 'DUB', image: 'dublin', alt: 'Ha’penny Bridge sobre o rio Liffey em Dublin' },
]

const steps = [
  { icon: Compass, title: 'Conte como quer viajar', detail: 'Praia ou cidade, dias cheios ou tempo de sobra. Tudo começa com o seu jeito de viajar.' },
  { icon: Route, title: 'Desenhe seu roteiro', detail: 'Alinhe voos, hospedagem e experiências em um roteiro que cabe no seu tempo e no seu orçamento.' },
  { icon: Headphones, title: 'Viaje com suporte', detail: 'Conte com orientação para preparar o embarque e com apoio ao longo da viagem.' },
]

function Brand() {
  return <a href="#inicio" className="brand" aria-label="VoeMagic, início"><img src={logoUrl} alt="" width="360" height="142" /></a>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [suggestedDestination, setSuggestedDestination] = useState<SuggestedDestination | null>(null)

  return (
    <>
      <a className="skip-link" href="#destinos">Ir para os destinos</a>
      <main id="inicio">
        <section className="hero" aria-labelledby="hero-title">
          <PixelField />
          <header className="header">
            <Brand />
            <button type="button" className="menu-toggle" aria-expanded={menuOpen} aria-controls="menu" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
            <nav id="menu" aria-label="Navegação principal" className={menuOpen ? 'nav open' : 'nav'}>
              <a href="#destinos" onClick={() => setMenuOpen(false)}>Destinos</a>
              <a href="#como-funciona" onClick={() => setMenuOpen(false)}>Como funciona</a>
              <a href="#cotacao" onClick={() => setMenuOpen(false)}>Cotação</a>
            </nav>
            <a className="header-cta" href="#cotacao">Cotar meu voo <ArrowUpRight size={16} /></a>
          </header>

          <div className="hero-body">
            <div className="hero-copy">
              <h1 id="hero-title"><span>O mundo te espera. <em>Voe.</em></span></h1>
              <p>Do primeiro voo à volta para casa, a VoeMagic planeja viagens do seu jeito.</p>
            </div>

            <RouteTicket destinations={destinations} />

            <div className="hero-actions">
              <a className="hero-button hero-button-primary" href="#cotacao">Cotar passagens</a>
              <a className="hero-button hero-button-secondary" href="#destinos">Explorar destinos</a>
            </div>
          </div>

          <div className="shelf">
            <span><Plane size={16} /> Voos</span>
            <span><MapPin size={16} /> Hospedagem</span>
            <span><Compass size={16} /> Roteiros sob medida</span>
          </div>
        </section>

        <section className="section quote-section" aria-labelledby="quote-section-title">
          <div className="section-heading">
            <div><span className="eyebrow section-label"><Plane size={14} /> PASSAGENS AÉREAS</span><h2 id="quote-section-title">Qual é o seu <em>próximo voo?</em></h2></div>
            <p>Conte os detalhes da viagem e envie seu pedido de cotação pelo WhatsApp.</p>
          </div>
          <FlightQuote suggestedDestination={suggestedDestination} />
        </section>

        <section id="destinos" className="section destinations" aria-labelledby="destinations-title">
          <div className="section-heading">
            <div><span className="eyebrow section-label"><MapPin size={14} /> DESTINOS</span><h2 id="destinations-title">Onde você quer <em>pousar?</em></h2></div>
            <p>Do Brasil para o mundo, encontre o destino que combina com a sua próxima viagem.</p>
          </div>
          <div className="destination-grid">
            {destinations.map(({ city, country, code, image, alt }) => (
              <a key={city} className="destination" href="#cotacao" onClick={() => setSuggestedDestination({ code })} aria-label={`Cotar viagem para ${city}`}>
                <img src={`/images/${image}.webp`} alt={alt} width="700" height="700" loading="lazy" />
                <div className="destination-code eyebrow">{code}</div>
                <div className="destination-caption"><div><span className="eyebrow">{country}</span><h3>{city}</h3></div><span className="destination-arrow"><ArrowUpRight size={22} /></span></div>
              </a>
            ))}
          </div>
        </section>

        <TravelBenefits />

        <section id="como-funciona" className="section how" aria-labelledby="how-title">
          <div className="section-heading"><div><span className="eyebrow section-label"><Route size={14} /> COMO FUNCIONA</span><h2 id="how-title">Do desejo ao <em>embarque.</em></h2></div></div>
          <div className="steps">
            {steps.map(({ icon: Icon, title, detail }) => <article key={title}><span className="step-icon"><Icon size={22} /></span><h3>{title}</h3><p>{detail}</p></article>)}
          </div>
        </section>

      </main>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-intro">
              <Brand />
              <p>Passagens aéreas e viagens sob medida, do primeiro voo à volta para casa.</p>
            </div>
            <nav className="footer-links" aria-labelledby="footer-explore">
              <h2 id="footer-explore">Explore</h2>
              <a href="#destinos">Destinos</a>
              <a href="#por-que-voemagic">Por que VoeMagic</a>
              <a href="#como-funciona">Como funciona</a>
            </nav>
            <nav className="footer-links" aria-labelledby="footer-routes">
              <h2 id="footer-routes">Rotas em destaque</h2>
              {destinations.map(({ code, city }) => (
                <a key={code} href="#cotacao" onClick={() => setSuggestedDestination({ code, originCode: 'GRU' })}>São Paulo → {city}</a>
              ))}
            </nav>
            <div className="footer-links footer-contact">
              <h2>Fale com a VoeMagic</h2>
              <a className="footer-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden="true" /> Atendimento no WhatsApp <ArrowUpRight size={15} aria-hidden="true" /></a>
              <a href="#cotacao">Solicitar cotação</a>
            </div>
          </div>
          <div className="footer-bottom">
            <small>© {new Date().getFullYear()} VoeMagic. Todos os direitos reservados.</small>
            <a href="#inicio">Voltar ao topo <ArrowUp size={15} aria-hidden="true" /></a>
          </div>
        </div>
      </footer>
    </>
  )
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
