import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { AnswerSection } from "../answers";

/**
 * Uses the built-in Helvetica rather than registering Manrope: @react-pdf has
 * to fetch and embed a remote font, which would make every download depend on
 * a third-party request at request time. The brand colours carry the identity.
 */
const NAVY = "#01092d";
const ROYAL = "#0464de";
const AZURE = "#032c7b";
const MUTED = "#5b6b85";
const LIST = "#33405c";
const LINE = "#e3e9f2";

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: LIST,
  },
  brandRow: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  bars: { width: 22, marginRight: 8 },
  bar: { height: 5, borderRadius: 2.5, marginBottom: 2 },
  wordmark: { fontFamily: "Helvetica-Bold", fontSize: 13, color: NAVY, letterSpacing: 0.3 },
  kicker: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: ROYAL,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: { fontFamily: "Helvetica-Bold", fontSize: 20, color: NAVY, marginBottom: 10 },
  meta: { fontSize: 10, color: MUTED, marginBottom: 3 },
  rule: { borderBottomWidth: 1, borderBottomColor: LINE, marginTop: 18, marginBottom: 22 },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: AZURE,
    letterSpacing: 0.9,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  qa: { marginBottom: 12 },
  question: { fontFamily: "Helvetica-Bold", fontSize: 10, color: NAVY, marginBottom: 3 },
  answer: { fontSize: 10.5, color: LIST, lineHeight: 1.5 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  chip: {
    fontSize: 9.5,
    color: LIST,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  empty: { fontSize: 10, color: MUTED, fontStyle: "italic" },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8.5,
    color: MUTED,
  },
});

export type AssessmentPdfProps = {
  kindLabel: string;
  name: string;
  email: string;
  submitted: string;
  sections: AnswerSection[];
};

export function AssessmentDocument({
  kindLabel,
  name,
  email,
  submitted,
  sections,
}: AssessmentPdfProps) {
  return (
    <Document
      title={`${kindLabel} assessment — ${name}`}
      author="Dervo"
      subject="Dervo assessment submission"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.brandRow}>
          <View style={styles.bars}>
            <View style={[styles.bar, { width: 14, backgroundColor: "#aee37b" }]} />
            <View style={[styles.bar, { width: 22, backgroundColor: ROYAL }]} />
            <View style={[styles.bar, { width: 14, backgroundColor: NAVY }]} />
          </View>
          <Text style={styles.wordmark}>DERVO</Text>
        </View>

        <Text style={styles.kicker}>{kindLabel} assessment</Text>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.meta}>{email}</Text>
        <Text style={styles.meta}>Submitted {submitted}</Text>

        <View style={styles.rule} />

        {sections.length === 0 ? (
          <Text style={styles.empty}>
            No answers were recorded beyond the contact details.
          </Text>
        ) : (
          sections.map((section) => (
            // Sections flow across pages; only a question and its answer are
            // held together, or a tall section leaves most of a page blank.
            <View key={section.section} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.section}</Text>

              {section.entries.map((entry) => (
                <View key={entry.id} style={styles.qa} wrap={false}>
                  <Text style={styles.question}>{entry.label}</Text>
                  {Array.isArray(entry.value) ? (
                    <View style={styles.chips}>
                      {entry.value.map((item) => (
                        <Text key={item} style={styles.chip}>
                          {item}
                        </Text>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.answer}>{entry.value}</Text>
                  )}
                </View>
              ))}
            </View>
          ))
        )}

        <View style={styles.footer} fixed>
          <Text>Dervo — confidential</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
