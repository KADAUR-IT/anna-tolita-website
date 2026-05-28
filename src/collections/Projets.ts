import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

export const Projets: CollectionConfig = {
  slug: 'projets',
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
          return Response.json({ error: 'Missing project id' }, { status: 400 })
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
                projet: id,
                orderProjet: Number.isFinite(item?.order) ? item.order : index,
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
      name: 'photos_projet',
      collection: 'photos',
      on: 'projet',
      orderable: true,
    },*/
    {
      type: 'ui',
      name: 'photos_projet_reorder',
      admin: {
        components: {
          Field: '@/components/payload/ReorderProjetPhotos',
        },
      },
    },
  ],
}
