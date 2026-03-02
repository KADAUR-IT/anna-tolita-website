'use client'

import { Exposition, Media, Photo, Projet } from '@/payload-types'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import FilterSection from './_components/FilterSection'
import MobileFilterSection from './_components/MobileFilterSection'
import NoContent from '@/components/NoContent'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import Carousel from './_components/Carousel'
import RichText from '@/components/RichText'

interface GalerieClientPageProps {
  media: Photo[]
  exposition: Exposition[]
  projet: Projet[]
}

export default function GalerieClientPage({ media, exposition, projet }: GalerieClientPageProps) {
  const itemsFilter = [
    { name: 'Projet', type: 'projet', items: projet },
    { name: 'Exposition', type: 'expo', items: exposition },
  ]

  const [typeFilter, setTypeFilter] = useState<string>(
    projet.length ? 'projet' : exposition.length ? 'expo' : '',
  )
  const [filter, setFilter] = useState<Projet | Exposition | null>(
    projet.length ? projet[0] : exposition.length ? exposition[0] : null,
  )
  const [mediaFiltered, setMediaFiltered] = useState(
    media.filter(
      (m) =>
        (m.projet && (m.projet as Projet).id === filter?.id) ||
        (m.exposition && (m.exposition as Exposition).id === filter?.id),
    ),
  )

  const [width, setWidth] = useState(0)
  const [activeSlide, setActiveSlide] = useState(0)
  const [isCarouselOpen, setIsCarouselOpen] = useState(false)
  const flickityInstance = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)

      if (isCarouselOpen && flickityInstance.current) {
        setTimeout(() => {
          try {
            flickityInstance.current.select?.(activeSlide, false, true)
            flickityInstance.current.resize?.()
            console.log(flickityInstance.current)
            console.log('Selecting slide', activeSlide)
          } catch (e) {}
        }, 50)
      }
    }
  }, [isCarouselOpen, mediaFiltered])

  const stopPropagation = () => {
    document
      .querySelectorAll(
        '.flickity-button, .carousel, .flickity-viewport, .flickity-slider, .carousel-cell',
      )
      .forEach((button) => {
        button.addEventListener('click', (e) => {
          e.stopPropagation()
        })
      })
  }

  const handleFilter = (idFilter: string, typeFilter: string, isAdded: boolean) => {
    const newMedias = []

    setTypeFilter(typeFilter)
    setFilter(
      projet.find((p) => p.id === idFilter) || exposition.find((e) => e.id === idFilter) || null,
    )

    switch (typeFilter) {
      case 'projet':
        newMedias.push(
          ...media.filter((m) =>
            projet
              .find((p) => p.id === idFilter)
              ?.photos_projet?.docs?.map((ph) => (ph as Photo).id)
              .includes(m.id),
          ),
        )
        break
      case 'expo':
        newMedias.push(
          ...media.filter((m) =>
            exposition
              .find((e) => e.id === idFilter)
              ?.photos_expo?.docs?.map((ph) => (ph as Photo).id)
              .includes(m.id),
          ),
        )
        break
    }

    setMediaFiltered(newMedias)
  }

  const handleOpenImage = (image: number = -1) => {
    const el = document.getElementById('image-handler')

    if (!el) return

    const wasHidden = el.classList.contains('hidden')

    if (wasHidden) {
      el.classList.remove('hidden')

      if (image >= 0) {
        setActiveSlide(image)
        setIsCarouselOpen(true)
      }
    } else {
      el.classList.add('hidden')
      setIsCarouselOpen(false)
    }
  }

  const sortFunction = (photo1: Photo, photo2: Photo): number => {
    if (!typeFilter) return 0

    if (typeFilter === 'projet') {
      if (!photo1._photos_photos_projet_order || !photo2._photos_photos_projet_order) return 0

      return photo1._photos_photos_projet_order < photo2._photos_photos_projet_order ? -1 : 1
    }

    if (typeFilter === 'expo') {
      if (!photo1._photos_photos_expo_order || !photo2._photos_photos_expo_order) return 0
      return photo1._photos_photos_expo_order < photo2._photos_photos_expo_order ? -1 : 1
    }

    return 0
  }

  const gridRender = mediaFiltered.sort(sortFunction).map((photo, index) => {
    const mediaPhoto = photo.file as Media

    return (
      <div
        key={'img-' + index}
        onClick={() => {
          handleOpenImage(mediaFiltered.indexOf(photo))
        }}
        className={
          'bg-(--color-dark-cream) rounded-[15px] flex items-center justify-center overflow-hidden group h-[200px] w-full relative'
        }
      >
        <Image
          src={mediaPhoto.url as string}
          alt={mediaPhoto.alt}
          width={mediaPhoto.width as number}
          height={mediaPhoto.height as number}
          className={`object-cover w-full h-full group-hover:scale-115 transition-all duration-300 cursor-pointer`}
        />
        <div className="absolute top-0 left-0 w-full h-full text-white p-2 opacity-0 group-hover:opacity-100 group-hover:bg-[rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col justify-center items-center text-center">
          <p className="font-bold text-base">{photo.title && photo.title}</p>
          <p className="text-sm max-w-full overflow-hidden truncate h-5">
            {photo.caption && photo.caption}
          </p>
        </div>
      </div>
    )
  })

  return (
    <>
      {filter && (
        <FilterSection
          handleFilter={handleFilter}
          filters={itemsFilter}
          currentTypeFilter={typeFilter}
          currentFilter={filter.id}
        />
      )}

      {gridRender.length && filter ? (
        <div className="w-full justify-center">
          <h1 className="text-2xl font-bold mb-4 text-(--color-lila) text-center">{filter.name}</h1>
          {filter.description && <RichText className="text-[20px]" data={filter.description} />}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
            {gridRender}
          </div>
        </div>
      ) : (
        <NoContent text="Aucune photo" icon={faImage} />
      )}

      <Carousel
        onFlickityInit={(instance) => {
          flickityInstance.current = instance
          flickityInstance.current.resize?.()
          stopPropagation()
        }}
        photos={mediaFiltered.map((media) => media.file as Media)}
        activeSlide={activeSlide}
        handleOpenImage={handleOpenImage}
      />
    </>
  )
}
