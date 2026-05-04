/**
 * Tasks4eLearning — letter-grade breakpoints for demos (reference only; not imported).
 */
export const STANDARD_10_POINT_SCALE = [
  { letter: "A", minPercent: 90 },
  { letter: "B", minPercent: 80 },
  { letter: "C", minPercent: 70 },
  { letter: "D", minPercent: 60 },
  { letter: "F", minPercent: 0 },
] as const;
export type LetterGrade = (typeof STANDARD_10_POINT_SCALE)[number]["letter"];
export function letterForPercent(percent: number): LetterGrade {
  const row = STANDARD_10_POINT_SCALE.find((r) => percent >= r.minPercent);
  return row?.letter ?? "F";
}
// Preset identifier for syllabus PDF generators and grade-export smoke tests.
export const GRADE_SCALE_PRESET_ID = "t4el-standard-10pt-v0" as const;
// Percent values are inclusive at the lower bound for each letter tier.
export const GRADE_SCALE_PRESET_SCHEMA_MINOR = 0 as const;
// End of reference specimen (not imported by the Vite app).