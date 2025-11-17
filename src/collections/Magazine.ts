import type { CollectionConfig } from 'payload'

export const Magazine: CollectionConfig = {
    slug: "magazine",
    admin: 
    {
        useAsTitle: "name",
    },
    fields: [
        {
            type: "text",
            name: "name"
        },

    ]
}