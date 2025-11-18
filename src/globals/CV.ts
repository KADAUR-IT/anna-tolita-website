import type { GlobalConfig } from 'payload'

export const CV: GlobalConfig = {
  slug: 'cv',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
            name: "perso",
            fields: [
                {
                    type: "row",
                    fields: [
                        {
                            name: "firstname",
                            type: "text",
                            required: true
                        },
                        {
                            name: "lastname",
                            type: "text",
                            required: true
                        }
                    ]
                },
                {
                    type: "upload",
                    relationTo: "media",
                    name: "photo",
                    required: true
                },
                {
                    type: "text",
                    name: "job"
                },
                {
                    type: "textarea",
                    name: "description"
                },
                {
                    type: "text",
                    name: "mail"
                },
                {
                    type: "text",
                    name: "phoneNumber"
                }
            ]
        },
        {
            name: "formations",
            fields: [
                {
                    type: "array",
                    name: "formations",
                    fields: [
                        {
                            type: "text",
                            name: "title"
                        },
                        {
                            type: "text",
                            name: "organisme"
                        },
                        {
                            type: "text",
                            name: "location"
                        },
                        {
                            type: 'row',

                            fields: [
                                {
                                    type: "date",
                                    name: "start"
                                },
                                {
                                    type: "date",
                                    name: "end"
                                },
                            ]
                        },
                        {
                            type: "array",
                            name: "description",
                            fields: [
                                {
                                    type: "text",
                                    name: "label"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "expositions",
            fields: [
                {
                    type: "array",
                    name: "expositions",
                    fields: [
                        {
                            type: "text",
                            name: "title"
                        },
                        {
                            type: "text",
                            name: "expositionName"
                        },
                        {
                            type: "text",
                            name: "location"
                        },
                        {
                            type: 'row',

                            fields: [
                                {
                                    type: "date",
                                    name: "start"
                                },
                                {
                                    type: "date",
                                    name: "end"
                                },
                            ]
                        },
                        {
                            type: "array",
                            name: "description",
                            fields: [
                                {
                                    type: "text",
                                    name: "label"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "artisticActivity",
            fields: [
                {
                    type: "array",
                    name: "artisticActivity",
                    fields: [
                        {
                            type: "text",
                            name: "title"
                        },
                        {
                            type: "text",
                            name: "location"
                        },
                        {
                            type: 'row',

                            fields: [
                                {
                                    type: "date",
                                    name: "start"
                                },
                                {
                                    type: "date",
                                    name: "end"
                                },
                            ]
                        },
                        {
                            type: "array",
                            name: "description",
                            fields: [
                                {
                                    type: "text",
                                    name: "label"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
      ]
    },
  ],

}