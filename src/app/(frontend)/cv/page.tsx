import { getPayload } from "payload";
import config from '@/payload.config'
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { Media } from "@/payload-types";
import { convertDate } from "@/utils/dateUtils";


const formateDate = (start : string | null | undefined, end : string | null | undefined) : string => {
    const options : Intl.DateTimeFormatOptions = {year : "numeric"}
    const dateStart = convertDate(start, options)
    const dateEnd = convertDate(end, options)

    let dateString = `${dateStart} à ${dateEnd}`
    if(dateStart == dateEnd )
    {
        dateString = dateStart
    }else if (!dateStart.length && dateEnd.length)
    {
        dateString = `Jusqu'en ${dateEnd}`
    }else if (!dateEnd.length && dateStart.length)
    {
        dateString = `Depuis ${dateStart}`
    }

    return dateString
}

export default async function CVPage()
{
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const docs = await payload.find({
        collection: "cv",
        limit: 1
    })

    if(!docs.totalDocs)
    {
        return
    }

    const cv = docs.docs[0]
    const pp : Media = cv.perso.photo as Media

    const formations = cv.formations?.formations || [];
    const formationsRender = formations.map( (formation) => {
        const dateString : string = formateDate(formation.start, formation.end)

        return(
            <div key={formation.id} className="w-full mb-4">
                <p className="font-bold">{formation.title}</p>
                <p className="font-italic">{formation.organisme}{formation.location && formation.organisme ? ", " + formation.location : formation.location }{(formation.location || formation.organisme) && dateString.length ? " - "  + dateString : dateString}</p>
                <ul className="list-disc ml-8">
                    {formation.description?.map( (li) => {
                        return(
                            <li key={li.id}>{li.label}</li>
                        )
                    } )}
                </ul>
            </div>
        )
    } )

    const expositions = cv.expositions?.expositions || [];
    const expositionsRender = expositions.map( (exposition) => {
        const dateString : string = formateDate(exposition.start, exposition.end)

        return(
            <div key={exposition.id} className="w-full mb-4">
                <p className="font-bold">{exposition.title}</p>
                <p className="font-italic">{exposition.expositionName}{exposition.location && exposition.expositionName ? ", " + exposition.location : exposition.location }{(exposition.location || exposition.expositionName) && dateString.length ? " - "  + dateString : dateString}</p>
                <ul className="list-disc ml-8">
                    {exposition.description?.map( (li) => {
                        return(
                            <li key={li.id}>{li.label}</li>
                        )
                    } )}
                </ul>
            </div>
        )
    } )

    const artisticActivities = cv.artisticActivity?.artisticActivity || [];
    const artisticActivitiesRender = artisticActivities.map( (artisticActivity) => {
        const dateString : string = formateDate(artisticActivity.start, artisticActivity.end)

        return(
            <div key={artisticActivity.id} className="w-full mb-4">
                <p className="font-bold">{artisticActivity.title}</p>
                <p className="font-italic">{artisticActivity.location}{artisticActivity.location && dateString.length ? " - "  + dateString : dateString}</p>
                <ul className="list-disc ml-8">
                    {artisticActivity.description?.map( (li) => {
                        return(
                            <li key={li.id}>{li.label}</li>
                        )
                    } )}
                </ul>
            </div>
        )
    } )

    return(
        <div className="max-w-dvw flex flex-col md:flex-row md:gap-[150px] my-8 p-4 md:mx-[100px]">
            <div className="md:w-[600px] md:min-w-[600px] flex flex-col gap-4">
                <h1 className="block md:hidden text-(--color-lila) text-center text-[64px] leading-[60px] font-[Rockwell_Condensed] uppercase">{cv.perso.firstname} {cv.perso.lastname}</h1>
                <h2 className="block md:hidden text-[40px] text-center text-black uppercase mb-4">{cv.perso.job}</h2>
                <div className="aspect-square md:w-[600px] rounded-[30px] bg-(--color-green) overflow-hidden">
                    <Image
                        src={pp.url as string}
                        alt={pp.alt as string}
                        width={pp.width as number}
                        height={pp.height as number}
                        className="w-full"
                    />
                </div>

                <div className="md:w-[600px] rounded-[30px] bg-(--color-green) text-[24px] md:text-[40px] flex flex-col items-center p-4 gap-8 md:gap-16">
                    <h2 className="text-[30px] md:text-[48px] leading-[30px] md:leading-[48px]">Mes coordonnées</h2>
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faEnvelope} />
                            <p>{cv.perso.mail}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faPhone} />
                            <p>{cv.perso.phoneNumber}</p>
                        </div>
                    </div>
                    <a href="/contact" className=" text-black px-8 py-4 hover:bg-(--color-dark-cream) bg-(--color-cream) transition-all duration-300 rounded-[15px]">Me contacter</a>
                </div>

            </div>
            
            <div className="w-full flex flex-col items-center text-black mt-4 md:mt-0">
                <h1 className="hidden md:block text-(--color-lila) text-[64px] leading-[60px] font-[Rockwell_Condensed] uppercase">{cv.perso.firstname} {cv.perso.lastname}</h1>
                <h2 className="hidden md:block text-[40px] uppercase mb-4">{cv.perso.job}</h2>
                <p>{cv.perso.description}</p>
                <h2 className="text-[40px] leading-[40px] text-center uppercase my-4">Formations</h2>
                {formationsRender}
                <h2 className="text-[40px] leading-[40px] text-center uppercase my-4">Expositions</h2>
                {expositionsRender}
                <h2 className="text-[40px] leading-[40px] text-center uppercase my-4">Activités artistiques</h2>
                {artisticActivitiesRender}

            </div>

        </div>
    )
}