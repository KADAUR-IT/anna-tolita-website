import path from 'path'
import type { CollectionConfig } from 'payload'

export const Photos: CollectionConfig = {
  slug: 'photos',
  admin: {
    useAsTitle: "file"
  },
  access: {
    read: () => true,
  },
  fields: [
    {
        type: "upload",
        relationTo: "media",
        name: "file",
        required: true
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: "exposition",
      type: "relationship",
      relationTo: "expositions"
    },
    {
      name: "projet",
      type: "relationship",
      relationTo: "projets"
    },
  ],
}
