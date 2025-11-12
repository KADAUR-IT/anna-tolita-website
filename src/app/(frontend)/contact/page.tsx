import Section from "@/components/Section";
import { faEnvelope, faPaperPlane, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { getPayload } from "payload";
import config from '@/payload.config'
import Input from "@/components/inputs/Input";
import TextArea from "@/components/inputs/TextArea";
import { stringify } from "querystring";

export default async function ContactPage()
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

    const handleMail = async (stringContact : string) => 
    {
        const res = await fetch(`/api/sendMail?${stringContact}`);
        const data = await res.json();

        console.log(data)
    }

    //Faire le Component Client Form

    return(
        <section className="flex flex-col items-center p-8 w-full md:max-w-[980px] mx-auto">
            <Section className="w-full p-8">
                <h2 className="text-[48px] leading[48px]">Mes coordonnées</h2>
                <div className="flex gap-8 text-[40px] leading[40px]">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faEnvelope} />
                        <p>{cv.perso.mail}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faPhone} />
                        <p>{cv.perso.phoneNumber}</p>
                    </div>
                </div>
            </Section>
            <form className="flex flex-col gap-4 w-full">
                <div className="flex gap-4 w-full">
                    <Input label="Nom" name="lastname" />
                    <Input label="Prénom" name="firstname" />
                </div>

                <Input label="E-mail" name="mail" />
                <Input label="Sujet" name="sujet" />
                <TextArea label="Message" name="message" />
                <button role="submit" className="bg-(--color-lila) rounded w-full p-2 font-bold">Envoyer le message <FontAwesomeIcon icon={faPaperPlane} /></button>
            </form>
        </section>
    )
    
}