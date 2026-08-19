import type { Metadata } from "next";
import { DervoMark } from "@/components/dervo-mark";
import { NotConfigured } from "@/components/not-configured";
import { isConfigured } from "@/lib/supabase/config";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in — Dervo Admin",
};

// Env is read per request, so this must not be prerendered at build time.
export const dynamic = "force-dynamic";

export default function LoginPage() {
  // Otherwise the form renders fine and only fails on submit.
  if (!isConfigured()) {
    return <NotConfigured />;
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 flex items-center gap-3">
          <DervoMark size={38} />
          <span>
            <span className="block text-[21px] font-extrabold leading-none tracking-[-0.01em] text-navy">
              DERVO
            </span>
            <span className="mt-[3px] block text-[10.5px] font-medium tracking-[0.02em] text-muted">
              Admin
            </span>
          </span>
        </div>

        <div className="rounded-3xl border border-cardline bg-white px-7 py-8 shadow-dervo-md">
          <h1 className="mb-6 text-[22px] font-extrabold tracking-[-0.01em] text-navy">
            Sign in
          </h1>
          <LoginForm />
        </div>

        <p className="mt-5 text-center text-[12.5px] text-muted">
          Access is limited to allowlisted accounts.
        </p>
      </div>
    </main>
  );
}
