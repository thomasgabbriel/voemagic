export interface CustomerReview {
  id: string
  author: string
  rating: 1 | 2 | 3 | 4 | 5
  comment: string
}

// Cadastre apenas depoimentos reais autorizados para publicação.
export const customerReviews: CustomerReview[] = []
