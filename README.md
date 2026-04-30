# Tasks4eLearning

A React, TypeScript, and Vite learning management system app exported from Figma Make.

## Requirements

Before running the project, install:

- Node.js
- pnpm

Check if you already have them:

```bash
node -v
pnpm -v
```

If `pnpm` is missing, install it with:

```bash
npm install -g pnpm
```

## How to run the project locally

Clone the repository:

```bash
git clone https://github.com/IsaacDaKing/Tasks4eLearning.git
```

Go into the project folder:

```bash
cd Tasks4eLearning
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open the local app in your browser:

```text
http://localhost:5173/
```

Keep the Terminal window open while using the app.

To stop the app, press:

```text
Ctrl + C
```

## Project structure

```text
src/
  app/
    components/
    contexts/
    pages/
    App.tsx
    routes.tsx
  styles/
  main.tsx
index.html
package.json
vite.config.ts
```

## Useful commands

Run the app:

```bash
pnpm dev
```

Build the app for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Notes

Do not upload `node_modules` to GitHub. Dependencies are installed with:

```bash
pnpm install
```

If the app does not open, make sure you are inside the project folder and that the development server is running.
