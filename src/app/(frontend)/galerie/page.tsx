import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import GalerieClientPage from './page.client'

export default async function GaleriePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const resMedia = await payload.find({
    collection: 'photos',
    limit: 0,
  })

  const resExposition = await payload.find({
    collection: 'expositions',
    limit: 0,
  })

  const resProjet = await payload.find({
    collection: 'projets',
    limit: 0,
  })

  const media = resMedia.docs
  const projet = resProjet.docs
  const exposition = resExposition.docs

  return (
    <div className="flex flex-col md:flex-row m-4 md:m-8 md:gap-8">
      <GalerieClientPage media={media} projet={projet} exposition={exposition} />
    </div>
  )
}
