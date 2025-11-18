import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("entreprise") || "";

    console.log(searchParams)

    try {
        const payload = await getPayload({ config : configPromise })
        const email = await payload.sendEmail({
            to: searchParams.get("mail"),
            subject: searchParams.get("sujet"),
            text: searchParams.get("message"),
            
        })

        return NextResponse.json({ status: 200, message: "L'email à été envoyé" });
    } catch(error) 
    {
        return NextResponse.json({ status: 500, error });
    }
    
}