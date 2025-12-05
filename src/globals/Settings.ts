import { GlobalConfig } from "payload";

export const Settings : GlobalConfig = {
    slug: "settings",
    fields: [
        {
            type: "upload",
            relationTo: "media",
            name: "landingPageImage"
        },
        {
            type: "checkbox",
            name: "maintenanceMode"
        }
    ]
}