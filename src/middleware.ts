import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Lightweight middleware - just checks that a session cookie exists & is
// signed correctly. Role checks happen server-side in the protected pages
// (see lib/auth.ts requireAdmin / requireUser).

const COOKIE_NAME = "onko_session";
const GATE_COOKIE_NAME = "onko_site_gate";

const PROTECTED_PREFIXES = ["/home", "/menu", "/profile", "/admin"];

// Temporary: block anyone from actually creating an account or logging in
// until launch — the rest of the public site (landing, /podujatia, /akcie,
// /co-ziskas...) stays fully open so event sign-up etc. keeps working.
// Remove this whole block (and /app/gate, /lib/actions/gate.ts) once
// SITE_GATE_LAUNCH has passed.
const SITE_GATE_LAUNCH = new Date("2026-09-01T00:00:00Z");
const GATE_PROTECTED_PREFIXES = ["/login", "/register", "/welcome", "/reset-password"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function needsSiteGate(pathname: string): boolean {
  return GATE_PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (Date.now() < SITE_GATE_LAUNCH.getTime() && needsSiteGate(pathname)) {
    const unlocked = req.cookies.get(GATE_COOKIE_NAME)?.value === "1";
    if (!unlocked) {
      const gateUrl = req.nextUrl.clone();
      const next = pathname + req.nextUrl.search;
      gateUrl.pathname = "/gate";
      gateUrl.search = `?next=${encodeURIComponent(next)}`;
      return NextResponse.redirect(gateUrl);
    }
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
