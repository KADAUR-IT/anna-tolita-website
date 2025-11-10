"use client"

import { Exposition, Media, Projet } from "@/payload-types";
import Image from "next/image";
import React, { useState } from "react";
import useWindowDimensions from "utils/useWindowDimensions";
import FilterSection from "./_components/FilterSection";
import MobileFilterSection from "./_components/MobileFilterSection";

interface GalerieClientPageProps {
    media: Media[]
    exposition: Exposition[],
    projet: Projet[]
}

export default function GalerieClientPage({media, exposition, projet}: GalerieClientPageProps)
{
    const [mediaFiltered, setMediaFiltered] = useState(media)
    const [countFilter, setCountFilter] = useState(0)
    const [mapFilter, setFilter] = useState(new Map([
        ["projet", [] as string[]],
        ["expo", [] as string[]],
    ]))
    const { height, width } = useWindowDimensions();

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

    const gridRender = mediaFiltered.map( (media, index) => 
        {
            const specialGrid = classGrid.filter( (c) => c.order.includes(index % 14) )
            const specialClass = specialGrid.length ? specialGrid[0].class : ""

            return(
                <div key={"img-" + index} className={"bg-(--color-dark-cream) rounded-[15px] flex items-center justify-center overflow-hidden group " + specialClass}>
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
                <MobileFilterSection countFilter={countFilter} handleFilter={handleFilter} projet={projet} exposition={exposition} allMedia={allMedia} /> 
                : <FilterSection countFilter={countFilter} handleFilter={handleFilter} projet={projet} exposition={exposition} allMedia={allMedia} /> 
            }
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[30px] w-full">
                {
                    gridRender.length ? 
                    gridRender
                    : "Aucune photo"
                }
            </div>
        </>
    )

}