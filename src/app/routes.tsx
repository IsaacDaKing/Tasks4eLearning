import { createBrowserRouter, Outlet } from "react-router";
import { Sidebar, SidebarProvider, Header } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { CalendarPage } from "./pages/CalendarPage";
import { GradesPage } from "./pages/GradesPage";
import { CoursesPage } from "./pages/CoursesPage";
import { CoursePage } from "./pages/CoursePage";
import { GradeCalculator } from "./pages/GradeCalculator";
import { AssignmentPage } from "./pages/AssignmentPage";
import { SettingsPage } from "./pages/SettingsPage";
import { LoginPage } from "./pages/LoginPage";
import { QuizPage } from "./pages/QuizPage";
import { useLocation } from "react-router";

function Layout() {
  const location = useLocation();
  const getTitle = () => {
    if (location.pathname === "/") return "Dashboard Overview";
    if (location.pathname === "/calendar") return "Academic Calendar";
    if (location.pathname === "/grades") return "Grade Audit Logs";
    if (location.pathname === "/courses") return "Your Enrolled Courses";
    if (location.pathname.startsWith("/courses/") && location.pathname.includes("/assignments/")) return "Assignment Submission";
    if (location.pathname.startsWith("/courses/")) return "Course Details";
    if (location.pathname === "/grade-calculator") return "Grade Calculator";
    if (location.pathname === "/assignment") return "Assignment Submission";
    if (location.pathname === "/quiz") return "Quiz";
    if (location.pathname === "/settings") return "Account Settings";
    return "LMS Dashboard";
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-slate-100 overflow-hidden font-sans selection:bg-slate-200 selection:text-slate-900">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header title={getTitle()} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-100">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <h1 className="text-4xl font-black text-slate-900">404</h1>
      <p className="text-slate-500 font-medium italic font-serif">"Not all who wander are lost, but this page definitely is."</p>
      <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Go Home</a>
    </div>
  );
}

export const router = createBrowserRouter([
  { path: "/login", Component: LoginPage },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "calendar", Component: CalendarPage },
      { path: "grades", Component: GradesPage },
      { path: "courses", Component: CoursesPage },
      { path: "courses/:courseId", Component: CoursePage },
      { path: "courses/:courseId/assignments/:assignmentId", Component: AssignmentPage },
      { path: "grade-calculator", Component: GradeCalculator },
      { path: "assignment", Component: AssignmentPage },
      { path: "quiz", Component: QuizPage },
      { path: "settings", Component: SettingsPage },
      { path: "*", Component: NotFound },
    ],
  },
]);
