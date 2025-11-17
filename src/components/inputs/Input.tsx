import React, { ReactNode } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>
{
    name: string
    label: string
    className?: string,
}

export default function Input({name, label, className, ...otherProps} : InputProps) 
{

    return(
        <div className={"flex flex-col items-start gap-1 text-black w-full " + className}>
            <label htmlFor={name}>{label}{otherProps.required ? <span className="text-red-500">*</span> : ""}</label>
            <input type="text" name={name} className="bg-(--color-dark-cream) rounded w-full p-2 outline-(--color-green)" {...otherProps}></input>
        </div>
    )

}