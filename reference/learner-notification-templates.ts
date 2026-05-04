/** Tasks4eLearning — placeholder notification copy for prototypes (reference only; not imported). */
export const NOTIFICATION_TEMPLATE_KEYS = [
  "assignment_due_soon",
  "grade_released",
  "announcement_broadcast",
  "discussion_mention",
  "course_enrollment_confirmed",
] as const;
export type NotificationTemplateKey = (typeof NOTIFICATION_TEMPLATE_KEYS)[number];
export const NOTIFICATION_SUBJECT_HINTS: Record<NotificationTemplateKey, string> = {
  assignment_due_soon: "Reminder: {{title}} is due soon",
  grade_released: "Your grade for {{title}} is available",
  announcement_broadcast: "New announcement in {{courseName}}",
  discussion_mention: "You were mentioned in {{threadTitle}}",
  course_enrollment_confirmed: "You are enrolled in {{courseName}}",
};
// Mustache-style tokens suit copy-deck handoff; body templates would live beside these in a CMS.
export const NOTIFICATION_PRESET_BUNDLE_ID = "t4el-notify-templates-v0" as const;
export const NOTIFICATION_PRESET_SCHEMA_MINOR = 0 as const;
// End of reference specimen (not imported by the Vite app).