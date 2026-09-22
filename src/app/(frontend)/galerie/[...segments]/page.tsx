import React from 'react'
import { CollectionSlug, getPayload } from 'payload'
import config from '@/payload.config'
import GalerieClientPage from './page.client'
import ImageHandler from '@/utils/singleton/ImageHandler'
import { notFound } from 'next/navigation'

export default async function GaleriePage({ params }: { params: Promise<{ segments: string[] }> }) {
  const { segments } = await params

  if (!segments || segments.length < 2 || !segments[0] || !segments[1]) {
    notFound()
  }

  const validCollections = ['projets', 'expositions']
  if (!validCollections.includes(segments[0])) {
    notFound()
  }

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  let res = null

  try {
    res = await payload.findByID({
      collection: segments[0] as CollectionSlug,
      id: segments[1],
    })
  } catch (error) {
    notFound()
  }

  if (!res) {
    notFound()
  }

  let resMedia: any[] = []
  try {
    const imageCache = ImageHandler.getInstance(payload).getCache()
    resMedia = (await imageCache.findByFilter(segments[1])) || []
  } catch (error) {
    console.error('Erreur lors de la récupération des photos de la galerie:', error)
    resMedia = []
  }

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

