import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound, redirect } from 'next/navigation'

export default async function GalerieRootPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  try {
    const resProjet = await payload.find({
      collection: 'projets',
      limit: 1,
      sort: '-start',
    })

    if (resProjet.docs && resProjet.docs.length > 0) {
      redirect(`/galerie/projets/${resProjet.docs[0].id}`)
    }

    const resExpo = await payload.find({
      collection: 'expositions',
      limit: 1,
      sort: '-start',
    })

    if (resExpo.docs && resExpo.docs.length > 0) {
      redirect(`/galerie/expositions/${resExpo.docs[0].id}`)
    }

    notFound()
  } catch (error) {
    // Si c'est un redirect Next.js, on le propage
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error
    }
    notFound()
  }
}
