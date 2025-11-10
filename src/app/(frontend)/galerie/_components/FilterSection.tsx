"use client"

import React from "react"
import ButtonFilter from "./ButtonFilter"
import { Exposition, Projet } from "@/payload-types"

interface FilterSectionProps {
    countFilter: number,
    handleFilter: (idFilter: string, typeFilter: string, isAdded: boolean) => void,
    allMedia: () => void
    projet: Projet[],
    exposition: Exposition[]
}

export default function FilterSection({countFilter, handleFilter, allMedia, projet, exposition} : FilterSectionProps)
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
        allMedia();
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

    return(
        <div className="flex flex-col text-black w-[350px] items-start text-[48px] leading-[40px]">
            <button onClick={handleResetFilter} className={ (!countFilter ? "text-(--color-green) " : "" ) + "mb-4 cursor-pointer"}>Tout</button>
            <ButtonFilter id="projet">Projet</ButtonFilter>
            <div id="projet" className="text-[24px] leading-[40px] px-2 ml-2 border-l-[3px] border-l-(--color-green) flex flex-col gap-1 transition-all duration-300 w-full max-h-max h-0 overflow-hidden filters">
                {projet.map( (p) => {
                    return(
                        <button id={"filter-projet-" + p.id} key={p.id} onClick={() => toggleFilter(p.id.toString(), "projet")} className="px-4 rounded text-left w-full hover:bg-(--color-dark-cream) cursor-pointer filters-btn">{p.name}</button>
                    )
                } )}
            </div>
            <ButtonFilter id="expo">Exposition</ButtonFilter>
            <div id="expo" className="text-[24px] leading-[40px] px-2 ml-2 border-l-[3px] border-l-(--color-green) transition-all duration-300 max-h-max h-0 overflow-hidden filters">
                {exposition.map( (e) => {
                    return(
                        <button id={"filter-expo-" + e.id} key={e.id} onClick={() => toggleFilter(e.id.toString(), "expo")} className="px-4 rounded text-left w-full hover:bg-(--color-dark-cream) cursor-pointer filters-btn">{e.name}</button>
                    )
                } )}
            </div>
        </div>
    )
}