import { createBrowserRouter, Outlet } from "react-router";
import { Sidebar, SidebarProvider, Header } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { CalendarPage } from "./pages/CalendarPage";
import { GradesPage } from "./pages/GradesPage";
import { CoursesPage } from "./pages/CoursesPage";
import { GradeCalculator } from "./pages/GradeCalculator";
import { AssignmentPage } from "./pages/AssignmentPage";
import { SettingsPage } from "./pages/SettingsPage";
import { LoginPage } from "./pages/LoginPage";
import { QuizPage } from "./pages/QuizPage";
import { useLocation } from "react-router";

function Layout() {
  const location = useLocation();
  const getTitle = () => {
    switch (location.pathname) {
      case "/": return "Dashboard Overview";
      case "/calendar": return "Academic Calendar";
      case "/grades": return "Grade Audit Logs";
      case "/courses": return "Your Enrolled Courses";
      case "/grade-calculator": return "Grade Calculator";
      case "/assignment": return "Assignment Submission";
      case "/quiz": return "Quiz";
      case "/settings": return "Account Settings";
      default: return "LMS Dashboard";
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header title={getTitle()} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-slate-900">
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
      { path: "grade-calculator", Component: GradeCalculator },
      { path: "assignment", Component: AssignmentPage },
      { path: "quiz", Component: QuizPage },
      { path: "settings", Component: SettingsPage },
      { path: "*", Component: NotFound },
    ],
  },
]);
