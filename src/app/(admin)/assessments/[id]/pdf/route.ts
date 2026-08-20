import { renderToBuffer } from "@react-pdf/renderer";
import { groupAnswers, pdfFilename } from "@/lib/answers";
import { AssessmentDocument } from "@/lib/pdf/assessment-document";
import { KIND_LABEL, isKind } from "@/lib/questions";
import { isConfigured } from "@/lib/supabase/config";
import { supabaseServer } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/assessments/[id]/pdf">,
) {
  if (!isConfigured()) {
    return new Response("Supabase is not configured.", { status: 503 });
  }

  const { id } = await ctx.params;
  const supabase = await supabaseServer();

  // No explicit admin check needed: RLS returns nothing to an account that
  // isn't allowlisted, so an unauthorised request is indistinguishable from a
  // missing row — which is the response we want either way.
  const { data, error } = await supabase
    .from("assessments")
    .select("id, assessment, name, email, answers, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[pdf] lookup failed", error);
    return new Response("Could not load that assessment.", { status: 500 });
  }

  if (!data) {
    return new Response("Not found.", { status: 404 });
  }

  const kindLabel = isKind(data.assessment)
    ? KIND_LABEL[data.assessment]
    : data.assessment;

  const buffer = await renderToBuffer(
    AssessmentDocument({
      kindLabel,
      name: data.name,
      email: data.email,
      submitted: formatDateTime(data.created_at),
      sections: groupAnswers(data.assessment, data.answers),
    }),
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pdfFilename(
        data.assessment,
        data.name,
        data.created_at,
      )}"`,
      // Contains someone's personal data — never let a proxy or the browser
      // hold on to it.
      "Cache-Control": "no-store, private",
    },
  });
}
