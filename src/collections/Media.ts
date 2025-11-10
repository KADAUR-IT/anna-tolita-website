import path from 'path'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
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
  upload: {
    staticDir: path.resolve(process.cwd(), process.env.PAYLOAD_UPLOAD_DIR!)
  },
}
