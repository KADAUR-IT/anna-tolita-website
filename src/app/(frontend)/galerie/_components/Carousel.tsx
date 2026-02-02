'use client'

import { Media } from '@/payload-types'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Flickity from 'react-flickity-component'
import 'flickity/css/flickity.css'

interface CarouselProps {
  photos: Media[]
  activeSlide: number
  handleOpenImage: () => void
  onFlickityInit?: (flickityRef: any) => void
}

export default function Carousel({
  photos,
  activeSlide,
  handleOpenImage,
  onFlickityInit,
}: CarouselProps) {
  const flickityOptions = {
    cellAlign: 'center',
    wrapAround: true,
    contain: true,
    pageDots: true,
    resize: true,
    prevNextButtons: true,
    imagesLoaded: true,
    adaptiveHeight: true,
    initialIndex: activeSlide,
  }

  const photosRender = photos.map((photo, index) => {
    return (
      <Image
        key={photo.id}
        src={photo.url as string}
        alt={photo.alt as string}
        height={photo.height as number}
        width={photo.width as number}
        className={
          'carousel-cell object-contain max-w-[calc(100dvw-4em)] h-auto md:w-auto md:h-[80vh]'
        }
        onClick={(e) => {
          e.stopPropagation()
        }}
      />
    )
  })

  return (
    <div
      id="image-handler"
      className="fixed bg-[#00000080] top-0 left-0 w-full h-full hidden flex items-center justify-center"
      onClick={(e) => {
        handleOpenImage()
      }}
    >
      <Flickity
        flickityRef={onFlickityInit}
        disableImagesLoaded={false}
        reloadOnUpdate={true}
        options={flickityOptions}
        className="carousel"
      >
        {photosRender}
      </Flickity>
    </div>
  )
}
