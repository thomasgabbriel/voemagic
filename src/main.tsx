import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowUp, ArrowUpRight, Compass, Headphones, MapPin, Menu, MessageCircle, Plane, Route, X } from 'lucide-react'
import '@fontsource-variable/manrope'
import '@fontsource-variable/inter-tight'
import '@fontsource-variable/geist-mono'
import '@fontsource/instrument-serif/latin-400.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import './styles.css'
import logoUrl from './assets/voemagic-logo.webp?inline'
import { PixelField } from './components/ui/pixel-field'
import { FlightQuote, type SuggestedDestination } from './components/ui/flight-quote'
import { RouteTicket } from './components/ui/route-ticket'
import { HeroPostcards } from './components/ui/hero-postcards'
import { DestinationCarousel } from './components/ui/destination-carousel'
import { destinations } from './travel-routes'
import { TravelBenefits } from './components/ui/travel-benefits'
import { CustomerReviews } from './components/ui/customer-reviews'
import { whatsappUrl } from './contact'

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
              <p>Da escolha da passagem ao embarque, a VoeMagic cuida dos detalhes para você viajar com tranquilidade.</p>
            </div>

            <RouteTicket />

            <div className="hero-actions">
              <a className="hero-button hero-button-primary" href="#cotacao">Cotar passagens</a>
              <a className="hero-button hero-button-secondary" href="#destinos">Explorar destinos</a>
            </div>
          </div>

          <HeroPostcards />

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

        <CustomerReviews />

        <section id="destinos" className="section destinations" aria-labelledby="destinations-title">
          <div className="section-heading">
            <div><span className="eyebrow section-label"><MapPin size={14} /> DESTINOS</span><h2 id="destinations-title">Onde você quer <em>pousar?</em></h2></div>
            <p>Do Brasil para o mundo, encontre o destino que combina com a sua próxima viagem.</p>
          </div>
          <DestinationCarousel destinations={destinations} onSelect={code => setSuggestedDestination({ code })} />
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
              <a href="#avaliacoes">Avaliações</a>
            </nav>
            <nav className="footer-links" aria-labelledby="footer-routes">
              <h2 id="footer-routes">Rotas em destaque</h2>
              {destinations.slice(0, 2).map(({ code, city }) => (
                <a key={code} href="#cotacao" onClick={() => setSuggestedDestination({ code, originCode: 'GRU' })}>São Paulo → {city}</a>
              ))}
            </nav>
            <div className="footer-links footer-contact">
              <h2>Fale com a VoeMagic</h2>
              <a className="footer-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden="true" /> Atendimento no WhatsApp <ArrowUpRight size={15} aria-hidden="true" /></a>
              <a href="#cotacao">Solicitar cotação</a>
              <a href="mailto:contato@voemagic.com">contato@voemagic.com</a>
            </div>
          </div>
          <div className="footer-bottom">
            <small>© {new Date().getFullYear()} VoeMagic. Todos os direitos reservados.</small>
            <a href="#inicio">Voltar ao topo <ArrowUp size={15} aria-hidden="true" /></a>
          </div>
        </div>
      </footer>
      <a className="floating-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Falar com a VoeMagic no WhatsApp">
        <svg viewBox="0 0 16 16" width="29" height="29" fill="currentColor" aria-hidden="true">
          <path d="M13.601 2.326A7.85 7.85 0 0 0 8.01 0C3.655 0 .106 3.547.104 7.903c0 1.391.363 2.75 1.054 3.947L.038 15.946l4.193-1.1a7.9 7.9 0 0 0 3.777.962h.003c4.354 0 7.903-3.546 7.905-7.903a7.86 7.86 0 0 0-2.315-5.579zM8.011 14.473h-.003a6.57 6.57 0 0 1-3.345-.916l-.24-.142-2.488.653.664-2.426-.157-.249a6.56 6.56 0 0 1-1.004-3.49c.002-3.62 2.951-6.568 6.575-6.568a6.53 6.53 0 0 1 4.646 1.925 6.53 6.53 0 0 1 1.921 4.649c-.001 3.62-2.949 6.564-6.569 6.564zm3.604-4.915c-.197-.099-1.168-.576-1.349-.642-.18-.066-.312-.099-.443.099-.132.197-.51.642-.625.774-.115.132-.23.148-.428.05-.197-.1-.833-.308-1.587-.98-.587-.524-.983-1.171-1.098-1.368-.115-.198-.012-.305.087-.403.089-.088.198-.23.296-.346.099-.115.132-.197.198-.329.065-.132.032-.247-.017-.346-.05-.099-.444-1.07-.608-1.466-.16-.385-.324-.333-.444-.339-.115-.006-.247-.007-.379-.007a.73.73 0 0 0-.526.247c-.18.198-.69.675-.69 1.646 0 .972.707 1.91.806 2.042.098.132 1.39 2.122 3.367 2.977.47.203.838.326 1.124.416.472.15.902.129 1.242.078.378-.056 1.168-.477 1.332-.938.165-.46.165-.856.115-.938-.049-.083-.18-.132-.378-.231z" />
        </svg>
      </a>
    </>
  )
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
