import { useState } from 'react'
import { ArrowRight, ArrowUpRight, Globe2, Headphones, PawPrint, Plane } from 'lucide-react'
import { whatsappUrl } from '../../contact'

const benefits = [
  {
    id: 'voos', label: 'Passagens aéreas', icon: Plane, image: 'benefit-flight',
    title: 'Encontre o voo que faz sentido para você.',
    description: 'Informe seu destino, suas datas e o que precisa levar. A VoeMagic ajuda a comparar as opções de acordo com a sua viagem.',
    action: 'Cotar passagens', href: '#cotacao',
  },
  {
    id: 'europa', label: 'Destinos na Europa', icon: Globe2, image: 'madrid',
    title: 'De São Paulo a Madrid ou Dublin.',
    description: 'Comece por um dos nossos destinos em destaque e planeje o embarque de acordo com seus planos na Europa.',
    action: 'Ver os destinos', href: '#destinos',
  },
  {
    id: 'pets', label: 'Viagem com pets', icon: PawPrint, image: 'benefit-pet',
    title: 'Leve seu pet em consideração desde a cotação.',
    description: 'Avise se ele vai junto. As regras de transporte variam conforme a companhia e o destino, e a gente ajuda você a entender o que verificar.',
    action: 'Cotar viagem com pet', href: '#cotacao',
  },
  {
    id: 'atendimento', label: 'Atendimento direto', icon: Headphones, image: 'benefit-support',
    title: 'Converse com a VoeMagic antes de decidir.',
    description: 'Tire dúvidas sobre conexões, bagagem e embarque pelo WhatsApp para escolher seu próximo voo com mais clareza.',
    action: 'Falar pelo WhatsApp', href: whatsappUrl,
  },
]

export function TravelBenefits() {
  const [activeIndex, setActiveIndex] = useState(0)
  const benefit = benefits[activeIndex]

  return (
    <section id="por-que-voemagic" className="section travel-benefits" aria-labelledby="travel-benefits-title">
      <div className="section-heading">
        <h2 id="travel-benefits-title">Por que viajar com a <em>VoeMagic?</em></h2>
        <p>Da escolha do voo aos detalhes do embarque, veja como podemos ajudar na sua próxima viagem.</p>
      </div>
      <div className="benefits-layout">
        <div className="benefit-options" role="group" aria-label="Serviços da VoeMagic">
          {benefits.map(({ id, label, icon: Icon }, index) => (
            <button key={id} type="button" aria-pressed={index === activeIndex} aria-controls="benefit-feature" onClick={() => setActiveIndex(index)}>
              <span className="benefit-icon"><Icon size={20} aria-hidden="true" /></span>
              <span>{label}</span>
              <ArrowRight className="benefit-option-arrow" size={17} aria-hidden="true" />
            </button>
          ))}
        </div>
        <article id="benefit-feature" className="benefit-feature">
          <div key={benefit.id} className="benefit-image">
            <img src={`/images/${benefit.image}.webp`} alt="" width="700" height="700" loading="lazy" />
          </div>
          <div className="benefit-copy">
            <div aria-live="polite">
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
            <a href={benefit.href} target={benefit.id === 'atendimento' ? '_blank' : undefined} rel={benefit.id === 'atendimento' ? 'noopener noreferrer' : undefined}>
              {benefit.action} <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </article>
      </div>
    </section>
  )
}
