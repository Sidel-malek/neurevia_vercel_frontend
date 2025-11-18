import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = [
  "/diagnostic-tools",
  "/settings",
  "/dashboard",
  "/profile",
];

const AUTH_PATHS = ["/auth"];
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value; // ← Changez "token" par "auth_token"
  const pathname = req.nextUrl.pathname;

  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthPath = AUTH_PATHS.includes(pathname);

  // 1. Protect protected paths
  if (isProtectedPath) {
    if (!token) {
      const loginUrl = new URL("/auth", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const authCheck = await verifyToken(req);
      if (!authCheck.authenticated) {
        return redirectToAuthWithLogout(req, pathname);
      }

      // Vérification supplémentaire pour les docteurs
      if (authCheck.user?.role === "doctor" && !authCheck.user?.is_approved) {
        const waitingUrl = new URL("/waiting-approval", req.url);
        return NextResponse.redirect(waitingUrl);
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Auth verification error:", error);
      return redirectToAuthWithLogout(req, pathname);
    }
  }

  // 2. Redirection si déjà authentifié sur /auth
  if (isAuthPath && token) {
    try {
      const authCheck = await verifyToken(req);
      if (authCheck.authenticated) {
        const redirectPath = req.nextUrl.searchParams.get("redirect") || "/diagnostic-tools";
        
        // Vérification pour les docteurs non approuvés
        if (authCheck.user?.role === "doctor" && !authCheck.user?.is_approved) {
          const waitingUrl = new URL("/waiting-approval", req.url);
          return NextResponse.redirect(waitingUrl);
        }
        
        const redirectUrl = new URL(redirectPath, req.url);
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      // En cas d'erreur, on laisse l'utilisateur sur la page d'auth
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

/**
 * Vérifie le token via l'API Django
 */
async function verifyToken(req: NextRequest) {
  try {
    // Créer une URL absolue pour l'API
    const api_Url = new URL(`${apiUrl}/api/check-auth/`);
    
    const response = await fetch(api_Url.toString(), {
      method: "GET",
      headers: {
        "Cookie": req.headers.get("cookie") || "", // Transférer les cookies
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return { authenticated: false };
    }

    const data = await response.json();
    return {
      authenticated: true,
      user: data,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return { authenticated: false };
  }
}

/**
 * Redirige vers /auth et nettoie le cookie
 */
function redirectToAuthWithLogout(req: NextRequest, originalPath: string) {
  const authUrl = new URL("/auth", req.url);
  authUrl.searchParams.set("redirect", originalPath);

  const response = NextResponse.redirect(authUrl);

  // Nettoyer le cookie invalide
  response.cookies.set({
    name: "auth_token",
    value: "",
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: [
    "/diagnostic-tools/:path*",
    "/settings/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/auth/:path*",
  ],
};