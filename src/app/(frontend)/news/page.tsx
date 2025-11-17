import React from "react";
import { getPayload } from "payload";
import config from '@/payload.config'
import NewsClientPage from "./page.client";

export default async function NewsPage() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const resNews = await payload.find({
        collection: "news"
    })

    const magNews = await payload.find({
        collection: "magazine"
    })

    const news = resNews.docs
    const magazine = magNews.docs

    return(
        <div className="flex flex-col md:flex-row m-4 md:m-8 gap-8 h-full">
            <NewsClientPage news={news} magazine={magazine} />
        </div>
    )
    
}