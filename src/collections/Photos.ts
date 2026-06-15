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
  endpoints: [
    {
      path: '/:id/remove-from-list',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = req.routeParams || {}

        if (!id && typeof id !== 'string') {
          return Response.json({ error: 'Missing photos id' }, { status: 400 })
        }

        const { field } = (await req.json?.()) || {}

        const entries = new Map([])
        entries.set(field, null)

        const data = Object.fromEntries(entries)

        await Promise.resolve(
          await req.payload.update({
            collection: 'photos',
            id: id as string,
            data,
          }),
        )

        return Response.json({ ok: true })
      },
    },
  ],
}
