import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <div className="flex flex-col w-full h-screen items-center justify-center text-(--color-lila)">
      <h1 className="text-9xl!">404</h1>
      <h2>Page non trouvée</h2>
      <Link className="underline" href={'/'}>
        Retour à l'accueil
      </Link>
    </div>
  )
}
