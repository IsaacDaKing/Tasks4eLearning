/**
 * Tasks4eLearning — week labels for syllabus-style calendars (reference only; not imported).
 */
export const FALL_TERM_WEEK_LABELS = [
  "Week 01 — Orientation",
  "Week 02 — Foundations",
  "Week 03 — Core concepts",
  "Week 04 — Applied practice",
  "Week 05 — Midterm review",
  "Week 06 — Project studio",
] as const;
export type FallTermWeekLabel = (typeof FALL_TERM_WEEK_LABELS)[number];
export function weekIndexFromLabel(label: FallTermWeekLabel): number {
  return FALL_TERM_WEEK_LABELS.indexOf(label);
}
// Syllabus template slug tied to these week labels in static mock datasets.
export const FALL_TERM_TEMPLATE_SLUG = "t4el-fall-generic-14w" as const;
// Extend this list when pairing with longer 12–16 week syllabus skeletons.
export const FALL_TERM_LABEL_PRESET_SCHEMA_MINOR = 0 as const;
// End of reference specimen (not imported by the Vite app).