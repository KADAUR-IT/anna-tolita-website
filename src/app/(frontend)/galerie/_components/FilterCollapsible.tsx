import React from 'react'
import ButtonFilter from './ButtonFilter'
import { Filters } from './FilterSection'

interface FilterCollapsibleProps {
  filter: Filters
  currentTypeFilter: string
  currentFilter: string
}

export default function FilterCollapsible({
  filter,
  currentTypeFilter,
  currentFilter,
}: FilterCollapsibleProps) {
  const section =
    currentTypeFilter === 'magazine' ? '/news/' : '/galerie/' + currentTypeFilter + '/'

  return (
    <>
      <ButtonFilter key={filter.name} id={filter.type} currentTypeFilter={currentTypeFilter}>
        {filter.name}
      </ButtonFilter>
      <div
        id={filter.type}
        className={`text-[24px] leading-[40px] px-2 ml-2 border-l-[3px] border-l-(--color-green) flex flex-col gap-1 transition-all duration-300 w-full max-h-max h-0 overflow-hidden filters ${currentTypeFilter === filter.type && 'mb-4 h-full'}`}
      >
        {filter.items.map((item) => {
          return (
            <a
              id={'filter-' + filter.type + '-' + item.id}
              key={item.id}
              href={section + item.id}
              className={`px-4 rounded text-left w-full hover:bg-(--color-dark-cream) cursor-pointer filters-btn ${currentFilter === item.id && 'bg-(--color-green) text-(--color-cream) hover:bg-(--color-dark-green)'}`}
            >
              {item.name}
            </a>
          )
        })}
      </div>
    </>
  )
}
