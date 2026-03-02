'use client'

import React from 'react'
import ButtonFilter from './ButtonFilter'
import { Exposition, Projet } from '@/payload-types'
import { CollectionConfig } from 'payload'
import FilterCollapsible from './FilterCollapsible'

interface FilterSectionProps {
  handleFilter: (idFilter: string, typeFilter: string, isAdded: boolean) => void
  filters: Filters[]
  currentTypeFilter: string
  currentFilter: string
}

export interface Filters {
  name: string
  type: string
  items: any[]
}

export default function FilterSection({
  handleFilter,
  filters,
  currentTypeFilter,
  currentFilter,
}: FilterSectionProps) {
  const filtersRender = filters.map((filter) => {
    return (
      <FilterCollapsible
        key={filter.name}
        filter={filter}
        handleFilter={handleFilter}
        currentTypeFilter={currentTypeFilter}
        currentFilter={currentFilter}
      />
    )
  })

  return (
    <div className="flex flex-col text-black w-[350px] items-start text-[48px] leading-[40px]">
      {filtersRender}
    </div>
  )
}
