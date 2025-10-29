import React from 'react'
import "@/styles/globals.css"
import './styles.css'
import Navbar from '@/components/constants/Navbar'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <div className='flex flex-col max-h-screen min-h-0 h-screen'>
        <div className='flex justify-center mt-4 text-(--color-lila)'>
          <h1 className='font-[Rockwell_Condensed] text-center text-[48px] w-[250px] leading-[40px]'>ANNA TOLILA</h1>
        </div>
        <Navbar />
        {children}
        <p>Footer</p>
        </div>
      </body>
    </html>
  )
}
