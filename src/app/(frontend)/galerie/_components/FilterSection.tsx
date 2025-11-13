"use client"

import React from "react"
import ButtonFilter from "./ButtonFilter"
import { Exposition, Projet } from "@/payload-types"
import { CollectionConfig } from "payload"

interface FilterSectionProps {
    countFilter: number,
    handleFilter: (idFilter: string, typeFilter: string, isAdded: boolean) => void,
    allItems: () => void
    filters: Filters[]
}

interface Filters
{
    name: string,
    type: string,
    items: any[]
}

export default function FilterSection({countFilter, handleFilter, allItems, filters} : FilterSectionProps)
{
    const toggleFilter = (id: string, filter: string) => {
        const el = document.getElementById("filter-" + filter + "-" +  id);

        if(el)
        {
            const isAdded = el.classList.toggle("bg-(--color-green)")
            el.classList.toggle("hover:bg-(--color-dark-cream)")
            el.classList.toggle("hover:bg-(--color-dark-green)")
            el.classList.toggle("text-(--color-cream)")

            handleFilter(id, filter, isAdded)
        }

    }

    const handleResetFilter = () => {
        allItems();
        const els = document.getElementsByClassName("filters-btn")
        Array.prototype.forEach.call(
            els,
            (val: HTMLElement) => {
                val.classList.remove("bg-(--color-green)")
                val.classList.remove("text-(--color-cream)")
                val.classList.remove("hover:bg-(--color-dark-green)")
                val.classList.add("hover:bg-(--color-dark-cream)")
            }
        )
    }

    const filtersRender = filters.map( (filter) => {
        return(
            <>
                <ButtonFilter id={filter.type}>{filter.name}</ButtonFilter>
                <div id={filter.type} className="text-[24px] leading-[40px] px-2 ml-2 border-l-[3px] border-l-(--color-green) flex flex-col gap-1 transition-all duration-300 w-full max-h-max h-0 overflow-hidden filters">
                    {filter.items.map( (item) => {
                        return(
                            <button id={"filter-" + filter.type + "-" + item.id} key={item.id} onClick={() => toggleFilter(item.id.toString(), filter.type)} className="px-4 rounded text-left w-full hover:bg-(--color-dark-cream) cursor-pointer filters-btn">{item.name}</button>
                        )
                    } )}
                </div>
            </>
        )
    } )

    return(
        <div className="flex flex-col text-black w-[350px] items-start text-[48px] leading-[40px]">
            <button onClick={handleResetFilter} className={ (!countFilter ? "text-(--color-green) " : "" ) + "mb-4 cursor-pointer"}>Tout</button>
            {filtersRender}
        </div>
    )
}