import React from 'react'
import { CollectionSlug, getPayload } from 'payload'
import config from '@/payload.config'
import GalerieClientPage from './page.client'

export default async function GaleriePage({ params }: { params: Promise<{ segments: string[] }> }) {
  const { segments } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const res = await payload.findByID({
    collection: segments[0] as CollectionSlug,
    id: segments[1],
  })

  const resMedia = await payload.find({
    collection: 'photos',
    limit: 0,
    where: {
      or: [{ projet: { equals: segments[1] } }, { exposition: { equals: segments[1] } }],
    },
  })

  return (
    <>
      <GalerieClientPage
        galerie={res as any}
        media={resMedia.docs as any}
        typeFilter={segments[0] as 'projets' | 'expositions'}
      />
    </>
  )
}
