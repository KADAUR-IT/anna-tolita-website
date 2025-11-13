import React, { ReactNode } from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>
{
    name: string
    label: string
    className?: string
}

export default function TextArea({name, label, className, ...otherProps} : TextAreaProps)
{

    return(
        <div className={"flex flex-col items-start gap-1 text-black " + className}>
            <label htmlFor={name}>{label}{otherProps.required ? <span className="text-red-500">*</span> : ""}</label>
            <textarea rows={5} name={name} className="bg-(--color-dark-cream) rounded w-full p-2 outline-(--color-green)" {...otherProps}></textarea>
        </div>
    )

}