"use client"

import { Media } from "@/payload-types";
import Image from "next/image";
import React, { useState, useEffect, useRef, use } from "react";
import "flickity/css/flickity.css";
import { cp } from "fs";

interface CarouselProps
{
    carouselRef: React.RefObject<any>,
    photos: Media[],
    activeSlide: number,
    handleOpenImage: () => void
}

export default function Carousel({carouselRef, photos, activeSlide, handleOpenImage} : CarouselProps)
{
    const [currentSlide, setCurrentSlide] = useState(activeSlide)

    //const carouselRef = useRef<any>(null);

    const initFlickity = async () => {
      if(typeof window == "undefined") return;

      console.log("Initializing Flickity");
      await import("flickity-imagesloaded");
      const Flickity = (await import('flickity')).default;
      carouselRef.current = new Flickity(".carousel", {
          cellAlign: 'center',
          wrapAround: true,
          contain: true,
          pageDots: true,
          prevNextButtons: true,
          imagesLoaded: true,
          adaptiveHeight: true,
          initialIndex: activeSlide
      })

      document.querySelectorAll(".flickity-button").forEach( (button) => {
          button.addEventListener("click", (e) => {
          e.stopPropagation();
          })
      })
    }

    const [photosLoaded, setPhotosLoaded] = useState(photos)

    const photosRender = photosLoaded.map( (photo, index) => {
        
        return(          
            <Image 
                key={photo.id}
                src={photo.url as string}
                alt={photo.alt as string}
                height={photo.height as number}
                width={photo.width as number}
                className={"carousel-cell transition-all duration-300 max-w-[calc(100dvw-4em)] h-auto md:w-auto md:h-[80vh]"}
                onClick={(e) => {e.stopPropagation()}}
            />
        )
    } )


    useEffect( () => {
      initFlickity()

      return () => {
        try {
          if (carouselRef?.current?.destroy) {
            carouselRef.current.destroy();
          }
        } catch (e) { /* ignore */ }
      }
    }, [])

    return(
      <div id="image-handler" className="fixed bg-[#00000080] top-0 left-0 w-full h-full hidden flex items-center justify-center" onClick={(e) => {handleOpenImage()}}>
        <div className="carousel w-[90%] h-[50vh] md:h-[80vh] flex items-center justify-center" ref={carouselRef}>
         {photosRender}
        </div>
      </div>
    )
}