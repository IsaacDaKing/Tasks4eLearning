export type AssessmentType = "Assignment" | "Quiz" | "Exam";

export interface CourseAssignment {
  id: string;
  title: string;
  moduleTitle: string;
  dueDate: string;
  classSection: string;
  type: AssessmentType;
  description: string;
  notes: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  instructor: string;
  progress: number;
  grade: string;
  lessons: number;
  students: number;
  time: string;
  image: string;
  color: string;
  assignments: CourseAssignment[];
}

export const COURSES: Course[] = [
  {
    id: "cs3354",
    title: "Software Engineering",
    code: "CS 3354.012",
    instructor: "Klyne Smith",
    progress: 75,
    grade: "A",
    lessons: 24,
    students: 48,
    time: "2h 45m left",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
    color: "bg-blue-600",
    assignments: [
      {
        id: "1",
        title: "Software Design Patterns Lab",
        moduleTitle: "Module 5: Design Patterns",
        dueDate: "February 19, 2026 at 11:59 PM",
        classSection: "CS 3354.012",
        type: "Assignment",
        description:
          "Submit a complete lab report demonstrating the correct use of software design patterns within the sample architecture.",
        notes:
          "Use UML diagrams and code examples to reflect the pattern choices you made.",
      },
      {
        id: "8",
        title: "Final Project Pitch",
        moduleTitle: "Capstone Review",
        dueDate: "February 26, 2026 at 11:00 AM",
        classSection: "CS 3354.012",
        type: "Quiz",
        description:
          "Complete a short quiz covering the final project requirements and evaluation criteria.",
        notes:
          "You will have one attempt and 20 minutes to finish the quiz.",
      },
    ],
  },
  {
    id: "cs4337",
    title: "Programming Language Paradigms",
    code: "CS 4337.005",
    instructor: "Chris Davis",
    progress: 60,
    grade: "B+",
    lessons: 32,
    students: 36,
    time: "4h 12m left",
    image:
      "https://images.unsplash.com/photo-1544383021-6e6a3c00a92b?q=80&w=1000&auto=format&fit=crop",
    color: "bg-purple-600",
    assignments: [
      {
        id: "7",
        title: "Functional Programming Quiz",
        moduleTitle: "Module 7: Functional Languages",
        dueDate: "February 18, 2026 at 10:00 AM",
        classSection: "CS 4337.005",
        type: "Quiz",
        description:
          "Answer concept and syntax questions covering functional programming paradigms.",
        notes:
          "This quiz is timed and cannot be paused once started.",
      },
    ],
  },
  {
    id: "cs4341",
    title: "Digital Logic and Computer Design",
    code: "CS 4341.003",
    instructor: "Omar Hamdy",
    progress: 45,
    grade: "A-",
    lessons: 18,
    students: 52,
    time: "6h 30m left",
    image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000&auto=format&fit=crop",
    color: "bg-emerald-600",
    assignments: [
      {
        id: "6",
        title: "Logic Circuit Design Test",
        moduleTitle: "Unit 4: Sequential Circuits",
        dueDate: "February 24, 2026 at 3:00 PM",
        classSection: "CS 4341.003",
        type: "Exam",
        description:
          "Complete the midterm using the provided logic circuit designs and timing analysis questions.",
        notes:
          "Bring a calculator and arrive 10 minutes early for check-in.",
      },
    ],
  },
  {
    id: "cs4347",
    title: "Database Systems",
    code: "CS 4347.002",
    instructor: "Wei Wu",
    progress: 90,
    grade: "A",
    lessons: 15,
    students: 42,
    time: "45m left",
    image:
      "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=1000&auto=format&fit=crop",
    color: "bg-pink-600",
    assignments: [
      {
        id: "4",
        title: "SQL Query Optimization",
        moduleTitle: "Module 8: Performance Tuning",
        dueDate: "February 16, 2026 at 11:59 PM",
        classSection: "CS 4347.002",
        type: "Assignment",
        description:
          "Optimize the provided SQL queries and explain the indexes used to improve performance.",
        notes:
          "Document all changes and include before/after runtime measurements.",
      },
      {
        id: "3",
        title: "Midterm: Database Normalization",
        moduleTitle: "Unit 5: Normal Forms",
        dueDate: "February 21, 2026 at 9:00 AM",
        classSection: "CS 4347.002",
        type: "Exam",
        description:
          "Demonstrate your understanding of normalization theory and relational schema design.",
        notes:
          "The exam is proctored and closed book.",
      },
    ],
  },
  {
    id: "cs4390",
    title: "Computer Networks",
    code: "CS 4390.0W1",
    instructor: "Ravi Prakash",
    progress: 82,
    grade: "A-",
    lessons: 28,
    students: 38,
    time: "1h 30m left",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop",
    color: "bg-orange-600",
    assignments: [
      {
        id: "5",
        title: "Network Protocol Analysis",
        moduleTitle: "Module 9: Protocol Design",
        dueDate: "February 17, 2026 at 11:59 PM",
        classSection: "CS 4390.0W1",
        type: "Assignment",
        description:
          "Analyze packet captures and identify the protocol behaviour for the given scenario.",
        notes:
          "Submit both your written analysis and packet annotations.",
      },
    ],
  },
  {
    id: "isns2359",
    title: "Earthquakes and Volcanoes",
    code: "ISNS 2359.0W1",
    instructor: "Ignacio Pujana",
    progress: 65,
    grade: "B+",
    lessons: 20,
    students: 85,
    time: "3h 20m left",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    color: "bg-indigo-600",
    assignments: [
      {
        id: "9",
        title: "Volcanic Hazard Assessment",
        moduleTitle: "Module 3: Volcanic Activity",
        dueDate: "February 20, 2026 at 11:59 PM",
        classSection: "ISNS 2359.0W1",
        type: "Assignment",
        description:
          "Write a research paper assessing volcanic hazards and recommended mitigation strategies.",
        notes:
          "Include at least 8 references and 3 data visualizations.",
      },
    ],
  },
];

export function getCourseById(courseId: string) {
  return COURSES.find((course) => course.id === courseId);
}

export function getAssignmentById(courseId: string, assignmentId: string) {
  const course = getCourseById(courseId);
  return course?.assignments.find((assignment) => assignment.id === assignmentId) ?? null;
}
