import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

export const Expositions: CollectionConfig = {
  slug: 'expositions',
  endpoints: [
    {
      path: '/:id/reorder-photos',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = req.routeParams || {}

        if (!id) {
          return Response.json({ error: 'Missing exposition id' }, { status: 400 })
        }

        const { items } = (await req.json?.()) || {}

        if (!Array.isArray(items)) {
          return Response.json({ error: 'Invalid payload, items[] required' }, { status: 400 })
        }

        await Promise.all(
          items.map(async (item, index) => {
            const photoID = item?.id
            if (!photoID) return

            await req.payload.update({
              collection: 'photos',
              id: photoID,
              data: {
                exposition: id,
                orderExposition: Number.isFinite(item?.order) ? item.order : index,
              },
            })
          }),
        )

        return Response.json({ ok: true })
      },
    },
  ],
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
    /*{
      type: 'join',
      name: 'photos_expo',
      collection: 'photos',
      on: 'exposition',
      orderable: true,
    },*/
    {
      type: 'ui',
      name: 'photos_expo_reorder',
      admin: {
        components: {
          Field: '@/components/payload/ReorderExpositionPhotos',
        },
      },
    },
  ],
}
