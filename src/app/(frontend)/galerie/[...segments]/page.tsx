import React from 'react'
import { CollectionSlug, getPayload } from 'payload'
import config from '@/payload.config'
import GalerieClientPage from './page.client'
import ImageHandler from '@/utils/singleton/ImageHandler'

export default async function GaleriePage({ params }: { params: Promise<{ segments: string[] }> }) {
  const { segments } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const res = await payload.findByID({
    collection: segments[0] as CollectionSlug,
    id: segments[1],
  })

  const imageCache = ImageHandler.getInstance(payload).getCache()

  const resMedia = await imageCache.findByFilter(segments[1])

  return (
    <>
      <GalerieClientPage
        galerie={res as any}
        media={resMedia as any}
        typeFilter={segments[0] as 'projets' | 'expositions'}
      />
    </>
  )
}
