'use client'

import { Magazine, Media, News } from '@/payload-types'
import React, { useEffect, useState } from 'react'
import MobileFilterSection from '../../galerie/_components/MobileFilterSection'
import FilterSection from '../../galerie/_components/FilterSection'
import { convertDate } from '@/utils/dateUtils'
import Image from 'next/image'
import NoContent from '@/components/NoContent'
import { faNewspaper } from '@fortawesome/free-solid-svg-icons'
import RichText from '@/components/RichText'
import { imageLoader } from '@/utils/images/imagesLoader'

interface NewsClientPageProps {
  news: News[]
  magazine: Magazine[]
}

export default function NewsClientPage({ news, magazine }: NewsClientPageProps) {
  const [newsFiltered, setNewsFiltered] = useState(news)

  const [width, setWidth] = useState(0)
  const optionsDate: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }, [])

  const gridRender = newsFiltered.map((news, index) => {
    const thumbnail =
      typeof news.thumbnail === 'object' && news.thumbnail !== null
        ? (news.thumbnail as Media)
        : null
    const magazine =
      typeof news.magazine === 'object' && news.magazine !== null
        ? (news.magazine as Magazine)
        : null

    return (
      <div
        key={'news-' + index}
        className={
          'hover:bg-(--color-dark-cream) rounded p-1 gap-2 flex items-center justify-center overflow-hidden group transition-all duration-300 w-full md:h-[300px]'
        }
      >
        <div className="w-full h-full bg-(--color-green) rounded overflow-hidden flex items-center justify-center">
          {thumbnail?.url ? (
            <Image
              src={thumbnail.url}
              alt={thumbnail.alt || news.title || ''}
              width={thumbnail.width || 400}
              height={thumbnail.height || 300}
              loader={imageLoader}
              className="h-full w-auto object-cover"
            />
          ) : (
            <span className="text-white/70 text-sm">Pas d'image</span>
          )}
        </div>
        <div className="w-full h-full flex flex-col items-start px-2">
          <h2 className="font-bold text-xl">{news.title}</h2>
          {magazine?.name && <p className="text-gray-600">{magazine.name}</p>}
          <p className="text-gray-600">{convertDate(news.publishedDate, optionsDate)}</p>
          {news.description && <RichText className="text-sm" data={news.description} />}
        </div>
      </div>
    )
  })

  return (
    <>
      {gridRender.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 text-black gap-[30px] w-full">
          {gridRender}
        </div>
      ) : (
        <NoContent text="Aucune news" icon={faNewspaper} />
      )}
    </>
  )
}
