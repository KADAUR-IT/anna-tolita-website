"use client"

import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react"

interface ButtonFilterProps 
{
    id: string,
    children: ReactNode
}

export default function ButtonFilter({id, children}: ButtonFilterProps)
{
    const handleFilterOpen = (id : string, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const el = document.getElementById(id);
        const btn: HTMLDivElement = e.currentTarget as HTMLDivElement;

        console.log(btn)

        if(el)
        {
            btn.classList.toggle("open")
            el.classList.toggle("h-full")
            el.classList.toggle("mb-4")
        }
    }

    return(
        <div className={`group hover:text-(--color-green) transition-all duration-300 cursor-pointer`} onClick={(e) => handleFilterOpen(id, e)}>
            <button className={`mb-4 cursor-pointer`} >{children} </button>
            <span className={`relative text-[24px]`}>
                <FontAwesomeIcon icon={faPlus} className={`absolute top-[50%] -translate-y-[70%] transition-all duration-300 group-[.open]:rotate-90 group-[.open]:rotate-y-90`}/> 
                <FontAwesomeIcon icon={faMinus} className={`absolute top-[50%] -translate-y-[70%] transition-all duration-300 -rotate-90 group-[.open]:rotate-0`} /> 
            </span>
        </div>
    )
}