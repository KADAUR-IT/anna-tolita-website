import React from 'react'
import {
  faFile,
  faHome,
  faIcons,
  faImages,
  faNewspaper,
  faPhone,
} from '@fortawesome/free-solid-svg-icons'
import NavbarLink from './NavbarLink'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'

export default async function Navbar() {
  const payload = await getPayload({ config: payloadConfig })
  const resProjet = await payload.find({
    collection: 'projets',
    limit: 1,
    sort: '-start',
  })

  const magNews = await payload.find({
    collection: 'magazine',
    limit: 1,
  })

  const links = [
    { icon: faHome, href: '/', isActive: '/' },
    { icon: faFile, href: '/cv', isActive: '/cv' },
    { icon: faImages, href: '/galerie/projets/' + resProjet.docs[0].id, isActive: '/galerie' },
    { icon: faNewspaper, href: '/news/' + magNews.docs[0].id, isActive: '/news' },
    { icon: faPhone, href: '/contact', isActive: '/contact' },
  ]

  const linksRender = links.map((link, index) => {
    return <NavbarLink key={index} icon={link.icon} href={link.href} isActive={link.isActive} />
  })

  return (
    <div className="flex justify-center items-center text-(--color-dark-cream) gap-2 navbar-icons">
      {linksRender}
    </div>
  )
}
