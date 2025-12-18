import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest)
{
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