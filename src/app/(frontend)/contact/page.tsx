import Section from "@/components/Section";
import { faEnvelope, faPaperPlane, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { getPayload } from "payload";
import config from '@/payload.config'
import Input from "@/components/inputs/Input";
import TextArea from "@/components/inputs/TextArea";
import { stringify } from "querystring";
import FormContact from "./_components/FormContact";

export default async function ContactPage()
{
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const cv = await payload.findGlobal({
        slug: "cv",
    })

    return(
        <section className="flex flex-col items-center my-4 w-full md:max-w-[980px] mx-auto">
            <Section className="w-full p-8">
                <h2 className="text-[40px] leading[40px]">Mes coordonnées</h2>
                <div className="flex gap-8 text-[32px] leading[32px]">
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
            <FormContact />
        </section>
    )
    
}