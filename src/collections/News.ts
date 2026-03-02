import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'upload',
      relationTo: 'media',
      name: 'thumbnail',
    },
    {
      type: 'text',
      name: 'title',
    },
    {
      type: 'relationship',
      relationTo: 'magazine',
      name: 'magazine',
    },
    {
      type: 'date',
      name: 'publishedDate',
    },
    {
      type: 'richText',
      name: 'description',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()],
      }),
    },
  ],
}
