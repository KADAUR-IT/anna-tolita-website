import Footer from '@/components/constants/Footer'
import { Logo } from '@/components/constants/Logo'
import Navbar from '@/components/constants/Navbar'
import Link from 'next/link'
import React from 'react'
import '@/styles/globals.css'
import '@/app/(frontend)/styles.css'

export default function GlobalNotFound() {
  return (
    <html lang="fr">
      <body>
        <div className="flex flex-col min-h-screen">
          <Logo />
          <Navbar />
          <div className="flex flex-col w-full h-screen items-center justify-center text-(--color-lila)">
            <h1 className="text-9xl!">404</h1>
            <h2>Page non trouvée</h2>
            <Link className="underline" href={'/'}>
              Retour à l'accueil
            </Link>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
