import React, { ReactNode } from "react";

interface SectionProps
{
    children?: ReactNode,
    className?: string
}

export default function Section({children, className} : SectionProps)
{

    return(
        <div className={"rounded-[30px] bg-(--color-green) flex flex-col items-center p-4 gap-8 " + className}>
            {children}
        </div>
    )

}