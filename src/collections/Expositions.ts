import type { CollectionConfig } from 'payload'

export const Expositions: CollectionConfig = {
    slug: "expositions",
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