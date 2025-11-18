"use client"

import Input from "@/components/inputs/Input";
import TextArea from "@/components/inputs/TextArea";
import ReCAPTCHA from  "react-google-recaptcha"
import React, { useRef, useState } from "react";
import Captcha from "@/components/Captcha";
import { handleMail } from "../_actions/handleMail";
import ButtonSubmitMail from "./ButtonSubmitMail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPaperPlane, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function FormContact()
{

    const status = [
        {status: "unsend", className: "bg-(--color-lila) hover:bg-(--color-dark-lila)", inner: <>Envoyer le message  <FontAwesomeIcon icon={faPaperPlane} className="transition-all duration-300 group-[.pending]/form:transform-[translate(50px,-50px)]" /></>},
        {status: "pending", className: "bg-(--color-lila) hover:bg-(--color-dark-lila)", inner: <><FontAwesomeIcon icon={faSpinner} className="transition-all duration-300" spin /></>},
        {status: "send", className: "bg-green-700 hover:bg-green-800", inner: <>Message envoyé  <FontAwesomeIcon icon={faCheck} className="transition-all duration-300" /></>},
        {status: "error", className: "bg-red-700 hover:bg-red-800", inner: <>Message non envoyé  <FontAwesomeIcon icon={faTimes} className="transition-all duration-300" /></>},
    ]

    const recaptchaRef = useRef<ReCAPTCHA>(null)
    const [isFormValid, setFormValidity] = useState(true)
    const [statusMail, setStatusMail] = useState(status[0])

    

    const handleSubmit = async (e : any) => {
        e.preventDefault()
        
        await recaptchaRef.current?.executeAsync();

        if(!handleVerification()){
            setFormValidity(false)
            return;
        }

        const formData = new FormData(e.target)
        formData.delete("g-recaptcha-response");
        const data = Object.fromEntries(formData.entries())

        const el = e.target
        setStatusMail(status[1])

        if(el)
        {
            el.classList.toggle("pending")
        }

        const response = await handleMail(new URLSearchParams(formData as unknown as Record<string, string>,).toString())

        if(response.status !== 200) 
        {
            setStatusMail(status[2])
        } else {
            setStatusMail(status[3])
        }
    }

    const handleVerification = () => {
        if(recaptchaRef == null || recaptchaRef.current == null){
            return false;
        }

        if(recaptchaRef.current.getValue() == null) return false;

        if(recaptchaRef.current.getValue()?.length == 0) return false

        return true;
    }

    return(
        <form id="" onSubmit={handleSubmit} className="flex flex-col gap-4 w-full  group/form">
            <div className="flex gap-4 w-full">
                <Input label="Nom" name="lastname" required />
                <Input label="E-mail" name="mail" required/>
            </div>
            <Input label="Sujet" name="sujet" required/>
            <TextArea label="Message" name="message" required />
            <Captcha ref={recaptchaRef} />
            <ButtonSubmitMail response={statusMail} />
        </form>
    )
}