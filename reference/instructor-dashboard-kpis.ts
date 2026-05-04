/** Tasks4eLearning — KPI keys for instructor dashboards (reference only; not imported). */
export const INSTRUCTOR_KPI_KEYS = [
  "active_learners_7d",
  "assignments_due_this_week",
  "ungraded_queue",
  "discussion_posts_pending",
  "live_session_hours_scheduled",
] as const;
export type InstructorKpiKey = (typeof INSTRUCTOR_KPI_KEYS)[number];
export const KPI_DISPLAY_LABEL: Record<InstructorKpiKey, string> = {
  active_learners_7d: "Active learners (7d)",
  assignments_due_this_week: "Due this week",
  ungraded_queue: "Awaiting grade",
  discussion_posts_pending: "Discussions to review",
  live_session_hours_scheduled: "Live hours scheduled",
};
// Human labels track wireframes; use keys only in analytics mocks outside production.
export const KPI_PRESET_BUNDLE_ID = "t4el-instructor-kpis-v0" as const;
export const KPI_PRESET_SCHEMA_MINOR = 0 as const;
// End of reference specimen (not imported by the Vite app).