import { useState, useMemo } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  ChevronDown,
  Info,
  BookOpen,
  LayoutDashboard
} from "lucide-react";
import { Link } from "react-router";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday,
  startOfToday
} from "date-fns";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "motion/react";
import { COURSES, type AssessmentType } from "../data/courses";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type EventType = "assignment" | "quiz" | "test";

interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: Date;
  course: string;
  courseId: string;
  duration?: string;
  time?: string;
  color: string;
}

const COURSE_EVENT_COLORS: Record<string, string> = {
  cs3354: "bg-blue-600",
  cs4337: "bg-violet-600",
  cs4341: "bg-emerald-600",
  cs4347: "bg-pink-600",
  cs4390: "bg-orange-700",
  isns2359: "bg-indigo-600",
};

const EVENT_TYPE_CONFIG: Record<EventType, { label: string }> = {
  assignment: { label: "Assignment" },
  quiz: { label: "Quiz" },
  test: { label: "Test" },
};

function parseDueDate(dueDate: string) {
  return new Date(dueDate.replace(" at ", " "));
}

function assessmentToEventType(type: AssessmentType): EventType {
  if (type === "Quiz") return "quiz";
  if (type === "Exam") return "test";
  return "assignment";
}

function eventPrefix(type: AssessmentType) {
  if (type === "Exam") return "Test";
  return type;
}

const COURSE_EVENTS: CalendarEvent[] = COURSES.flatMap((course) =>
  course.assignments.map((assignment) => {
    const date = parseDueDate(assignment.dueDate);
    return {
      id: assignment.id,
      title: `${eventPrefix(assignment.type)}: ${assignment.title}`,
      type: assessmentToEventType(assignment.type),
      date,
      course: `${course.code}: ${course.title}`,
      courseId: course.id,
      time: format(date, "h:mm a"),
      color: COURSE_EVENT_COLORS[course.id] ?? "bg-slate-700",
    };
  }),
);

const UNIQUE_COURSES = COURSES.map((course) => ({
  id: course.id,
  name: `${course.code}: ${course.title}`,
  color: COURSE_EVENT_COLORS[course.id] ?? "bg-slate-700",
}));

export function LMSCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4, 1));
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>(["assignment", "quiz", "test"]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>(UNIQUE_COURSES.map(c => c.id));
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const toggleType = (type: EventType) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleCourse = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const filteredEvents = COURSE_EVENTS.filter(event =>
    selectedTypes.includes(event.type) && selectedCourses.includes(event.courseId)
  );

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(event => isSameDay(event.date, day));
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="flex flex-col h-full bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
      {/* Calendar Header */}
      <div className="p-3 border-b border-slate-200 space-y-2 bg-slate-50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900 min-w-[130px]">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <div className="flex items-center bg-slate-100 p-0.5 rounded">
              <button 
                onClick={prevMonth}
                className="p-1 hover:bg-white rounded transition-all text-slate-600 hover:text-slate-900"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentMonth(startOfToday())}
                className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-700 hover:bg-white rounded transition-all"
              >
                Today
              </button>
              <button 
                onClick={nextMonth}
                className="p-1 hover:bg-white rounded transition-all text-slate-600 hover:text-slate-900"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded border border-slate-200 bg-white p-2">
          <span className="text-xs font-black uppercase tracking-wide text-slate-500">Legend</span>
          {UNIQUE_COURSES.map((course) => (
            <span key={course.id} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <span className={cn("h-2.5 w-2.5 rounded-full", course.color)} />
              {course.name.split(":")[0]}
            </span>
          ))}
        </div>

        {/* Filter Controls - More Compact */}
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Courses:
            </span>
            {UNIQUE_COURSES.map((course) => (
              <button
                key={course.id}
                onClick={() => toggleCourse(course.id)}
                className={cn(
                  "px-2 py-1 rounded text-xs font-medium transition-all border",
                  selectedCourses.includes(course.id)
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                )}
              >
                {course.name.split(':')[0]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <LayoutDashboard className="w-3 h-3" /> Types:
            </span>
            {(Object.entries(EVENT_TYPE_CONFIG) as [EventType, typeof EVENT_TYPE_CONFIG.assignment][]).map(([type, config]) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all border",
                  selectedTypes.includes(type) 
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-600 border-slate-200"
                )}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Grid Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-white">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
          <div key={`${day}-${idx}`} className="py-2 text-center text-xs font-semibold text-slate-600 uppercase border-r border-slate-100 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid Content - Fixed Vertical Constraint */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-7 border-collapse min-w-[600px]">
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isDayToday = isToday(day);
            
            return (
              <div 
                key={day.toString()} 
                className={cn(
                  "min-h-[112px] p-1.5 border-r border-b border-slate-100 last:border-r-0 transition-colors group hover:bg-slate-50",
                  !isCurrentMonth && "bg-slate-50"
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={cn(
                    "flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full transition-all",
                    isDayToday ? "bg-slate-800 text-white shadow-sm" : isCurrentMonth ? "text-slate-900" : "text-slate-400"
                  )}>
                    {format(day, "d")}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[7px] font-semibold text-slate-500 bg-slate-100 px-1 py-0.5 rounded">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  {dayEvents.map((event) => (
                    <motion.button
                      layoutId={event.id}
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={cn(
                        "w-full text-left px-2 py-1.5 rounded text-xs font-bold leading-tight transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500",
                        event.color,
                        "text-white"
                      )}
                    >
                      <div className="truncate">{event.title}</div>
                      <div className="truncate text-[10px] font-semibold opacity-95">{event.time}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded shadow-lg w-full max-w-md overflow-hidden"
            >
              <div className={cn("h-24 p-4 flex items-end justify-between relative", selectedEvent.color)}>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-2 right-2 p-1 bg-white/20 hover:bg-white/30 rounded text-white transition-colors"
                >
                  <ChevronDown className="w-4 h-4 rotate-180" />
                </button>
                <div className="text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-white/20 px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider">
                      {EVENT_TYPE_CONFIG[selectedEvent.type].label}
                    </span>
                    <span className="text-white/80 text-xs font-medium">{selectedEvent.time}</span>
                  </div>
                  <h3 className="text-lg font-bold leading-tight">{selectedEvent.title}</h3>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded">
                    <BookOpen className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Course</p>
                    <p className="text-sm text-slate-900 font-medium">{selectedEvent.course}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded">
                    <CalendarIcon className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Schedule</p>
                    <p className="text-sm text-slate-900 font-medium">{format(selectedEvent.date, "EEEE, MMMM do, yyyy")}</p>
                    <p className="text-xs text-slate-500 font-medium">{selectedEvent.time}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl flex items-start gap-3 border border-slate-100">
                  <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {selectedEvent.type === 'assignment' && 'Submit your files in PDF, DOC, or DOCX format before the due date.'}
                    {selectedEvent.type === 'quiz' && 'Open the assignment detail page for instructions, attempts, and submission information.'}
                    {selectedEvent.type === 'test' && 'Review the instructions and submission details before starting this test.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Link
                    to={`/courses/${selectedEvent.courseId}/assignments/${selectedEvent.id}`}
                    className="flex-1 inline-flex items-center justify-center bg-slate-800 text-white font-medium py-2 rounded hover:bg-slate-900 transition-all active:scale-95 text-sm"
                  >
                    Open Details
                  </Link>
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded hover:bg-slate-50 transition-all text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
