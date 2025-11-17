"use client"

import Input from "@/components/inputs/Input";
import TextArea from "@/components/inputs/TextArea";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReCAPTCHA from  "react-google-recaptcha"
import React, { useRef, useState } from "react";
import Captcha from "@/components/Captcha";
import { handleMail } from "../_actions/handleMail";

export default function FormContact()
{
    const recaptchaRef = useRef<ReCAPTCHA>(null)
    const errorRef = useRef(null)
    const [isFormValid, setFormValidity] = useState(true)

    const handleSubmit = async (e : any) => {
        e.preventDefault()
        
        recaptchaRef.current?.execute();
        
        const formData = new FormData(e.target)
        formData.delete("g-recaptcha-response");
        const data = Object.fromEntries(formData.entries())

        if(!handleVerification()){
            setFormValidity(false)
            return;
        }

        const response = await handleMail(new URLSearchParams(formData as unknown as Record<string, string>,).toString())
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex gap-4 w-full">
                <Input label="Nom" name="lastname" required />
                <Input label="E-mail" name="mail" required/>
            </div>
            <Input label="Sujet" name="sujet" required/>
            <TextArea label="Message" name="message" required />
            <Captcha ref={recaptchaRef} />
            <button role="submit" className="bg-(--color-lila) hover:bg-(--color-dark-lila) transition-all duration-300 rounded w-full p-2 font-bold cursor-pointer">Envoyer le message <FontAwesomeIcon icon={faPaperPlane} /></button>
        </form>
    )
}