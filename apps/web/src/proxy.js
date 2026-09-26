import { NextResponse } from "next/server";

const SESSION_COOKIE =
  process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME || "form_session";

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;
  // This is an optimistic navigation check only. Every protected API route
  // performs authoritative authentication in the Express backend.
  const isAuthenticated = request.cookies.has(SESSION_COOKIE);

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(isAuthenticated ? "/products" : "/login", request.url),
    );
  }

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  if (isAuthPage) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/products/:path*",
    "/cart",
    "/wishlist",
    "/checkout",
  ],
};
