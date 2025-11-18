import React from 'react'
import "@/styles/globals.css"
import './styles.css'
import Navbar from '@/components/constants/Navbar'
import Footer from '@/components/constants/Footer'
import {Logo} from '@/components/constants/Logo'

export const metadata = {
  description: "Bienvenue sur le site d'Anna Tolila",
  title: 'ANNA TOLILA - Photographe',
  icons: {
    icon: '/assets/icon/favicon.ico',
    apple: '/assets/icon/apple-touch-icon.png',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="fr">
      <body>
        <div className='flex flex-col max-h-screen min-h-0 h-screen'>
          <Logo />
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
