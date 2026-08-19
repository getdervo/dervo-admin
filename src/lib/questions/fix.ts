import {
  buildFieldShapes,
  countQuestions,
  CONTACT_FIELDS,
  type Section,
} from "./types";
import {
  CUSTOMER_SOURCES,
  GOALS,
  REVENUE_WITH_UNSURE,
  STEP_AWAY,
  TIME_SINKS,
} from "./options";

/**
 * The fix assessment: six sections, sixteen questions.
 *
 * Reused from the shared lists: customer sources (Q6), revenue ranges (Q9),
 * the headaches list (Q12), the step-away outcomes (Q14) and the goal list
 * (Q15). The stuck-reasons (Q4), enquiry outcomes (Q7), repeat-custom (Q8) and
 * financial-health (Q10) lists had no existing counterpart and are authored
 * here — adjust freely.
 */

export const SECTIONS: Section[] = [
  {
    badge: "1",
    title: "Your Business",
    fields: [
      {
        kind: "row",
        id: "basics",
        label: "The basics",
        inputs: [
          { id: "business_name", label: "Business name", placeholder: "Acme Cleaning" },
          { id: "website", label: "Website", placeholder: "acme.com" },
          { id: "what_you_sell", label: "What do you sell?", placeholder: "Office cleaning" },
        ],
      },
      {
        kind: "single",
        id: "tenure",
        label: "How long have you been running?",
        options: [
          "Under 6 months",
          "6–12 months",
          "1–2 years",
          "2–5 years",
          "5+ years",
        ],
      },
    ],
  },
  {
    badge: "2",
    title: "Where You're At",
    fields: [
      {
        kind: "single",
        id: "state",
        label: "Which of these sounds like your business right now?",
        options: [
          "Just getting started",
          "Growing",
          "Stable",
          "Struggling",
          "Declining",
          "I'm not sure",
        ],
      },
      {
        kind: "multi",
        id: "stuck_reasons",
        label: "What's making you feel stuck?",
        options: [
          "Not enough customers coming in",
          "Customers enquire but don't buy",
          "I'm busy but not making money",
          "Cash flow is unpredictable",
          "I'm doing everything myself",
          "The work isn't consistent",
          "I don't know what to focus on",
          "Marketing isn't working",
          "I can't raise my prices",
          "I'm burnt out",
          "The team isn't pulling its weight",
          "I've stopped enjoying it",
        ],
      },
      {
        kind: "single-from",
        id: "worst_reason",
        label: "Of those, which one hurts the most?",
        source: "stuck_reasons",
      },
    ],
  },
  {
    badge: "3",
    title: "Customers",
    fields: [
      {
        kind: "single",
        id: "main_source",
        label: "Where do most of your customers come from?",
        options: CUSTOMER_SOURCES,
      },
      {
        kind: "single",
        id: "enquiry_outcome",
        label: "When someone enquires about your business, what usually happens?",
        options: [
          "I reply quickly and most of them buy",
          "I reply quickly but they go quiet",
          "I get to them eventually",
          "Some slip through the cracks",
          "I honestly don't track it",
        ],
      },
      {
        kind: "single",
        id: "repeat",
        label: "Do your customers typically come back?",
        options: [
          "Most of them do",
          "About half",
          "A few do",
          "Rarely — it's mostly one-off",
          "Not sure",
        ],
      },
    ],
  },
  {
    badge: "4",
    title: "Money",
    fields: [
      {
        kind: "single",
        id: "revenue_now",
        label: "What's your average monthly revenue?",
        options: REVENUE_WITH_UNSURE,
      },
      {
        kind: "single",
        id: "financial_health",
        label: "How is the business doing financially right now?",
        options: [
          "Comfortably profitable",
          "Just about breaking even",
          "Covering costs but paying myself too little",
          "Losing money",
          "It swings month to month",
          "I'm not sure",
        ],
      },
      {
        kind: "single",
        id: "knows_profit",
        label: "Do you know how much profit you make each month?",
        options: ["Yes", "Roughly", "No"],
      },
    ],
  },
  {
    badge: "5",
    title: "How You Run It",
    fields: [
      {
        kind: "multi",
        id: "headaches",
        label:
          "Which parts of the business eat your time or cause the most headaches?",
        max: 3,
        options: TIME_SINKS,
      },
      {
        kind: "single",
        id: "documented",
        label: "Do you have documented processes for important tasks?",
        options: ["Yes", "Some", "No"],
      },
      {
        kind: "single",
        id: "step_away",
        label:
          "If you were unavailable for two weeks, would the business keep running properly?",
        options: STEP_AWAY,
      },
    ],
  },
  {
    badge: "6",
    title: "What You Want",
    fields: [
      {
        kind: "single",
        id: "goal",
        label: "What's your biggest goal right now?",
        options: GOALS,
      },
      {
        kind: "textarea",
        id: "honest_take",
        label:
          "Be completely honest — what do you think is holding your business back?",
        hint: "Don't worry about getting the answer \"right.\" Tell us what you genuinely think.",
        placeholder: "Type your answer",
      },
      ...CONTACT_FIELDS,
    ],
  },
];

export const QUESTION_COUNT = countQuestions(SECTIONS);
export const FIELD_SHAPES = buildFieldShapes(SECTIONS);
