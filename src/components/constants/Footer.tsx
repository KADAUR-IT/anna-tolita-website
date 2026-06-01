import React from 'react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <div className="flex flex-col items-center text-(--color-lila) px-2">
      <p className="">@ {year} - ANNA T. - édité par KADAUR</p>

      <div>
        <a>Mentions légales</a>
      </div>
    </div>
  )
}
