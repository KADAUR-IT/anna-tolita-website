'use client'

import Image from 'next/image'
import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons'
import { Media } from '@/payload-types'
import { imageLoader } from '@/utils/images/imagesLoader'

interface HomePageClientProps {
  imageBack: Media
}

export default function HomePageClient({ imageBack }: HomePageClientProps) {
  return (
    <a
      className="relative max-w-[1400px] md:w-[80%] md:mx-auto grow rounded-[30px] h-full w-[calc(100% - var(--spacing) * 4)] overflow-hidden m-4 group cursor-pointer"
      href="/galerie"
    >
      <Image
        src={imageBack.url as string}
        alt={imageBack.alt}
        width={imageBack.width as number}
        height={imageBack.height as number}
        loader={imageLoader}
        className="h-full w-auto md:w-full md-h-auto group-hover:scale-115 transition-all duration-300 object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        <div className="opacity-0 bg-transparent rounded-[30px] w-full h-full border-[5px] border-(--color-cream) flex justify-center items-center transition-all duration-300 group-hover:w-[90%] group-hover:h-[90%] group-hover:rounded-[20px] group-hover:opacity-90 corner">
          <FontAwesomeIcon
            icon={faCircleHalfStroke}
            className=" text-[5vh] text-(--color-cream) -rotate-90 transition-all duration-300 group-hover:rotate-90 "
          />
        </div>
      </div>
    </a>
  )
}
