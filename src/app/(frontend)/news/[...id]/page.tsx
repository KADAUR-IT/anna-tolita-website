import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import NewsClientPage from './page.client'
import { notFound } from 'next/navigation'

export default async function NewsPage({ params }: { params: Promise<{ id: string[] }> }) {
  const { id } = await params

  if (!id || id.length === 0 || !id[0]) {
    notFound()
  }

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  try {
    const resNews = await payload.find({
      collection: 'news',
      where: {
        magazine: { equals: id[0] },
      },
    })

    const magNews = await payload.find({
      collection: 'magazine',
    })

    const news = resNews.docs || []
    const magazine = magNews.docs || []

    return <NewsClientPage news={news} magazine={magazine} />
  } catch (error) {
    notFound()
  }
}

