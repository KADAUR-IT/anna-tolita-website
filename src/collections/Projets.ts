import type { CollectionConfig } from 'payload'

export const Projets: CollectionConfig = {
    slug: "projets",
    admin: 
    {
        useAsTitle: "name",
    },
    fields: [
        {
            type: "text",
            name: "name"
        },
        {
            type: "row",
            fields: [
                {
                    type: "date",
                    name: "start",
                },
                {
                    type: "date",
                    name: "end",
                },
            ]
        },

    ]
}
