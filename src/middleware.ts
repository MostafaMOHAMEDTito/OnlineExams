import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  // Define routes
  const authPages = ["/login", "/register"];
  const privatePages = ["/"];

  // Retrieve token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });


  // Redirect to login if token is missing on private pages
  if (!token && privatePages.includes(url)) {
    const redirectUrl = new URL("/login",request.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to dashboard if token exists on auth pages
  if (token && authPages.includes(url)) {
    const redirectUrl = new URL("/", request.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
