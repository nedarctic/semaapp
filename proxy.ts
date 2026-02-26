import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function Proxy(
    req: NextRequest
) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/dashboard")) {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET!
        });

        if(!token) {
            const signInUrl = new URL("/signin", req.url);
            return NextResponse.redirect(signInUrl)
        }
    }

    return NextResponse.next();
}