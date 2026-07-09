import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Lightweight middleware - just checks that a session cookie exists & is
// signed correctly. Role checks happen server-side in the protected pages
// (see lib/auth.ts requireAdmin / requireUser).

const COOKIE_NAME = "onko_session";
const STAFF_BYPASS_COOKIE = "onko_staff_access";
const ACCESS_GATE_PATH = "/access";

const PROTECTED_PREFIXES = ["/home", "/menu", "/profile", "/admin"];

// The rest of the app (landing page, login/register, admin, ...) isn't
// finished yet. Only the events flow — and the password gate itself — is
// public; everything else requires the staff bypass cookie, which is set
// by entering STAFF_PASSWORD on /access (see lib/actions/staff-access.ts).
const PUBLIC_ROUTE_PREFIXES = ["/podujatia", "/api/tickets", ACCESS_GATE_PATH];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const bypassSecret = process.env.STAFF_BYPASS_TOKEN?.trim();
  const hasStaffBypass =
    !!bypassSecret && req.cookies.get(STAFF_BYPASS_COOKIE)?.value === bypassSecret;

  if (!hasStaffBypass) {
    const url = req.nextUrl.clone();
    const next = pathname + url.search;
    url.pathname = ACCESS_GATE_PATH;
    url.search = next && next !== "/" ? `?next=${encodeURIComponent(next)}` : "";
    return NextResponse.redirect(url);
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;

  // Authenticated users hitting the root go straight to the app (unless ?preview=1)
  if (pathname === "/" && token && req.nextUrl.searchParams.get("preview") !== "1") {
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
