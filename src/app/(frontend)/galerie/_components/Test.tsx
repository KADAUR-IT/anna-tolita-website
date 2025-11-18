import React, { useRef } from "react";

export default function Test()
{
    const carouselRef = useRef<any>(null);

    const initFlickity = async () => {
        console.log("Initializing Flickity from Test component");
      const Flickity = (await import('flickity')).default;
      carouselRef.current = new Flickity(".carousel", {
          cellAlign: 'center',
          wrapAround: true,
          pageDots: true,
          initialIndex: 0,
          prevNextButtons: true,
          imagesLoaded: true,
          adaptiveHeight: true
      })

    }

    return(
        <div className="carousel w-[90%] h-[80vh]" ref={carouselRef} onLoad={initFlickity}>
            <div className="cell-carousel bg-green-500 size-full"></div>
            <div className="cell-carousel bg-blue-500 size-full"></div>
            <div className="cell-carousel bg-red-500 size-full"></div>
            <div className="cell-carousel bg-gray-500 size-full"></div>
        </div>
    )
}