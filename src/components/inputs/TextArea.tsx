import React, { ReactNode } from "react";

interface TextAreaProps
{
    name: string
    label: string
    className?: string
}

export default function TextArea({name, label, className} : TextAreaProps)
{

    return(
        <div className={"flex flex-col items-start gap-1 text-black " + className}>
            <label htmlFor={name}>{label}</label>
            <textarea rows={5} name={name} className="bg-(--color-dark-cream) rounded w-full p-2"></textarea>
        </div>
    )

}