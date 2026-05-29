import type { CollectionConfig } from 'payload'

export const Photos: CollectionConfig = {
  slug: 'photos',
  admin: {
    useAsTitle: 'file',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'upload',
      relationTo: 'media',
      name: 'file',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Titre',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Légende',
    },
    {
      name: 'exposition',
      type: 'relationship',
      relationTo: 'expositions',
    },
    {
      name: 'orderExposition',
      type: 'number',
      label: 'Ordre exposition',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'projet',
      type: 'relationship',
      relationTo: 'projets',
    },
    {
      name: 'orderProjet',
      type: 'number',
      label: 'Ordre projet',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
