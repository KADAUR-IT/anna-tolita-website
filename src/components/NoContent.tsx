import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface NoContentProps
{
    icon: IconProp,
    text: string
}

export default function NoContent({icon, text}: NoContentProps)
{
    return(
        <div className="flex flex-col items-center justify-center text-black w-full h-full">
            <div className="relative">
                <FontAwesomeIcon icon={icon} className="text-[100px] text-(--color-green)" />
                <FontAwesomeIcon icon={faBan} className="absolute bottom-0 right-0 text-[50px] text-black" />
            </div>
            <p>{text}</p>
        </div>
    )
}