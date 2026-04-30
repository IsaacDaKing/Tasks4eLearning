import { LMSCalendar } from "../components/Calendar";

export function CalendarPage() {
  return (
    <div className="p-8 h-[calc(100vh-64px)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="h-full flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Academic Calendar</h2>
          <p className="text-slate-500 font-medium">Manage your courses, quizzes, and upcoming tests.</p>
        </div>
        <div className="flex-1 overflow-hidden">
          <LMSCalendar />
        </div>
      </div>
    </div>
  );
}
