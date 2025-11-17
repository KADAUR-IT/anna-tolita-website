"use client"

import { Exposition, Media, Photo, Projet } from "@/payload-types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import FilterSection from "./_components/FilterSection";
import MobileFilterSection from "./_components/MobileFilterSection";

interface GalerieClientPageProps {
    media: Photo[]
    exposition: Exposition[],
    projet: Projet[]
}

export default function GalerieClientPage({media, exposition, projet}: GalerieClientPageProps)
{
    const itemsFilter = [
        {name: "Projet", type: "projet", items: projet},
        {name: "Exposition", type: "expo", items: exposition},
    ]
    const [mediaFiltered, setMediaFiltered] = useState(media)
    const [countFilter, setCountFilter] = useState(0)
    const [mapFilter, setFilter] = useState(new Map([
        ["projet", [] as string[]],
        ["expo", [] as string[]],
    ]))
    const [width, setWidth] = useState(0);
    const [urlImage, setUrlImage] = useState<Media | null>(null)

    useEffect( () => {
        if(typeof window !== "undefined")
        {
            setWidth(window.innerWidth)
        }
    } )

    const allMedia = () => {
        setMediaFiltered(media)
        setFilter(new Map([
            ["projet", [] as string[]],
            ["expo", [] as string[]],
        ]))
        setCountFilter(0)
    }

    const handleFilter = (idFilter: string, typeFilter: string, isAdded: boolean) => {
        setCountFilter(countFilter + (isAdded ? 1 : -1))
        if(isAdded)
        {
            mapFilter.get(typeFilter)!.push(idFilter)
        }else{
            const index = mapFilter.get(typeFilter)!.indexOf(idFilter)
            mapFilter.get(typeFilter)!.splice(index, 1)
        }

        //console.log(mapFilter)

        const temp2 = media.filter((m) => m.projet && mapFilter.get("projet")!.includes((m.projet as Projet).id))
        const temp = media.filter((m) => m.exposition && mapFilter.get("expo")!.includes((m.exposition as Exposition).id))

        let temp3 = temp.concat(temp2).filter((value, index, array)=> array.indexOf(value) === index)

        if(!temp3.length && !mapFilter.get("projet")!.length && !mapFilter.get("expo")!.length) temp3 = media

        setMediaFiltered(temp3)
        
    }

    const classGrid = [
        {class: "min-h-[430px] max-h-[430px] md:col-span-2 md:row-span-2", label: "big", order: [0,11], maxHeight: 430},
        {class: "min-h-[430px] max-h-[430px] md:row-span-2", label: "long", order: [3,4,7,8], maxHeight: 430},
        {class: "min-h-[200px] max-h-[200px]", label: "normal", order: [1,2,5,6,9,10,12,13], maxHeight: 200},
    ]

    const handleOpenImage = (image: Media | null = null) => {
        const el = document.getElementById("image-handler")

        if(el)
        {
            el.classList.toggle("hidden")
            if(image)
            {
                setUrlImage(image)
            }
        }
    }

    const gridRender = mediaFiltered.map( (photo, index) => 
    {
        const media: Media = photo.file as Media
        const specialGrid = classGrid.filter( (c) => c.order.includes(index % 14) )
        const specialClass = specialGrid.length ? specialGrid[0].class : ""

        return(
            <div key={"img-" + index} onClick={() => {handleOpenImage(media)}} className={"bg-(--color-dark-cream) rounded-[15px] flex items-center justify-center overflow-hidden group " + specialClass}>
                <Image
                    src={media.url as string}
                    alt={media.alt}
                    width={media.width as number}
                    height={media.height as number}
                    className={`object-cover w-full h-full group-hover:scale-115 transition-all duration-300 cursor-pointer`}
                />
            </div>
        )
    } )
    

    return(
        <>
            { width < 448 ?
                <MobileFilterSection countFilter={countFilter} handleFilter={handleFilter} filters={itemsFilter} allItems={allMedia} /> 
                : <FilterSection countFilter={countFilter} handleFilter={handleFilter} filters={itemsFilter} allItems={allMedia} /> 
            }
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[30px] w-full">
                {
                    gridRender.length ? 
                    gridRender
                    : "Aucune photo"
                }
            </div>
            <div id="image-handler" className="fixed bg-[#00000080] top-0 left-0 w-full h-full flex items-center justify-center hidden" onClick={() => handleOpenImage()}>
                <Image 
                    src={urlImage? urlImage.url as string : "/api/media/file/railay.png"}
                    alt={urlImage? urlImage.alt as string : "temp"}
                    height={urlImage? urlImage.height as number : 4169}
                    width={urlImage? urlImage.width as number : 3135}
                    className="max-w-[calc(100dvw-4em)] h-auto md:max-h-[calc(100dvh-8em)] md:w-auto"
                    onClick={(e) => {e.stopPropagation()}}
                />
            </div>
            
        </>
    )

}