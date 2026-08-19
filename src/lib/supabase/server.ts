import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return { url, key };
}

/**
 * Cookie-backed client for Server Components, Server Actions and Route Handlers.
 *
 * Reads are still governed by RLS: this key can only see rows the signed-in
 * account is allowed to see, which for `assessments` and `subscribers` means
 * being listed in `private.admins`.
 */
export async function supabaseServer() {
  const { url, key } = config();
  const store = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            store.set(name, value, options);
          }
        } catch {
          // Server Components cannot set cookies. The proxy refreshes the
          // session on every request, so it is safe to ignore here.
        }
      },
    },
  });
}
