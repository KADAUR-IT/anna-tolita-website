"use client"

import { Magazine, Media, News } from "@/payload-types";
import React, { useEffect, useState } from "react";
import MobileFilterSection from "../galerie/_components/MobileFilterSection";
import FilterSection from "../galerie/_components/FilterSection";
import { convertDate } from "@/utils/dateUtils";
import Image from "next/image";
import NoContent from "@/components/NoContent";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";

interface NewsClientPageProps
{
    news: News[]
    magazine: Magazine[]
}

export default function NewsClientPage({news, magazine} : NewsClientPageProps)
{
    const itemsFilter = [
        {name: "Magazine", type: "magazine", items: magazine},
    ]
    const [newsFiltered, setNewsFiltered] = useState(news)
    const [countFilter, setCountFilter] = useState(0)
    const [mapFilter, setFilter] = useState(new Map([
        ["magazine", [] as string[]],
    ]))
    const [width, setWidth] = useState(0);
    const optionsDate : Intl.DateTimeFormatOptions = {day: "numeric", month: "numeric", year : "numeric"}

    useEffect( () => {
        if(typeof window !== "undefined")
        {
            setWidth(window.innerWidth)
        }
    } )

    const allNews = () => {
        setNewsFiltered(news)
        setFilter(new Map([
            ["magazine", [] as string[]],
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

        var temp = news.filter((m) => m.magazine && mapFilter.get("magazine")!.includes((m.magazine as Magazine).id))
        if(!mapFilter.get(typeFilter)?.length) temp = news

        setNewsFiltered(temp)
        
    }

    const gridRender = newsFiltered.map( (news, index) => 
    {
        const thumbnail: Media = news.thumbnail as Media
        const magazine: Magazine = news.magazine as Magazine

        return(
            <div key={"news-" + index} className={"hover:bg-(--color-dark-cream) rounded p-1 gap-2 flex items-center justify-center overflow-hidden group transition-all duration-300 w-full md:h-[300px]"}>
                <div className="w-full h-full bg-(--color-green) rounded overflow-hidden">
                    <Image
                        src={thumbnail.url as string} 
                        alt={thumbnail.alt as string} 
                        width={thumbnail.width as number} 
                        height={thumbnail.height as number}
                        className="h-full w-auto object-cover"
                    />
                </div>
                <div className="w-full h-full flex flex-col items-start px-2">
                    <h2 className="font-bold text-xl">{news.title}</h2>
                    <p className="text-gray-600">{magazine.name}</p>
                    <p className="text-gray-600">{convertDate(news.publishedDate, optionsDate)}</p>
                    <p className="text-sm">{news.description}</p>
                </div>             
            </div>

        )
    } )

    return(
        <>
            { width < 448 ?
                <MobileFilterSection countFilter={countFilter} handleFilter={handleFilter} filters={itemsFilter} allItems={allNews} /> 
                : <FilterSection countFilter={countFilter} handleFilter={handleFilter} filters={itemsFilter} allItems={allNews} /> 
            }
            {
                gridRender.length ? 
                <div className="grid grid-cols-1 md:grid-cols-2 text-black gap-[30px] w-full">
                    {gridRender}
                </div>
                : <NoContent text="Aucune news" icon={faNewspaper} />
            }
        </>
    )
}