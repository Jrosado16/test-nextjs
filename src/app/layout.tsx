import Navbar from '@/components/Navbar/Navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Container from './container/Container'
import RainbowApp from './RainbowApp'
import { Providers } from '@/redux/providers'
import '@/config/firebase.config';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tropykus zkevm',
  description: 'La plataforma con los mejores préstamos de confianza.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <RainbowApp>
            <Container>
              {children}
            </Container>
          </RainbowApp>
        </Providers>
        </body>
    </html>
  )
}
