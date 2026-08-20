"use client";

import { useMemo, useState } from "react";
import { formatDate, formatDateTime } from "@/lib/format";
import { groupAnswers } from "@/lib/answers";
import { ASSESSMENT_KINDS, KIND_LABEL, isKind } from "@/lib/questions";

export type AssessmentRow = {
  id: string;
  assessment: string;
  name: string;
  email: string;
  answers: Record<string, unknown>;
  created_at: string;
};

const PILL: Record<string, string> = {
  idea: "bg-royal/10 text-royal",
  scale: "bg-lime/25 text-navy",
  fix: "bg-alert/10 text-alert",
};

type Filter = "all" | (typeof ASSESSMENT_KINDS)[number];

export function AssessmentTable({ rows }: { rows: AssessmentRow[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<string | null>(null);

  const counts = useMemo(() => {
    const tally: Record<string, number> = {};
    for (const row of rows) tally[row.assessment] = (tally[row.assessment] ?? 0) + 1;
    return tally;
  }, [rows]);

  const visible = filter === "all" ? rows : rows.filter((r) => r.assessment === filter);

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-outline bg-white px-6 py-14 text-center">
        <p className="text-[15px] font-semibold text-navy">
          No assessments yet
        </p>
        <p className="mt-1.5 text-[13.5px] text-muted">
          Completed questionnaires from /napkin will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          All {rows.length}
        </FilterChip>
        {ASSESSMENT_KINDS.map((kind) => (
          <FilterChip
            key={kind}
            active={filter === kind}
            onClick={() => setFilter(kind)}
          >
            {KIND_LABEL[kind]} {counts[kind] ?? 0}
          </FilterChip>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-cardline bg-white shadow-dervo-sm">
        {visible.length === 0 ? (
          <p className="px-5 py-10 text-center text-[14px] text-muted">
            Nothing in this category yet.
          </p>
        ) : (
          <ul>
            {visible.map((row) => {
              const expanded = open === row.id;

              return (
                <li key={row.id} className="border-b border-cardline last:border-0">
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : row.id)}
                    aria-expanded={expanded}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-frost/50"
                  >
                    <span
                      className={`w-[62px] shrink-0 rounded-full px-2.5 py-1 text-center text-[11.5px] font-bold ${
                        PILL[row.assessment] ?? "bg-frost text-muted"
                      }`}
                    >
                      {isKind(row.assessment)
                        ? KIND_LABEL[row.assessment]
                        : row.assessment}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold text-navy">
                        {row.name}
                      </span>
                      <span className="block truncate text-[13px] text-muted">
                        {row.email}
                      </span>
                    </span>

                    <span className="hidden text-[13px] whitespace-nowrap text-muted sm:block">
                      {formatDate(row.created_at)}
                    </span>

                    <span
                      aria-hidden="true"
                      className={`text-muted transition-transform duration-200 ${
                        expanded ? "rotate-90" : ""
                      }`}
                    >
                      ›
                    </span>
                  </button>

                  {expanded && <Answers row={row} />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border-[1.5px] px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-150 ${
        active
          ? "border-royal bg-royal text-frost"
          : "border-outline bg-white text-list hover:border-royal hover:text-navy"
      }`}
    >
      {children}
    </button>
  );
}

function Answers({ row }: { row: AssessmentRow }) {
  // Same helper the PDF route uses, so the download always matches the screen.
  const grouped = useMemo(
    () => groupAnswers(row.assessment, row.answers),
    [row],
  );

  return (
    <div className="border-t border-cardline bg-frost/40 px-5 py-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12.5px] text-muted">
          Submitted {formatDateTime(row.created_at)}
        </p>
        <a
          href={`/assessments/${row.id}/pdf`}
          className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-outline bg-white px-4 py-2 text-[13px] font-bold text-azure transition-colors duration-150 hover:border-royal hover:text-navy"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3v12" />
            <path d="m7 12 5 5 5-5" />
            <path d="M5 21h14" />
          </svg>
          Download as PDF
        </a>
      </div>

      {grouped.length === 0 ? (
        <p className="text-[14px] text-muted">
          No answers were recorded beyond the contact details.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(({ section, entries }) => (
            <section key={section}>
              <h3 className="mb-3 text-[11.5px] font-extrabold tracking-[0.08em] text-azure uppercase">
                {section}
              </h3>
              <dl className="flex flex-col gap-3.5">
                {entries.map((entry) => (
                  <div key={entry.id}>
                    <dt className="text-[13px] font-bold text-navy">
                      {entry.label}
                    </dt>
                    <dd className="mt-1">
                      <Value value={entry.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function Value({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    return (
      <span className="flex flex-wrap gap-1.5">
        {value.map((item) => (
          <span
            key={String(item)}
            className="rounded-full bg-white px-2.5 py-1 text-[12.5px] font-medium text-list ring-1 ring-outline"
          >
            {String(item)}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span className="block text-[14.5px] leading-[1.6] whitespace-pre-wrap text-list">
      {String(value)}
    </span>
  );
}
