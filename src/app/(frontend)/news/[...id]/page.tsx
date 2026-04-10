import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import NewsClientPage from './page.client'

export default async function NewsPage({ params }: { params: Promise<{ id: string[] }> }) {
  const { id } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const resNews = await payload.find({
    collection: 'news',
    where: {
      magazine: { equals: id[0] },
    },
  })

  const magNews = await payload.find({
    collection: 'magazine',
  })

  const news = resNews.docs
  const magazine = magNews.docs

  return (
    <>
      <NewsClientPage news={news} magazine={magazine} />
    </>
  )
}
