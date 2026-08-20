import { HEADER_FIELDS, describe, sectionOrder } from "./questions";

export type AnswerEntry = {
  id: string;
  label: string;
  /** Already formatted for display; arrays are kept for chip rendering. */
  value: string | string[];
};

export type AnswerSection = { section: string; entries: AnswerEntry[] };

/**
 * Turns a stored `answers` blob into display-ready sections, in the order the
 * questionnaire asks them. Shared by the table and the PDF so the two can never
 * disagree about what a submission contains.
 */
export function groupAnswers(
  kind: string,
  answers: Record<string, unknown> | null | undefined,
): AnswerSection[] {
  const entries = Object.entries(answers ?? {})
    .filter(([id, value]) => {
      if (HEADER_FIELDS.has(id)) return false;
      if (value === null || value === undefined || value === "") return false;
      return !(Array.isArray(value) && value.length === 0);
    })
    .map(([id, value]) => ({
      id,
      value: Array.isArray(value)
        ? value.map((v) => String(v))
        : String(value),
      ...describe(kind, id),
    }));

  const bySection = new Map<string, typeof entries>();
  for (const entry of entries) {
    const list = bySection.get(entry.section) ?? [];
    list.push(entry);
    bySection.set(entry.section, list);
  }

  for (const list of bySection.values()) list.sort((a, b) => a.order - b.order);

  const known = sectionOrder(kind);
  const rank = (name: string) => {
    const index = known.indexOf(name);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };

  return [...bySection.entries()]
    .sort(([a], [b]) => rank(a) - rank(b))
    .map(([section, list]) => ({
      section,
      entries: list.map(({ id, label, value }) => ({ id, label, value })),
    }));
}

/** Safe, descriptive filename: dervo-idea-jane-doe-2026-08-19.pdf */
export function pdfFilename(kind: string, name: string, iso: string) {
  const slug = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40);

  const date = new Date(iso).toISOString().slice(0, 10);
  return `dervo-${slug(kind) || "assessment"}-${slug(name) || "submission"}-${date}.pdf`;
}
