# Project Specification: Runforge — AI Agent Runs Dashboard (Junior Frontend)

You are a Senior Frontend Engineer. Build the **Runs** page for the **Runforge** web platform strictly according to the technical specification, using a clean modular architecture, strict TypeScript, responsive CSS Modules, and automated tests[cite: 1, 2, 3].

---

## 1. Tech Stack & Constraints

- **Core:** React 18+, Vite, TypeScript (`strict: true`)[cite: 1].
- **Styling:** **CSS Modules** (`*.module.css`) + global CSS custom properties (`src/styles/variables.css`) only[cite: 1].
  - _Forbidden:_ Tailwind CSS, CSS-in-JS (styled-components, Emotion), external UI component libraries (MUI, Ant Design, Chakra, etc.).
- **Testing:** Vitest + React Testing Library (`@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom`)[cite: 2].
- **Data:** Local Promise-based mock service with simulated latency and optional error simulation[cite: 1, 2].
- **Forbidden:** Real AI/LLM APIs, GitHub API, authentication, sandbox execution, or a real backend[cite: 1, 3].

---

## 2. Visual Style & Runforge Design System

Match the Runforge developer-workspace aesthetic shown in the reference: a warm milky/off-white background, deep navy accents, crisp subtle borders, clean spacing, and monospace typography for branches, IDs, durations, and logs[cite: 1, 2]. Do not clone a third-party site verbatim; keep the design system consistent and cohesive[cite: 2].

### `src/styles/variables.css` (use these tokens across all CSS Modules):

```css
:root {
  /* Runforge palette: milky background & deep navy accents */
  --bg-app: #f8f7f4; /* Main milky workspace background */
  --bg-sidebar: #f2f0eb; /* Left sidebar background */
  --bg-surface: #ffffff; /* Cards, table/list container, drawer */
  --bg-surface-hover: #f4f3ef; /* Row/card hover background */
  --bg-subtle: #edebe6; /* Secondary pills, inputs, skeletons */
  --bg-terminal: #0f172a; /* Log viewer surface */

  /* Deep navy brand accents */
  --accent-primary: #102a43; /* Primary buttons, active filter tabs */
  --accent-primary-hover: #1d3b58; /* Primary hover state */
  --accent-soft: #e6eef6; /* Active nav item background */
  --accent-border: #243b53; /* Active focus/border accent */

  /* Typography colors */
  --text-primary: #0f172a; /* Headings and primary copy */
  --text-secondary: #475569; /* Secondary labels and metadata */
  --text-muted: #64748b; /* Placeholders and timestamps */
  --text-inverse: #ffffff; /* Text on dark navy surfaces */

  /* Borders */
  --border-light: #e2e0d8;
  --border-medium: #cbd5e1;

  /* Status tokens (background / text / border) */
  --status-queued-bg: #f1f5f9;
  --status-queued-text: #475569;
  --status-queued-border: #cbd5e1;

  --status-running-bg: #eff6ff;
  --status-running-text: #1d4ed8;
  --status-running-border: #bfdbfe;

  --status-succeeded-bg: #ecfdf5;
  --status-succeeded-text: #047857;
  --status-succeeded-border: #a7f3d0;

  --status-failed-bg: #fef2f2;
  --status-failed-text: #b91c1c;
  --status-failed-border: #fecaca;

  /* Fonts */
  --font-sans:
    'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono:
    'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo,
    monospace;

  /* 4px spacing scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  /* Radii & shadows */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
  --shadow-drawer: -8px 0 24px rgba(15, 23, 42, 0.08);
}
```

### Layout & Responsive Rules (`>= 360px`):

- Desktop (`>= 1024px`): Left sidebar (`240px`) with **Runforge** branding, `WORKSPACE / PROJECT: web-platform` context, active **Runs** nav item, and non-interactive/disabled navigation placeholders (`Projects`, `Devboxes`, `Previews`, `Snapshots`, `Settings`)[cite: 1, 2].
- Tablet/Mobile (`< 1024px`): Sidebar collapses into a compact top bar so content stays spacious[cite: 2].
- At `360px` viewport width: zero horizontal page overflow[cite: 2]. Below `768px`, run items render as responsive stacked cards, filter controls wrap cleanly (`flex-wrap: wrap`), and the details drawer spans `100%` width[cite: 2].

---

## 3. Data Model & Mock Service

### `src/types/run.ts`

```ts
export type RunStatus = 'queued' | 'running' | 'succeeded' | 'failed'

export type StatusFilter = 'all' | RunStatus

export type SortOption = 'newest' | 'oldest' | 'durationDesc'

export interface Run {
  id: string
  name: string
  repository: string
  branch: string
  status: RunStatus
  createdAt: string // ISO 8601
  durationSeconds?: number
  logs: string[]
  result?: string
}
```

### `src/data/mockRuns.ts`

- Provide **at least 8 realistic AI agent runs** covering **all 4 statuses** (`queued`, `running`, `succeeded`, `failed`)[cite: 2].
- Include edge cases: missing `durationSeconds` (e.g., for `queued` runs) and missing `result` (e.g., for `queued` or `running` runs)[cite: 2].
- Each run must have **5–8 meaningful log lines**[cite: 2].

### `src/services/runsService.ts`

```ts
export interface FetchRunsOptions {
  shouldFail?: boolean
  delayMs?: number
}

export function fetchRuns(options: FetchRunsOptions = {}): Promise<Run[]>
```

- Default delay: `650ms` so the loading skeleton is visibly rendered[cite: 2].
- When `shouldFail: true`, reject with `new Error("Failed to load AI agent runs. Please try again.")`[cite: 2].

---

## 4. Functional Requirements & UI States

### 4.1. Toolbar (`RunsToolbar`)

- **Search:** `<input type="search" />` filtering case-insensitively by `run.name` or `run.repository`, with a clear (`×`) button when non-empty[cite: 2].
- **Status filter:** Buttons for `All`, `Queued`, `Running`, `Succeeded`, `Failed` (optional per-status counts)[cite: 2]. Active button has dark navy fill, inverse text, and `aria-pressed="true"`[cite: 2].
- Search and status filter work together (logical `AND`)[cite: 2].
- **Sorting (bonus):** `<select>` for `Newest first`, `Oldest first`, and `Longest duration`[cite: 3].
- **URL sync (bonus):** Sync `status` and `q` query params via `window.history.replaceState` and read initial values from `URLSearchParams` on load[cite: 3].
- **Error simulation toggle:** A clean control in the header/toolbar to trigger a failed fetch for easy manual testing of the error + retry flow[cite: 2].

### 4.2. Runs List & Items (`RunsList`, `RunItem`)

- Display for each run: `name`, `repository` & `branch`, `StatusBadge`, formatted `createdAt`, and formatted `durationSeconds` (`2m 22s`, `45s`, or `—` when undefined)[cite: 2].
- Clicking a row/card or pressing `Enter` / `Space` opens the run details drawer[cite: 2, 3].

### 4.3. Status Badge (`StatusBadge`)

- Never rely on color alone: render a status indicator/icon plus a visible text label (`Queued`, `Running`, `Succeeded`, `Failed`)[cite: 2].

### 4.4. Run Details Drawer (`RunDetailsDrawer`)

- Slide-over drawer (`role="dialog"`, `aria-modal="true"`) with backdrop[cite: 2].
- Shows: back/close controls (`Back to runs` and `×`), title, `StatusBadge`, metadata (`id`, `repository`, `branch`, `createdAt`, `durationSeconds` or `—`), `result` section (or fallback text if `result` is undefined), and numbered monospace `logs`[cite: 2].
- Closes on back/close button click, backdrop click, or `Escape` key[cite: 2, 3].

### 4.5. Required States (`StateViews`)

- **Loading:** Animated skeleton rows/cards while `fetchRuns` is pending[cite: 2].
- **Success:** Filtered (and sorted) list of runs[cite: 2].
- **Empty:** Clear message + **Reset filters** button (resets both search query and status filter to `all`) when no runs match[cite: 2].
- **Error:** Error message + **Retry** button that re-fetches runs[cite: 2].

---

## 5. Project Structure

```text
├── .github/
│   └── copilot-instructions.md
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Layout.tsx
│   │   │   └── Layout.module.css
│   │   ├── RunsToolbar/
│   │   │   ├── RunsToolbar.tsx
│   │   │   └── RunsToolbar.module.css
│   │   ├── RunsList/
│   │   │   ├── RunsList.tsx
│   │   │   ├── RunsList.module.css
│   │   │   ├── RunItem.tsx
│   │   │   └── RunItem.module.css
│   │   ├── StatusBadge/
│   │   │   ├── StatusBadge.tsx
│   │   │   └── StatusBadge.module.css
│   │   ├── RunDetailsDrawer/
│   │   │   ├── RunDetailsDrawer.tsx
│   │   │   └── RunDetailsDrawer.module.css
│   │   └── StateViews/
│   │       ├── LoadingSkeleton.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorState.tsx
│   │       └── StateViews.module.css
│   ├── data/
│   │   └── mockRuns.ts
│   ├── services/
│   │   └── runsService.ts
│   ├── types/
│   │   └── run.ts
│   ├── utils/
│   │   └── formatters.ts
│   ├── pages/
│   │   └── RunsPage.tsx
│   ├── styles/
│   │   ├── variables.css
│   │   └── global.css
│   ├── tests/
│   │   ├── setup.ts
│   │   └── RunsPage.test.tsx
│   ├── App.tsx
│   └── main.tsx
├── AI_LOG.md
├── README.md
└── vite.config.ts
```

---

## 6. Tests (`src/tests/RunsPage.test.tsx`)

Configure Vitest (`environment: "jsdom"`, `setupFiles: "./src/tests/setup.ts"`) and write tests covering:

1. **Status filtering:** Clicking a status filter (e.g. `Failed`) shows only matching runs[cite: 2].
2. **Search & empty state:** Searching by name or repository filters runs; non-matching query shows the empty state, and clicking **Reset filters** restores the list[cite: 2].
3. **Combined search + filter:** Filtering by status and typing a search query narrows results properly[cite: 2].
4. **Details drawer:** Clicking a run opens the drawer with logs, branch, and result; clicking back/close or pressing `Escape` closes it[cite: 2, 3].
5. **Error & retry:** Failed fetch renders error message and **Retry** button, which reloads the runs on click[cite: 2].

---

## 7. Code Quality Rules

- Strict TypeScript with zero `any` and zero `@ts-ignore`.
- No unused imports/variables or leftover `console.log` statements[cite: 2, 3].
- Keep date and duration formatting pure in `src/utils/formatters.ts`[cite: 2].
- Use semantic HTML and clean keyboard accessibility (`Enter`/`Space` on items, `Escape` on drawer)[cite: 2, 3].
