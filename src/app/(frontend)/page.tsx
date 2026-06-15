import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { Media } from '@/payload-types'
import HomePageClient from './page.client'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  var imageBack: Media
  const docs = await payload.findGlobal({
    slug: 'settings',
  })

  if (!docs.landingPageImage) {
    const newDocs = await payload.db.collections['photos']
      .aggregate([{ $sample: { size: 1 } }])
      .exec()

    if (!newDocs.length) {
      return
    }

    imageBack = await payload.findByID({
      collection: 'media',
      id: newDocs[0].file,
    })
  } else {
    imageBack = docs.landingPageImage as Media
  }

  return <HomePageClient imageBack={imageBack} />
}
