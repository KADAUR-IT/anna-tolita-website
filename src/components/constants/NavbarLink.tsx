"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import React, { useEffect, useState } from "react";

interface NavbarLinkProps
{
    icon: IconProp,
    href: string,
    isActive: boolean
}

export default function NavbarLink({icon, href, isActive}: NavbarLinkProps)
{
    const [isLinkActive, setActive] = useState(false)

    useEffect( () => {
        if(typeof window !== "undefined")
        {
            setActive(window.location.pathname === href)
        }
    } )
    

    return(
        <a className={isLinkActive ? "link-active" : ""} href={href}><FontAwesomeIcon icon={icon} /></a>
    )
}