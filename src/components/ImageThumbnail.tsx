import { Media, Photo } from '@/payload-types'
import { imageLoader } from '@/utils/images/imagesLoader'
import Image from 'next/image'
import React from 'react'

interface ImageThumbnailProps {
  photo: Photo
  index: number
  handleOpenImage: (index: number) => void
}

export default function ImageThumbnail({ photo, index, handleOpenImage }: ImageThumbnailProps) {
  const mediaPhoto = photo.file as Media

  return (
    <div
      onClick={() => {
        handleOpenImage(index)
      }}
      className={
        'bg-(--color-dark-cream) rounded flex items-center justify-center overflow-hidden group h-[200px] w-full relative'
      }
    >
      <Image
        src={mediaPhoto.url as string}
        alt={mediaPhoto.alt}
        width={mediaPhoto.width as number}
        height={mediaPhoto.height as number}
        loader={imageLoader}
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
}
