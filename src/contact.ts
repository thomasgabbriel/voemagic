const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || '5541991619041').replace(/\D/g, '')

export const whatsappUrl = `https://wa.me/${whatsappNumber}`
