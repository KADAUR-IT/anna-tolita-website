import React from 'react'
import '@/styles/globals.css'
import './styles.css'
import Navbar from '@/components/constants/Navbar'
import Footer from '@/components/constants/Footer'
import { Logo } from '@/components/constants/Logo'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { redirect } from 'next/navigation'

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

  const headerList = await headers()
  const pathname = headerList.get('x-current-path') || ''

  if (pathname.startsWith('/admin')) return <>{children}</>

  const payload = await getPayload({ config: payloadConfig })
  const settings = await payload.findGlobal({
    slug: 'settings',
  })

  const inMaintenance = settings.maintenanceMode || false

  if (inMaintenance && !pathname.startsWith('/maintenance')) {
    console.log('bye')
    console.log(pathname)
    return redirect('/maintenance')
  }

  if (!inMaintenance && pathname.startsWith('/maintenance')) {
    console.log('hello')
    return redirect('/')
  }

  return (
    <html lang="fr">
      <body>
        <div className="flex flex-col min-h-screen">
          <Logo />
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
