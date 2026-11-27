export interface CustomerReview {
  id: string
  author: string
  rating: 1 | 2 | 3 | 4 | 5
  comment: string
}

// Cadastre apenas depoimentos reais autorizados para publicação.
export const customerReviews: CustomerReview[] = [
  { id: 'review-1', author: 'Luciene P.', rating: 5, comment: 'Muito rápido!' },
  { id: 'review-2', author: 'Rafael N.', rating: 5, comment: 'Recomendo! O serviço foi excelente.' },
  { id: 'review-3', author: 'Felipe M. C.', rating: 5, comment: 'Uma empresa de qualidade.' },
  { id: 'review-4', author: 'K. Goulart', rating: 5, comment: 'Agência de viagens com excelente atendimento e preços muito bons.' },
]
