import React from 'react'
import FilterSection from '../_components/FilterSection'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'

export default async function GalerieLayout(props: {
  children: React.ReactNode
  params: Promise<{ segments: string[] }>
}) {
  const { children } = props
  const { segments } = await props.params

  const payload = await getPayload({ config: payloadConfig })

  const resExposition = await payload.find({
    collection: 'expositions',
    limit: 0,
    sort: '-start',
  })

  const resProjet = await payload.find({
    collection: 'projets',
    limit: 0,
    sort: '-start',
  })

  const itemsFilter = [
    { name: 'Projet', type: 'projets', items: resProjet.docs },
    { name: 'Exposition', type: 'expositions', items: resExposition.docs },
  ]

  return (
    <div className="flex flex-col md:flex-row m-4 md:m-8 md:gap-8">
      <FilterSection
        filters={itemsFilter}
        currentTypeFilter={segments[0]}
        currentFilter={segments[1]}
      />
      {children}
    </div>
  )
}
