import { getPayload } from 'payload'
import config from '@/payload.config'
import React from 'react'
import { notFound } from 'next/navigation'
import CVPageClient from './page.client'

export default async function CVPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const cv = await payload.findGlobal({
    slug: 'cv',
  })

  if (!cv) notFound()

  return <CVPageClient cv={cv} />
}
