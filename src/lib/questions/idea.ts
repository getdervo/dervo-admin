/**
 * The idea assessment: four sections, twenty questions.
 *
 * Trimmed down from the original seven-section design — the 1–5 readiness
 * ratings are gone, most long-form questions became one-line inputs or chips,
 * and name/email moved to the end so the assessment opens on the idea itself.
 */

import {
  buildFieldShapes,
  countQuestions,
  CONTACT_FIELDS,
  type Section,
} from "./types";

export const SECTIONS: Section[] = [
  {
    badge: "1",
    title: "Your Idea",
    fields: [
      {
        kind: "textarea",
        id: "build",
        label: "In a sentence or two, what do you want to build?",
        placeholder:
          "e.g. A weekend meal-prep service for busy families in my neighborhood",
      },
      {
        kind: "text",
        id: "problem",
        label: "What problem does it solve?",
        placeholder: "e.g. Healthy home cooking takes time most families don't have",
      },
      {
        kind: "text",
        id: "who",
        label: "Who is it for?",
        placeholder: "e.g. Working parents nearby who don't have time to cook",
      },
      {
        kind: "single",
        id: "progress",
        label: "How far along are you?",
        options: [
          "Just an idea",
          "Researched it",
          "Have a name/brand",
          "Have a site or socials",
          "Made first sales",
          "Have regular customers",
        ],
      },
      {
        kind: "text",
        id: "differentiator",
        label: "What would make yours different?",
        placeholder: "Type your answer",
      },
    ],
  },
  {
    badge: "2",
    title: "Your Customer",
    fields: [
      {
        kind: "single",
        id: "spoken_to",
        label: "Have you spoken to anyone who fits that description?",
        options: ["Yes, several", "One or two", "Not yet"],
      },
      {
        kind: "multi",
        id: "channels",
        label: "Where would you find them?",
        options: [
          "Instagram",
          "TikTok",
          "Facebook",
          "Google",
          "LinkedIn",
          "In person",
          "Word of mouth",
          "Not sure",
        ],
      },
      {
        kind: "single",
        id: "others_similar",
        label: "Do you know of others doing something similar?",
        options: ["Yes", "No", "Not sure"],
      },
      {
        kind: "text",
        id: "competitors",
        label: "If yes — who?",
        placeholder: "Type your answer",
        showWhen: { field: "others_similar", equals: "Yes" },
      },
    ],
  },
  {
    badge: "3",
    title: "Money",
    fields: [
      {
        kind: "multi",
        id: "revenue_model",
        label: "How would you make money?",
        options: [
          "Selling products",
          "Selling services",
          "Subscription",
          "Commission",
          "Digital products",
          "Consulting",
          "Not sure yet",
        ],
      },
      {
        kind: "text",
        id: "price",
        label: "What could you charge?",
        placeholder: "$45 per session",
      },
      {
        kind: "single",
        id: "price_basis",
        label: "How did you land on that?",
        options: [
          "Competitor pricing",
          "My costs plus margin",
          "What customers told me",
          "Honestly, a guess",
        ],
      },
      {
        kind: "single",
        id: "initial_investment",
        label: "How much could you invest to get started?",
        options: [
          "$0–$500",
          "$500–$1,000",
          "$1,000–$5,000",
          "$5,000–$10,000",
          "$10,000+",
        ],
      },
      {
        kind: "single",
        id: "target_monthly",
        label: "What would you like it to earn per month?",
        options: ["Under $500", "$500–2k", "$2k–5k", "$5k–10k", "$10k+"],
      },
    ],
  },
  {
    badge: "4",
    title: "You",
    fields: [
      {
        kind: "single",
        id: "hours",
        label: "How much time could you give this each week?",
        options: ["Under 5 hrs", "5–10 hrs", "10–20 hrs", "20+ hrs"],
      },
      {
        kind: "multi",
        id: "assets",
        label: "What do you already have going for you?",
        options: [
          "Skills in this area",
          "Industry experience",
          "Equipment or space",
          "An audience",
          "Existing customers",
          "A strong network",
          "Money to invest",
          "Starting fresh",
        ],
      },
      {
        kind: "single",
        id: "blocker",
        label: "What's the biggest thing in your way?",
        options: [
          "I don't know where to start",
          "Money",
          "Time",
          "Lack of knowledge",
          "Fear",
          "Don't know if the idea is good",
          "Marketing",
          "Legal/business setup",
          "Other",
        ],
      },
      {
        kind: "multi",
        id: "help_with",
        label: "What should Dervo help with first?",
        options: [
          "Validate my business idea",
          "Define my target customer",
          "Decide what to charge",
          "Analyze my competitors",
          "Create a marketing strategy",
          "Figure out how to get my first customers",
          "Create a launch plan",
          "Create a 30/60/90-day roadmap",
        ],
      },
      ...CONTACT_FIELDS,
    ],
  },
];

export const QUESTION_COUNT = countQuestions(SECTIONS);
export const FIELD_SHAPES = buildFieldShapes(SECTIONS);
