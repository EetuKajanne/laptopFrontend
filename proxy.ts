import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

let locales = ["en", "fi"];
let defaultLocale = "fi"; // Default to Finnish if unsure

function getLocale(request: NextRequest) {
  // 1. Check if user has a preference in headers
  let headers = { "accept-language": request.headers.get("accept-language") || "" };
  let languages = new Negotiator({ headers }).languages();

  // 2. Match their preference against our supported locales
  return match(languages, locales, defaultLocale);
}

export function proxy(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /laptops -> /fi/laptops
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Matcher ignoring /_next/ and /api/
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}