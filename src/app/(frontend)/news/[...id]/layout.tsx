import React from 'react'
import FilterSection from '../../galerie/_components/FilterSection'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'

export default async function NewsLayout(props: {
  children: React.ReactNode
  params: Promise<{ id: string[] }>
}) {
  const { children } = props
  const { id } = await props.params

  const payload = await getPayload({ config: payloadConfig })

  const resNews = await payload.find({
    collection: 'news',
  })

  const magNews = await payload.find({
    collection: 'magazine',
  })

  const magazine = magNews.docs

  const itemsFilter = [{ name: 'Magazine', type: 'magazine', items: magazine }]

  return (
    <div className="flex flex-col md:flex-row m-4 md:m-8 gap-8 h-full">
      <FilterSection filters={itemsFilter} currentTypeFilter={'magazine'} currentFilter={id[0]} />
      {children}
    </div>
  )
}
