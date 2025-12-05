import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest)
{
    /*const payload = await getPayload({ config: payloadConfig })
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
    }*/

    const requestHeaders = new Headers(request.headers)
  
    // On ajoute le pathname dans un header personnalisé
    requestHeaders.set('x-current-path', request.nextUrl.pathname)

    // On laisse passer la requête avec ce nouveau header
    return NextResponse.next({
        request: {
        headers: requestHeaders,
        },
    })
}

export const config = {
    matcher: ['/((?!api|admin|_next/static|_next/image|.*\\.png$).*)'],
}