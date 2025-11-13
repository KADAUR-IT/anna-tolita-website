import React from 'react'
import "@/styles/globals.css"
import './styles.css'
import Navbar from '@/components/constants/Navbar'
import Footer from '@/components/constants/Footer'

export const metadata = {
  description: "Bienvenue sur le site d'Anna Tolila",
  title: 'ANNA TOLILA - Photographe',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <div className='flex flex-col max-h-screen min-h-0 h-screen'>
        <div className='flex justify-center mt-4 text-(--color-lila)'>
          <h1 className='font-[Rockwell_Condensed] text-center text-[48px] w-[250px] leading-[40px] mb-2'>ANNA TOLILA</h1>
        </div>
        <Navbar />
        {children}
        <Footer />
        </div>
      </body>
    </html>
  )
}
