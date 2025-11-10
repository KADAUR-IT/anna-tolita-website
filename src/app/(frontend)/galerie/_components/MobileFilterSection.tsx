"use client"

import React from "react"
import ButtonFilter from "./ButtonFilter"
import { Exposition, Projet } from "@/payload-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFilter } from "@fortawesome/free-solid-svg-icons"

interface MobileFilterSectionProps {
    countFilter: number,
    handleFilter: (idFilter: string, typeFilter: string, isAdded: boolean) => void,
    allMedia: () => void
    projet: Projet[],
    exposition: Exposition[]
}

export default function MobileFilterSection({countFilter, handleFilter, allMedia, projet, exposition} : MobileFilterSectionProps)
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

    const handleOpenFilter = () => {
        const el = document.getElementById("filters-mobile")

        if(el)
        {
            el.classList.toggle("open")
        }
    }

    return(
        <>
            <button onClick={() => handleOpenFilter()} className="fixed bottom-4 left-4 bg-(--color-green) w-max py-2 px-3 [&>svg]:h-[24px]! rounded">
                <FontAwesomeIcon icon={faFilter} />
            </button>
            <div id="filters-mobile" className="fixed bottom-0 left-0 flex flex-col bg-(--color-cream) text-black w-full h-0 overflow-hidden text-[24px] leading-[24px] [&.open]:h-full transition-all duration-300">
                <div className="flex flex-col grow-1 gap-3 items-start p-2">
                    <h2 className="text-center text-[30px] w-full mb-4">Filtres</h2>
                    <button onClick={handleResetFilter} className={ (!countFilter ? "text-(--color-green) " : "" ) + "cursor-pointer"}>Tout</button>
                    <h3>Projet</h3>
                    <div id="projet" className="text-[16px] leading-[30px] flex flex-row flex-wrap gap-1 transition-all duration-300 w-full filters">
                        {projet.map( (p) => {
                            return(
                                <button id={"filter-projet-" + p.id} key={p.id} onClick={() => toggleFilter(p.id.toString(), "projet")} className="px-2 rounded text-center min-w-max border-[1px] border-(--color-green) hover:bg-(--color-dark-cream) cursor-pointer filters-btn">{p.name}</button>
                            )
                        } )}
                    </div>
                    <h3>Projet</h3>
                    <div id="expo" className="text-[16px] leading-[30px] flex flex-row gap-1 transition-all duration-300 w-full overflow-hidden filters">
                        {exposition.map( (e) => {
                            return(
                                <button id={"filter-expo-" + e.id} key={e.id} onClick={() => toggleFilter(e.id.toString(), "expo")} className="px-2 rounded text-center min-w-max border-[1px] border-(--color-green) hover:bg-(--color-dark-cream) cursor-pointer filters-btn">{e.name}</button>
                            )
                        } )}
                    </div>
                </div>
                <div className="w-full p-2 flex gap-2">
                    <button onClick={() => handleResetFilter()} className="bg-(--color-dark-cream) text-(--color-green) rounded cursor-pointer leading-[40px] w-full">Reinitialiser</button>
                    <button onClick={() => handleOpenFilter()} className="bg-(--color-green) text-(--color-cream) rounded cursor-pointer leading-[40px] w-full">Appliquer</button>
                </div>
            </div>
        </>
    )
}