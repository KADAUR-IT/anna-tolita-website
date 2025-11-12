import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("entreprise") || "";

    console.log(searchParams)

    /*const payload = await getPayload({ config : configPromise })
    const email = await payload.sendEmail({
        to: "kyllianmm@gmail.com",
        subject: "Test mail Payload",
        text: "Test message payload mail",
        
    })*/
    return NextResponse.json({ });
}