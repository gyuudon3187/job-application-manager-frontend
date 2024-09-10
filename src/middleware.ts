import { NextResponse, NextRequest } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLng, languageCodes, cookieName } from "./app/_i18n/settings";

acceptLanguage.languages(languageCodes);

export const config = {
  // matcher: '/:lng*'
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)",
  ],
};

export function middleware(req: NextRequest) {
  // Validation START
  function isFaultyLanguageRequest(): boolean {
    function requestedLanguageIsSupported(): boolean {
      return languageCodes.some((loc) =>
        req.nextUrl.pathname.startsWith(`/${loc}`),
      );
    }

    function requestedResourceIsNextAsset(): boolean {
      return req.nextUrl.pathname.startsWith("/_next");
    }

    return !requestedLanguageIsSupported() && !requestedResourceIsNextAsset();
  }

  function getSupportedLanguageBasedOnCookie(): string {
    let lng;
    const cookie = req.cookies.get(cookieName);
    if (cookie) lng = acceptLanguage.get(cookie.value);
    if (!lng) lng = acceptLanguage.get(req.headers.get("Accept-Language"));
    if (!lng) lng = fallbackLng;

    return lng;
  }

  function redirectToSupportedLanguage(lng: string): NextResponse {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}`, req.url),
    );
  }

  if (isFaultyLanguageRequest()) {
    const lng = getSupportedLanguageBasedOnCookie();
    return redirectToSupportedLanguage(lng);
  }
  // Validation END

  function generateNextResponse() {
    function setLanguageIfPresentInRefererHeader(response: NextResponse) {
      if (req.headers.has("referer")) {
        let refererUrl: URL;
        const headerReferer = req.headers.get("referer");
        if (headerReferer) refererUrl = new URL(headerReferer);
        const lngInReferer = languageCodes.find((l) =>
          refererUrl.pathname.startsWith(`/${l}`),
        );
        if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
        return response;
      }
    }

    const response = NextResponse.next();
    response.headers.set("x-url", req.nextUrl.pathname);
    setLanguageIfPresentInRefererHeader(response);

    return response;
  }

  return generateNextResponse();
}
