import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Lightweight middleware - just checks that a session cookie exists & is
// signed correctly. Role checks happen server-side in the protected pages
// (see lib/auth.ts requireAdmin / requireUser).

const COOKIE_NAME = "onko_session";

const PROTECTED_PREFIXES = ["/home", "/menu", "/profile", "/admin"];

// Paths where an authenticated user should be sent to /home instead
const LANDING_PATHS = [
  "/", "/co-ziskas", "/cennik", "/akcie", "/sponzori",
  "/prednasky-podcasty", "/onkorumky", "/kontent-kniznica",
];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isLanding(pathname: string): boolean {
  return LANDING_PATHS.includes(pathname);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(COOKIE_NAME)?.value;

  // Authenticated users visiting the landing pages go straight to the app
  if (isLanding(pathname) && token) {
    try {
      const secret =
        process.env.AUTH_SECRET?.trim().replace(/^["']|["']$/g, "") ?? "";
      if (secret) {
        await jwtVerify(token, new TextEncoder().encode(secret));
        const url = req.nextUrl.clone();
        url.pathname = "/home";
        url.search = "";
        return NextResponse.redirect(url);
      }
    } catch {
      // Invalid token — let them see the landing page normally
    }
  }

  if (!isProtected(pathname)) return NextResponse.next();

  if (!token) {
    return redirectToLogin(req);
  }

  try {
    const secret =
      process.env.AUTH_SECRET?.trim().replace(/^["']|["']$/g, "") ?? "";
    if (!secret) throw new Error("AUTH_SECRET missing");
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    return redirectToLogin(req);
  }
}

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  const next = url.pathname + url.search;
  url.pathname = "/login";
  url.search = next && next !== "/login" ? `?next=${encodeURIComponent(next)}` : "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next|api/media|favicon.ico|logo|manifest.webmanifest|.*\\..*).*)",
  ],
};
