/**
 * Tasks4eLearning — sample rubric dimension labels (reference only; not imported).
 */
export const SAMPLE_RUBRIC_DIMENSIONS = [
  "clarity_of_argument",
  "use_of_evidence",
  "organization",
  "mechanics_and_style",
  "critical_thinking",
] as const;
export type RubricDimensionPreset = (typeof SAMPLE_RUBRIC_DIMENSIONS)[number];
export function isRubricDimensionPreset(value: string): value is RubricDimensionPreset {
  return (SAMPLE_RUBRIC_DIMENSIONS as readonly string[]).includes(value);
}
// Offline mock bundle id for design-time rubric pickers in Figma-linked specs.
export const RUBRIC_PRESET_BUNDLE_ID = "t4el-rubric-presets-v0" as const;
// Optional: map these keys to LTI resultScore identifiers in integration mocks.
export const RUBRIC_PRESET_SCHEMA_MINOR = 0 as const;
// Keep dimension keys stable when syncing to external rubric banks or LTI tools.
// End of reference specimen (not imported by the Vite app).
