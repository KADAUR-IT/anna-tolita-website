import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

export const Expositions: CollectionConfig = {
  slug: 'expositions',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      type: 'text',
      name: 'name',
    },
    {
      type: 'richText',
      name: 'description',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()],
      }),
    },
    {
      type: 'row',
      fields: [
        {
          type: 'date',
          name: 'start',
        },
        {
          type: 'date',
          name: 'end',
        },
      ],
    },
    {
      type: 'join',
      name: 'photos_expo',
      collection: 'photos',
      on: 'exposition',
      orderable: true,
    },
  ],
}
