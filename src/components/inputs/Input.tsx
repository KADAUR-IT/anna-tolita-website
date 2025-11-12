import React, { ReactNode } from "react";

interface InputProps
{
    name: string
    label: string
    className?: string
}

export default function Input({name, label, className} : InputProps)
{

    return(
        <div className={"flex flex-col items-start gap-1 text-black w-full " + className}>
            <label htmlFor={name}>{label}</label>
            <input type="text" name={name} className="bg-(--color-dark-cream) rounded w-full p-2"></input>
        </div>
    )

}