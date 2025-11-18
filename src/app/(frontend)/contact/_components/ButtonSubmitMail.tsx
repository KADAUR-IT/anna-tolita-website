"use client"

import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";

interface ButtonSubmitMailProps
{
    response: any
}

export default function ButtonSubmitMail({response}: ButtonSubmitMailProps)
{

    useEffect( () => {
        if(response !== null)
        {

        }
    } )

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const el = e.currentTarget as HTMLButtonElement
        console.log("click")

        if(el)
        {
            el.classList.toggle("pending")
            console.log("pending")
            
        }
    } 

    return(
        <button role="submit" onClick={(e) => handleClick} className={response.className + " transition-all duration-300 rounded w-full p-2 font-bold cursor-pointer overflow-hidden"}>{response.inner}</button>
    )
}