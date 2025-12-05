import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPayload } from 'payload'
import payloadConfig from "./payload.config";

export async function proxy(request: NextRequest)
{
    const payload = await getPayload({ config: payloadConfig })
    const settings = await payload.findGlobal({
        slug: "settings"
    })

    var inMaintenance = false
    if(settings.maintenanceMode)
    {
        inMaintenance = settings.maintenanceMode
    }

    

    if(inMaintenance && !request.nextUrl.pathname.includes("maintenance"))
    {
        console.log("bye")
        return NextResponse.redirect(new URL('/maintenance', request.url));
    }

    if(!inMaintenance && request.nextUrl.pathname.includes("maintenance"))
    {
        console.log("hello")
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|admin|_next/static|_next/image|.*\\.png$).*)'],
}