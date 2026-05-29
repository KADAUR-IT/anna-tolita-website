import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import NewsClientPage from './page.client'
import { redirect } from 'next/navigation'

export default async function NewsPage({ params }: { params: Promise<{ id: string[] }> }) {
  const { id } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  let resNews = null

  try {
    resNews = await payload.find({
      collection: 'news',
      where: {
        magazine: { equals: id[0] },
      },
    })
  } catch (error) {
    redirect('/404')
  }

  if (!resNews.totalDocs) {
    redirect('/404')
  }

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
