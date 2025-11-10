import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { Media } from '@/payload-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const docs = await payload.db.collections["media"].aggregate([{$sample: {size: 1}}]).exec()

  if(!docs.length)
  {
    return
  }

  const imageBack = docs[0] as Media

  return (
      <a className='relative grow rounded-[30px] h-full w-[calc(100% - var(--spacing) * 4)] overflow-hidden m-4 group cursor-pointer' href='/galerie'>
        <Image
          src={"/api/media/file/" + imageBack.filename as string}
          alt={imageBack.alt}
          width={imageBack.width as number}
          height={imageBack.height as number}
          objectPosition='center'
          className='group-hover:scale-115 transition-all duration-300'
        />
        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
          <div className='opacity-0 bg-transparent rounded-[30px] w-full h-full border-[5px] border-(--color-cream) flex justify-center items-center transition-all duration-300 group-hover:w-[90%] group-hover:h-[90%] group-hover:rounded-[20px] group-hover:opacity-90 corner'>
            <FontAwesomeIcon icon={faCircleHalfStroke} className=' text-[5vh] text-(--color-cream) -rotate-90 transition-all duration-300 group-hover:rotate-90 ' />
          </div>
        </div>
        
      </a>
  )
}
