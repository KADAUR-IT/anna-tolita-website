import React from "react";
import { faFile, faHome, faIcons, faImages, faNewspaper, faPhone } from "@fortawesome/free-solid-svg-icons"
import NavbarLink from "./NavbarLink";

export default function Navbar() {


    const links= [
        {icon: faHome, href: "/"},
        {icon: faFile, href: "/cv"},
        {icon: faImages, href: "/galerie"},
        {icon: faIcons, href: "/expo"},
        {icon: faNewspaper, href: "/news"},
        {icon: faPhone, href: "/contact"},
    ]

    const linksRender = links.map( (link, index) => {
        return(
            <NavbarLink key={index} icon={link.icon} href={link.href} isActive={link.href ? true : false} />
        )
    } )

    return(
        <div className="flex justify-center items-center text-(--color-dark-cream) gap-2 navbar-icons">
            {linksRender}
        </div>
    )
}