# High-Volume Users Dashboard

A performant React application that handles 10,000+ user records with virtualized rendering, real-time search, sorting, filtering, and optimistic updates.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack

- **React 19** + TypeScript
- **Vite** — build tool
- **@tanstack/react-virtual** — row virtualization
- **Zustand** — state management
- **Tailwind CSS v4** — styling

## Performance

### Web Worker for Data Generation
10,000 users are generated in a **Web Worker** — the main thread stays completely free during data creation, ensuring zero UI jank on initial load.

### Virtualization
Only ~20-30 rows live in the DOM at any time (out of 10,000+). `@tanstack/react-virtual` handles viewport-based rendering with 15-row overscan for smooth scrolling.

### Lazy Loading (Code Splitting)
`UserModal` is loaded via `React.lazy()` — it's only fetched when a user clicks a row. This reduces the initial JS bundle by ~10KB and speeds up first paint.

### Expensive Computation
Each row calculates a performance score using trigonometric, logarithmic, and hash-based operations. Memoized with `useMemo` per row — only recomputes when user data changes.

### Re-render Control
- `React.memo` on row and header components
- `useCallback` for stable handler references
- Primitive props passed to rows (no new object allocations per scroll)
- Zustand individual selectors (granular subscriptions)
- Debounced search (400ms) to avoid filtering on every keystroke

### Build Optimization
- **Chunk splitting**: React DOM, react-virtual, zustand — all in separate cached chunks
- **Gzip + Brotli compression**: All assets compressed for production
- **Tree-shaking**: ESNext target for optimal dead-code elimination

#### Production Bundle Sizes (gzip)
| Chunk | Size |
|-------|------|
| App code | ~7 KB |
| React DOM | ~58 KB |
| react-virtual | ~5 KB |
| UserModal (lazy) | ~3 KB |
| CSS | ~6 KB |
| **Total** | **~79 KB** |

## Features

- Virtualized table with 10,000+ rows
- Column sorting (name, email, age, salary, department) with asc/desc toggle
- Debounced search across name, email, and city
- Filters: department, active status, age range (composable)
- Detail modal (click any row) with editable fields
- Optimistic updates with ~30% simulated failure and automatic rollback
- Loading skeleton, error state with retry, empty state

## Project Structure

```
src/
├── components/
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   ├── FilterBar.tsx
│   ├── LoadingState.tsx
│   ├── SearchBar.tsx
│   ├── TableHeader.tsx
│   ├── UserModal.tsx
│   ├── UserRow.tsx
│   └── UsersTable.tsx
├── hooks/
│   ├── useDebounce.ts
│   └── useFilteredUsers.ts
├── store/
│   └── userStore.ts
├── types/
│   └── user.ts
├── utils/
│   ├── computations.ts
│   └── generateUsers.ts
├── workers/
│   └── generateUsers.worker.ts
├── App.tsx
├── index.css
└── main.tsx
```
