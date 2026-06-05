import { imageLoader } from '@/utils/images/imagesLoader'
import Image from 'next/image'
import React from 'react'

export default async function MaintenancePage() {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <h1 className="text-6xl text-(--color-lila) uppercase font-[Rockwell_Condensed]">
        Maintenance
      </h1>
      <Image
        src={'/api/media/file/maintenace_icon'}
        height={450}
        width={450}
        alt="Chantier avec engins de constructions"
        loader={imageLoader}
      />
      <p className="text-black text-2xl">
        Le site d'Anna est en maintenance et sera bientôt en ligne
      </p>
    </div>
  )
}
