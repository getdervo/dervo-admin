import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next 16 renamed the `middleware` convention to `proxy`, with a named `proxy`
 * export on the Node runtime. Supabase's own guides still say `middleware.ts`.
 *
 * Two jobs: keep the auth session cookie fresh, and bounce signed-out visitors
 * to /login. This is convenience, not the security boundary — RLS is. An
 * account that reaches these pages without being on the `private.admins`
 * allowlist sees zero rows regardless.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Without config there is nothing to verify against; let the page render and
  // surface the misconfiguration rather than redirect-looping.
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // getClaims verifies the JWT rather than trusting the cookie's contents.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);
  const onLogin = request.nextUrl.pathname.startsWith("/login");

  if (!signedIn && !onLogin) {
    const target = request.nextUrl.clone();
    target.pathname = "/login";
    target.search = "";
    return NextResponse.redirect(target);
  }

  if (signedIn && onLogin) {
    const target = request.nextUrl.clone();
    target.pathname = "/assessments";
    target.search = "";
    return NextResponse.redirect(target);
  }

  return response;
}

export const config = {
  matcher: [
    // Everything except Next internals and static files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
