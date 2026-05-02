import { LMSCalendar } from "../components/Calendar";

export function CalendarPage() {
  return (
    <div className="p-6 h-[calc(100vh-56px)] overflow-hidden animate-in fade-in duration-500">
      <div className="h-full flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Calendar</h2>
          <p className="text-sm text-slate-600 mt-1">Manage your courses, quizzes, and upcoming tests.</p>
        </div>
        <div className="flex-1 overflow-hidden">
          <LMSCalendar />
        </div>
      </div>
    </div>
  );
}
