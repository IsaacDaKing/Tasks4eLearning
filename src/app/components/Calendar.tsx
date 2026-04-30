import { useState, useMemo } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Filter,
  Check,
  ChevronDown,
  Info,
  BookOpen,
  LayoutDashboard
} from "lucide-react";
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

const SAMPLE_EVENTS: CalendarEvent[] = [
  { id: "1", title: "React State Management Lab", type: "assignment", date: new Date(2026, 1, 19, 23, 59), course: "CS 301: Web Development", courseId: "cs301", time: "11:59 PM", color: "bg-amber-500" },
  { id: "2", title: "Quiz: Hooks & State", type: "quiz", date: new Date(2026, 1, 19, 14, 0), course: "CS 301: Web Development", courseId: "cs301", time: "2:00 PM", color: "bg-orange-500" },
  { id: "3", title: "Midterm: Database Design", type: "test", date: new Date(2026, 1, 21, 9, 0), course: "CS 401: Database Systems", courseId: "cs401", time: "9:00 AM", color: "bg-red-500" },
  { id: "4", title: "SQL Query Optimization", type: "assignment", date: new Date(2026, 1, 16, 23, 59), course: "CS 401: Database Systems", courseId: "cs401", time: "11:59 PM", color: "bg-amber-500" },
  { id: "5", title: "Algorithm Efficiency Report", type: "assignment", date: new Date(2026, 1, 17, 23, 59), course: "CS 350: Algorithms", courseId: "cs350", time: "11:59 PM", color: "bg-amber-500" },
  { id: "6", title: "UX Principles Test", type: "test", date: new Date(2026, 1, 24, 15, 0), course: "CS 275: HCI Design", courseId: "cs275", time: "3:00 PM", color: "bg-red-500" },
  { id: "7", title: "Git Basics Quiz", type: "quiz", date: new Date(2026, 1, 18, 10, 0), course: "CS 101: Intro to CS", courseId: "cs101", time: "10:00 AM", color: "bg-orange-500" },
  { id: "8", title: "Final Project Pitch", type: "quiz", date: new Date(2026, 1, 26, 11, 0), course: "CS 301: Web Development", courseId: "cs301", time: "11:00 AM", color: "bg-orange-500" },
  { id: "9", title: "HCI Case Study", type: "assignment", date: new Date(2026, 1, 20, 23, 59), course: "CS 275: HCI Design", courseId: "cs275", time: "11:59 PM", color: "bg-amber-500" },
];

const EVENT_TYPE_CONFIG: Record<EventType, { label: string; color: string; ring: string }> = {
  assignment: { label: "Assignments", color: "bg-amber-500", ring: "ring-amber-500" },
  quiz: { label: "Quizzes", color: "bg-orange-500", ring: "ring-orange-500" },
  test: { label: "Tests", color: "bg-red-500", ring: "ring-red-500" },
};

const UNIQUE_COURSES = Array.from(new Set(SAMPLE_EVENTS.map(e => JSON.stringify({ id: e.courseId, name: e.course }))))
  .map(s => JSON.parse(s) as { id: string; name: string });

export function LMSCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1));
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

  const filteredEvents = SAMPLE_EVENTS.filter(event => 
    selectedTypes.includes(event.type) && selectedCourses.includes(event.courseId)
  );

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(event => isSameDay(event.date, day));
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-black text-slate-900 min-w-[140px]">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <div className="flex items-center bg-slate-100/80 p-1 rounded-lg">
              <button 
                onClick={prevMonth}
                className="p-1 hover:bg-white rounded-md transition-all text-slate-600 hover:text-slate-900"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentMonth(startOfToday())}
                className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:bg-white rounded-md transition-all"
              >
                Today
              </button>
              <button 
                onClick={nextMonth}
                className="p-1 hover:bg-white rounded-md transition-all text-slate-600 hover:text-slate-900"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls - More Compact */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Courses:
            </span>
            {UNIQUE_COURSES.map((course) => (
              <button
                key={course.id}
                onClick={() => toggleCourse(course.id)}
                className={cn(
                  "px-2 py-1 rounded-lg text-[10px] font-bold transition-all border",
                  selectedCourses.includes(course.id)
                    ? "bg-blue-600 text-white border-transparent shadow-sm"
                    : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                )}
              >
                {course.name.split(':')[0]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1 flex items-center gap-1">
              <LayoutDashboard className="w-3 h-3" /> Types:
            </span>
            {(Object.entries(EVENT_TYPE_CONFIG) as [EventType, typeof EVENT_TYPE_CONFIG.assignment][]).map(([type, config]) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold transition-all border",
                  selectedTypes.includes(type) 
                    ? `${config.color.replace('bg-', 'bg-').replace('500', '100')} ${config.color.replace('bg-', 'text-').replace('500', '700')} border-transparent ring-1 ${config.ring.replace('ring-', 'ring-offset-1 ring-')}`
                    : "bg-white text-slate-400 border-slate-200"
                )}
              >
                <div className={cn("w-1.5 h-1.5 rounded-full", config.color)} />
                {config.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Grid Header */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-white">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
          <div key={`${day}-${idx}`} className="py-2 text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-r border-slate-100 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid Content - Fixed Vertical Constraint */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-7 border-collapse min-w-[600px]">
          {days.map((day, i) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isDayToday = isToday(day);
            
            return (
              <div 
                key={day.toString()} 
                className={cn(
                  "min-h-[100px] p-1.5 border-r border-b border-slate-100 last:border-r-0 transition-colors group hover:bg-slate-50/50",
                  !isCurrentMonth && "bg-slate-50/50"
                )}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className={cn(
                    "flex items-center justify-center w-6 h-6 text-[11px] font-black rounded-full transition-all",
                    isDayToday ? "bg-blue-600 text-white shadow-sm" : isCurrentMonth ? "text-slate-900" : "text-slate-300"
                  )}>
                    {format(day, "d")}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[8px] font-black text-slate-400 bg-slate-100 px-1 py-0.5 rounded-full uppercase">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayEvents.map((event) => (
                    <motion.button
                      layoutId={event.id}
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={cn(
                        "w-full text-left p-1 rounded text-[9px] font-bold leading-tight truncate transition-all shadow-sm active:scale-95",
                        event.color,
                        "text-white"
                      )}
                    >
                      <div className="flex items-center gap-0.5 mb-0.5 opacity-80 overflow-hidden">
                        <span className="font-black uppercase text-[7px] tracking-wider whitespace-nowrap">
                          {event.type.slice(0, 4)}
                        </span>
                        <span>•</span>
                        <span className="whitespace-nowrap">{event.time}</span>
                      </div>
                      <div className="truncate">{event.title}</div>
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className={cn("h-32 p-6 flex items-end justify-between relative", selectedEvent.color)}>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                >
                  <ChevronDown className="w-5 h-5 rotate-180" />
                </button>
                <div className="text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                      {selectedEvent.type}
                    </span>
                    <span className="text-white/80 text-sm font-bold">{selectedEvent.time}</span>
                  </div>
                  <h3 className="text-2xl font-black leading-tight">{selectedEvent.title}</h3>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Course</p>
                    <p className="text-slate-900 font-bold">{selectedEvent.course}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-50 rounded-xl">
                    <CalendarIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</p>
                    <p className="text-slate-900 font-bold">{format(selectedEvent.date, "EEEE, MMMM do, yyyy")}</p>
                    <p className="text-sm text-slate-500 font-medium">{selectedEvent.time}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl flex items-start gap-3 border border-slate-100">
                  <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {selectedEvent.type === 'assignment' && 'Submit your files in PDF format. Late submissions will receive a 10% penalty per day.'}
                    {selectedEvent.type === 'quiz' && ' This quiz covers the current module. You have 30 minutes to complete it once started.'}
                    {selectedEvent.type === 'test' && ' This is a proctored midterm exam. Ensure your webcam and microphone are working.'}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button className="flex-1 bg-blue-600 text-white font-black py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
                    {selectedEvent.type === 'assignment' ? 'Submit Work' : 'Start Assessment'}
                  </button>
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="px-6 py-3 border border-slate-200 text-slate-600 font-black rounded-xl hover:bg-slate-50 transition-all"
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
