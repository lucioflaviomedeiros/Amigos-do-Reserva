import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fornecedores — Reserva Laguna',
  description: 'Diretório exclusivo de fornecedores e prestadores de serviço indicados pelos moradores do Reserva Laguna',
  openGraph: {
    title: 'Fornecedores — Reserva Laguna',
    description: 'Parceiros de confiança indicados pelos moradores',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
