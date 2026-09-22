import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound, redirect } from 'next/navigation'

export default async function NewsRootPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  try {
    const magNews = await payload.find({
      collection: 'magazine',
      limit: 1,
    })

    if (!magNews.docs || magNews.docs.length === 0) {
      notFound()
    }

    redirect(`/news/${magNews.docs[0].id}`)
  } catch (error) {
    // Si c'est un redirect Next.js, on le propage
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error
    }
    notFound()
  }
}
