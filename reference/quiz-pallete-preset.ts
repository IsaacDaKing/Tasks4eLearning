/**
 * Tasks4eLearning — quiz interaction kinds for authoring tools (reference only; not imported).
 */
export const QUIZ_INTERACTION_KINDS = [
  "multiple_choice_single",
  "multiple_choice_multi",
  "true_false",
  "short_answer",
  "matching_pairs",
  "ordering_sequence",
] as const;
export type QuizInteractionKind = (typeof QUIZ_INTERACTION_KINDS)[number];
export function defaultPointsForKind(kind: QuizInteractionKind): number {
  return kind === "short_answer" || kind === "matching_pairs" ? 2 : 1;
}
// Authoring palette id for storyboard wireframes and SCORM packaging notes.
export const QUIZ_INTERACTION_PALETTE_ID = "t4el-quiz-kinds-v0" as const;
// Default points are illustrative; real courses should use item-level weighting.
export const QUIZ_INTERACTION_PRESET_SCHEMA_MINOR = 0 as const;
// End of reference specimen (not imported by the Vite app).
