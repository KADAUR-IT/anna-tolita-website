import React from "react";
import { getPayload } from "payload";
import config from '@/payload.config'
import GalerieClientPage from "./page.client";

export default async function GaleriePage() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const resMedia = await payload.find({
        collection: "photos"
    })

    const resExposition = await payload.find({
        collection: "expositions"
    })
    
    const resProjet = await payload.find({
        collection: "projets"
    })

    const media = resMedia.docs
    const projet = resProjet.docs
    const exposition = resExposition.docs

    return(
        <div className="flex flex-col md:flex-row m-4 md:m-8 gap-8 h-full">
            <GalerieClientPage media={media} projet={projet} exposition={exposition} />
        </div>
    )
    
}