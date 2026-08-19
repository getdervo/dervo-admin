import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DervoMark } from "@/components/dervo-mark";
import { supabaseServer } from "@/lib/supabase/server";
import { signOut } from "../auth/actions";
import { NavLink } from "./nav-link";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await supabaseServer();

  // Re-checked here as well as in the proxy. Neither is the security boundary —
  // RLS returns nothing to an account missing from private.admins.
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/login");
  }

  const email =
    typeof data.claims.email === "string" ? data.claims.email : "Signed in";

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-cardline bg-white">
        <div className="mx-auto flex w-full max-w-[1100px] flex-wrap items-center gap-x-8 gap-y-3 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <DervoMark size={30} />
            <span className="text-[17px] font-extrabold tracking-[-0.01em] text-navy">
              DERVO
            </span>
            <span className="rounded-full bg-frost px-2.5 py-0.5 text-[11px] font-bold tracking-[0.04em] text-azure uppercase">
              Admin
            </span>
          </div>

          <nav className="flex items-center gap-1">
            <NavLink href="/assessments">Assessments</NavLink>
            <NavLink href="/subscribers">Subscribers</NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-[13px] text-muted sm:inline">
              {email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border-[1.5px] border-outline bg-white px-4 py-2 text-[13px] font-bold text-azure transition-colors duration-150 hover:border-royal hover:text-navy"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
