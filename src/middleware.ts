import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Lightweight middleware - just checks that a session cookie exists & is
// signed correctly. Role checks happen server-side in the protected pages
// (see lib/auth.ts requireAdmin / requireUser).

const COOKIE_NAME = "onko_session";
const STAFF_BYPASS_COOKIE = "onko_staff_access";
const STAFF_BYPASS_QUERY = "staff";

const PROTECTED_PREFIXES = ["/home", "/menu", "/profile", "/admin"];

// The rest of the app (landing page, login/register, admin, ...) isn't
// finished yet. Only the events flow is public; everything else requires
// the staff bypass cookie (set via ?staff=<STAFF_BYPASS_TOKEN>).
const PUBLIC_EVENT_PREFIXES = ["/podujatia", "/api/tickets"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isPublicEventRoute(pathname: string): boolean {
  return PUBLIC_EVENT_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicEventRoute(pathname)) {
    return NextResponse.next();
  }

  const bypassSecret = process.env.STAFF_BYPASS_TOKEN?.trim();
  const queryToken = req.nextUrl.searchParams.get(STAFF_BYPASS_QUERY);

  // Visiting with ?staff=<secret> mints the bypass cookie for 90 days.
  if (bypassSecret && queryToken === bypassSecret) {
    const url = req.nextUrl.clone();
    url.searchParams.delete(STAFF_BYPASS_QUERY);
    const res = NextResponse.redirect(url);
    res.cookies.set(STAFF_BYPASS_COOKIE, bypassSecret, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 90,
      path: "/",
    });
    return res;
  }

  const hasStaffBypass =
    !!bypassSecret && req.cookies.get(STAFF_BYPASS_COOKIE)?.value === bypassSecret;

  if (!hasStaffBypass) {
    const url = req.nextUrl.clone();
    url.pathname = "/podujatia";
    url.search = "";
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
