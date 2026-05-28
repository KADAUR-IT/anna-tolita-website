'use client'

import { Exposition, Media, Photo, Projet } from '@/payload-types'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import FilterSection from '../_components/FilterSection'
import MobileFilterSection from '../_components/MobileFilterSection'
import NoContent from '@/components/NoContent'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import Carousel from '../_components/Carousel'
import RichText from '@/components/RichText'
import ImageThumbnail from '@/components/ImageThumbnail'

interface GalerieClientPageProps {
  galerie: Exposition | Projet
  media: Photo[]
  typeFilter: 'projets' | 'expositions'
}

export default function GalerieClientPage({ galerie, media, typeFilter }: GalerieClientPageProps) {
  const [mediaFiltered, setMediaFiltered] = useState<Photo[]>(media)

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

    if (typeFilter === 'projets') {
      const nextOrder1 =
        typeof photo1.orderProjet === 'number'
          ? photo1.orderProjet
          : Number(photo1._photos_photos_projet_order || Number.MAX_SAFE_INTEGER)
      const nextOrder2 =
        typeof photo2.orderProjet === 'number'
          ? photo2.orderProjet
          : Number(photo2._photos_photos_projet_order || Number.MAX_SAFE_INTEGER)

      return nextOrder1 < nextOrder2 ? -1 : 1
    }

    if (typeFilter === 'expositions') {
      const nextOrder1 =
        typeof photo1.orderExposition === 'number'
          ? photo1.orderExposition
          : Number(photo1._photos_photos_expo_order || Number.MAX_SAFE_INTEGER)
      const nextOrder2 =
        typeof photo2.orderExposition === 'number'
          ? photo2.orderExposition
          : Number(photo2._photos_photos_expo_order || Number.MAX_SAFE_INTEGER)
      return nextOrder1 < nextOrder2 ? -1 : 1
    }

    return 0
  }

  const gridRender = mediaFiltered.sort(sortFunction).map((photo, index) => {
    return (
      <ImageThumbnail
        key={photo.id}
        photo={photo}
        index={mediaFiltered.indexOf(photo)}
        handleOpenImage={handleOpenImage}
      />
    )
  })

  return (
    <>
      {gridRender.length ? (
        <div className="w-full justify-center">
          <h1 className="text-2xl font-bold mb-4 text-(--color-lila) text-center">
            {galerie.name}
          </h1>
          {galerie.description && <RichText className="text-[20px]" data={galerie.description} />}
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
