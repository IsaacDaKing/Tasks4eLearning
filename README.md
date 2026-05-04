# Tasks4eLearning

Tasks4eLearning is a React, TypeScript, and Vite prototype for a university learning management system. It demonstrates learner, instructor, administrator, and mobile-facing LMS workflows in one local frontend app.

The project was exported from Figma Make and then organized as a runnable Vite application. It is intended for demos, UI review, coursework, and feature exploration. It does not require a backend server or database.

## What you can do

- Sign in as a student, instructor, or administrator demo user.
- Browse course dashboards, course details, assignments, quizzes, grades, and calendar items.
- Use global search to jump to courses, assignments, quizzes, messages, grades, and tools.
- Try sidebar pinning, sidebar collapse, dark mode, high contrast mode, font sizing, and dyslexia-friendly font settings.
- Review instructor class management and administrator dashboard screens.
- Use the local Comet AI study assistant prototype.
- Send local-only messages in the desktop and phone-style views.
- Preview a compact mobile LMS experience at `/phone`.

## Requirements

Install these before running the app:

- Node.js
- pnpm

Check your versions:

```bash
node -v
pnpm -v
```

If `pnpm` is missing, install it with:

```bash
npm install -g pnpm
```

## Run locally

Clone the repository:

```bash
git clone https://github.com/IsaacDaKing/Tasks4eLearning.git
```

Enter the project folder:

```bash
cd Tasks4eLearning
```

Install dependencies:

```bash
pnpm install
```

Start the Vite development server:

```bash
pnpm dev
```

Open the app in your browser:

```text
http://localhost:5173/
```

Keep the terminal window open while you use the app. To stop the server, press `Ctrl + C`.

## Demo accounts

The login screen includes buttons that fill these accounts for you. After filling an account, submit the login form.

| Role | Email | Password | Starts at |
| --- | --- | --- | --- |
| Student | `student@university.edu` | `LearnReady2026!` | `/dashboard` |
| Instructor | `instructor@university.edu` | `TeachReady2026!` | `/instructor-dashboard` |
| Admin | `admin@utd.edu` | `admin123` | `/admin-dashboard` |

The "Continue with University SSO" button also starts a local student session. Authentication is simulated in the browser.

## Main pages

| Path | Purpose |
| --- | --- |
| `/` or `/login` | Demo login, SSO flow, remember email, and forgot-password prototype |
| `/dashboard` | Student dashboard with pinned courses, progress, deadlines, and learning summary |
| `/courses` | Enrolled course list |
| `/courses/:courseId` | Course detail page |
| `/courses/:courseId/assignments/:assignmentId` | Assignment or assessment detail/submission page |
| `/quiz` | Quiz and exam experience |
| `/grades` | Grade feedback and audit-style grade views |
| `/grade-calculator` | Projected scores, final grade, and GPA simulation |
| `/calendar` | Academic calendar and due-date view |
| `/messages` | Course messaging and support-style conversations |
| `/ai-assistant` | Comet AI local study assistant |
| `/settings` | Accessibility, theme, notifications, account, and support preferences |
| `/instructor-dashboard` | Instructor class overview |
| `/instructor-course/:courseId` | Instructor course management |
| `/admin-dashboard` | Administrator dashboard |
| `/phone` | Phone-style mobile LMS prototype |

## How the prototype stores data

This app is frontend-only. It uses browser `localStorage` for temporary prototype state, including:

- signed-in role and profile labels
- remembered email preference
- sidebar pinned tools
- theme, font, contrast, and dyslexia-friendly font settings
- quiet hours and notification preferences
- local message and UI state during the current session

Clearing site data in the browser resets these preferences.

## Useful commands

Start the development server:

```bash
pnpm dev
```

Build the production bundle:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Project structure

```text
src/
  app/
    components/       shared app components and UI primitives
    contexts/         theme and accessibility state
    data/             demo course and assignment data
    pages/            route-level pages
    App.tsx           app providers and router mount
    routes.tsx        browser routes and layout
  imports/            imported requirement notes
  styles/             global styles, theme styles, and fonts
public/               static files served by Vite
reference/            reference data and planning artifacts
images/               source image assets
index.html            Vite HTML entry
package.json          scripts and dependencies
vite.config.ts        Vite configuration
```

## Development notes

- Do not commit `node_modules`; install dependencies with `pnpm install`.
- The app uses React Router, Tailwind CSS, Radix UI primitives, MUI packages, Lucide icons, Recharts, and Motion.
- Course and assignment demo data lives in `src/app/data/courses.ts`.
- Login role behavior lives in `src/app/pages/LoginPage.tsx` and `src/app/sessionProfile.ts`.
- Global navigation, search, notifications, and sidebar pinning live in `src/app/components/Sidebar.tsx`.

## Troubleshooting

If the app does not open:

- Confirm you are inside the project folder.
- Confirm dependencies are installed with `pnpm install`.
- Confirm the dev server is still running.
- Check the terminal for the Vite URL. If port `5173` is busy, Vite may choose another port.

If the app opens but your previous role or settings look wrong, clear the site data for `localhost` or remove the related `localStorage` values in browser developer tools.
