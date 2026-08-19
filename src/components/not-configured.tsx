import { missingEnv } from "@/lib/supabase/config";

/**
 * Shown instead of a raw 500 when the Supabase environment variables are
 * absent — the most likely failure on a fresh deploy, and one that is otherwise
 * indistinguishable from a code crash.
 */
export function NotConfigured() {
  const missing = missingEnv();

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-[520px] rounded-3xl border border-cardline bg-white px-7 py-8 shadow-dervo-md">
        <h1 className="text-[22px] font-extrabold tracking-[-0.01em] text-navy">
          Not configured yet
        </h1>
        <p className="mt-2.5 text-[14.5px] leading-[1.6] text-ink">
          This deployment can&apos;t reach Supabase. Add the following
          environment variable
          {missing.length === 1 ? "" : "s"} to the Vercel project, then redeploy.
        </p>

        <ul className="mt-5 flex flex-col gap-2">
          {missing.map((name) => (
            <li
              key={name}
              className="rounded-xl bg-frost px-4 py-2.5 font-mono text-[13px] text-azure"
            >
              {name}
            </li>
          ))}
        </ul>

        <p className="mt-5 text-[13px] leading-[1.6] text-muted">
          Both values come from the Supabase dashboard under Project Settings →
          API, and must point at the same project the public site writes to.
        </p>
      </div>
    </main>
  );
}
