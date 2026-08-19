import { PRIMARY_SUFFIX, type Field, type Section } from "./types";
import { SECTIONS as IDEA } from "./idea";
import { SECTIONS as SCALE } from "./scale";
import { SECTIONS as FIX } from "./fix";

/**
 * Question definitions copied verbatim from dervo-app
 * (`src/app/napkin/{wizard,idea,scale,fix}/`). They are pure data, so a plain
 * file copy keeps them in sync; only the import paths were rewritten.
 *
 * If they do drift, `describe()` falls back to humanising the stored field id,
 * so an unrecognised answer still displays rather than vanishing.
 */

export const ASSESSMENT_KINDS = ["idea", "scale", "fix"] as const;

export type AssessmentKind = (typeof ASSESSMENT_KINDS)[number];

export const KIND_LABEL: Record<AssessmentKind, string> = {
  idea: "Idea",
  scale: "Scale",
  fix: "Stuck",
};

const SECTIONS_BY_KIND: Record<AssessmentKind, Section[]> = {
  idea: IDEA,
  scale: SCALE,
  fix: FIX,
};

export type FieldInfo = {
  label: string;
  section: string;
  /** Order within the whole assessment, for stable display ordering. */
  order: number;
};

function collect(sections: Section[]) {
  const map = new Map<string, FieldInfo>();
  let order = 0;

  const add = (id: string, label: string, section: string) => {
    order += 1;
    map.set(id, { label, section, order });
  };

  for (const section of sections) {
    const heading = `Section ${section.badge} — ${section.title}`;

    for (const field of section.fields as Field[]) {
      switch (field.kind) {
        case "row":
          for (const input of field.inputs) {
            add(input.id, input.label ?? field.label, heading);
          }
          if (field.follow) add(field.follow.id, field.follow.label, heading);
          break;
        case "single-rows":
          for (const row of field.rows) {
            add(row.id, row.label ? `${field.label} — ${row.label}` : field.label, heading);
          }
          break;
        case "multi":
          add(field.id, field.label, heading);
          if (field.primary) {
            add(field.id + PRIMARY_SUFFIX, `${field.label} (#1)`, heading);
          }
          break;
        default:
          add(field.id, field.label, heading);
      }
    }
  }

  return map;
}

const LOOKUP: Record<AssessmentKind, Map<string, FieldInfo>> = {
  idea: collect(IDEA),
  scale: collect(SCALE),
  fix: collect(FIX),
};

/** "whats_happening" → "Whats happening" — last resort when a key is unknown. */
function humanise(id: string) {
  const words = id.replace(/_/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function describe(kind: string, id: string): FieldInfo {
  const known = isKind(kind) ? LOOKUP[kind].get(id) : undefined;
  return known ?? { label: humanise(id), section: "Other", order: 9999 };
}

export function isKind(value: string): value is AssessmentKind {
  return (ASSESSMENT_KINDS as readonly string[]).includes(value);
}

export function sectionOrder(kind: string) {
  if (!isKind(kind)) return [];
  return SECTIONS_BY_KIND[kind].map(
    (section) => `Section ${section.badge} — ${section.title}`,
  );
}

/** Name and email are shown in the row header, so they're skipped in the body. */
export const HEADER_FIELDS = new Set(["name", "email"]);
