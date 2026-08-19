import { redirect } from "next/navigation";
import { isConfigured } from "@/lib/supabase/config";
import { NotConfigured } from "@/components/not-configured";

// Env is read per request, so this must not be prerendered at build time.
export const dynamic = "force-dynamic";

/** No landing page for an internal tool — go straight to the data. */
export default function Home() {
  // Redirecting into a page that cannot load would bounce the visitor between
  // the root and a 500 with nothing explaining why.
  if (!isConfigured()) {
    return <NotConfigured />;
  }

  redirect("/assessments");
}
