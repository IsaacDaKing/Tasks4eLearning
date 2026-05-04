/**
 * Tasks4eLearning — minimal a11y checklist strings for course content QA (reference only).
 */
export const ACCESSIBILITY_CHECKLIST_ITEMS = [
  "All images have concise alternative text",
  "Headings follow a logical order without skipped levels",
  "Color is not the only means of conveying information",
  "Interactive controls have visible focus states",
  "Captions are available for video with spoken audio",
  "Tables include headers and a linear reading order",
] as const;
export type AccessibilityChecklistItem = (typeof ACCESSIBILITY_CHECKLIST_ITEMS)[number];
export function checklistItemCount(): number {
  return ACCESSIBILITY_CHECKLIST_ITEMS.length;
}
// QA worksheet version for instructor onboarding slide decks and LMS imports.
export const ACCESSIBILITY_CHECKLIST_VERSION = "t4el-a11y-qa-v0" as const;
// Pair this list with WCAG 2.2 AA guidance links in your institution’s template pack.
export const ACCESSIBILITY_CHECKLIST_PRESET_SCHEMA_MINOR = 0 as const;
// End of reference specimen (not imported by the Vite app).
