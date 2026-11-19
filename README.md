# Runforge Runs Dashboard

Runforge is a responsive AI-agent runs dashboard built with React, TypeScript, Vite, CSS Modules, and a local Promise-based mock service.

## Setup

Requirements:

- Node.js 18+
- npm

Install dependencies:

```bash
npm install
```

## Run

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Test and lint

Run the integration tests:

```bash
npm test
```

Run ESLint:

```bash
npm run lint
```

Tests use Vitest, React Testing Library, `user-event`, and jsdom. The test configuration is in [`vitest.config.ts`](./vitest.config.ts), with shared setup in [`src/tests/setup.ts`](./src/tests/setup.ts).

## Architecture

```text
src/
├── components/
│   ├── Layout/              Shell, sidebar, responsive mobile header
│   ├── RunsToolbar/         Search, status filters, sorting, error toggle
│   ├── RunsList/            Run collection and keyboard-accessible items
│   ├── StatusBadge/         Visible status label and indicator
│   ├── RunDetailsDrawer/    Modal run details, logs, Escape handling
│   └── StateViews/          Loading, empty, and error states
├── data/mockRuns.ts         Local realistic run fixtures
├── pages/RunsPage.tsx       Fetching, filtering, sorting, URL synchronization
├── services/runsService.ts  Delayed Promise mock service with failure mode
├── types/run.ts             Shared Run, status, and sorting types
├── utils/formatters.ts      Pure date and duration formatters
├── styles/                  Global tokens and baseline styles
├── App.tsx                  Layout and page composition
└── tests/                   RunsPage integration coverage
```

`RunsPage` owns application state. Search and status filters are combined with logical `AND`; `status` and `q` are synchronized to the URL with `history.replaceState`. Sorting is client-side and supports newest, oldest, and longest duration.

Styling uses CSS Modules for component styles and CSS custom properties from [`src/styles/variables.css`](./src/styles/variables.css). No external UI library or backend is required.

## Manual state checks

1. Open the app with `npm run dev`.
2. Confirm the loading skeleton appears briefly before the run list.
3. Click **Failed**, **Running**, or another status button and confirm only matching runs remain.
4. Search by a run name or repository. Combine the search with a status filter.
5. Enter a value with no matches and use **Reset filters** to restore the full list.
6. Change the sort select and confirm the list order changes.
7. Confirm the URL updates with `status` and `q`; reload with those parameters and confirm they are restored.
8. Click a run, inspect its branch, result, and numbered logs, then close with **Back to runs**, `×`, backdrop click, or `Escape`.
9. Enable **Simulate error**, confirm the error state, then click **Retry** after disabling the toggle.
10. Resize below 768px and confirm run items stack as cards; verify the layout remains usable at 360px wide.
