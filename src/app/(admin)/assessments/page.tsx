import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import { AssessmentTable, type AssessmentRow } from "./assessment-table";

export const metadata: Metadata = { title: "Assessments — Dervo Admin" };

export const dynamic = "force-dynamic";

export default async function AssessmentsPage() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("assessments")
    .select("id, assessment, name, email, answers, created_at")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="mb-6 flex items-baseline gap-3">
        <h1 className="text-[26px] font-extrabold tracking-[-0.01em] text-navy">
          Assessments
        </h1>
        {!error && (
          <span className="text-[15px] font-semibold text-muted">
            {data?.length ?? 0}
          </span>
        )}
      </div>

      {error ? (
        <p className="rounded-2xl border border-alert/30 bg-alert/5 px-5 py-4 text-[14px] text-alert">
          Couldn&apos;t load assessments: {error.message}
        </p>
      ) : (
        <AssessmentTable rows={(data ?? []) as AssessmentRow[]} />
      )}
    </>
  );
}
