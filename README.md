# davidaguirre.tech

My personal portfolio, live at [davidaguirre.tech](https://davidaguirre.tech), where I showcase projects I've built and the experience behind them.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, React Server Components)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [pnpm](https://pnpm.io)
- [ESLint](https://eslint.org) and [Prettier](https://prettier.io)

## Getting started

Requires Node.js 24 or later (see `.nvmrc`) and pnpm.

```bash
corepack enable pnpm   # first time only
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script              | What it does                                |
| ------------------- | ------------------------------------------- |
| `pnpm dev`          | Starts the dev server with hot reload       |
| `pnpm build`        | Creates a production build                  |
| `pnpm start`        | Serves the production build locally         |
| `pnpm lint`         | Checks the code with ESLint                 |
| `pnpm typecheck`    | Checks types with the TypeScript compiler   |
| `pnpm format`       | Formats all files with Prettier             |
| `pnpm format:check` | Checks formatting without changing files    |
| `pnpm test`         | Runs the component tests with Vitest        |
| `pnpm test:watch`   | Reruns the component tests on every save    |
| `pnpm test:e2e`     | Runs the browser tests with Playwright      |
| `pnpm lighthouse`   | Audits the production build with Lighthouse |

## Tests

Component tests live next to the component they test (`project-card.test.tsx`) and run in a simulated browser with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com).

Browser tests live in `e2e/` and run with [Playwright](https://playwright.dev) against the production build, on a desktop and a mobile screen. They also scan pages with [axe](https://github.com/dequelabs/axe-core) for accessibility issues in light and dark mode. Before the first run:

```bash
pnpm exec playwright install chromium   # first time only
pnpm build
pnpm test:e2e
```

CI runs both on every pull request.

## Lighthouse

`pnpm lighthouse` runs [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) three times against the home page and a project page, using the last `pnpm build`. It fails if a score drops below the budgets in `lighthouserc.json`: 90 for performance, 100 for accessibility, 95 for best practices and SEO. CI runs it on every pull request and saves the HTML reports as a downloadable artifact.

## Pre-commit hook

`pnpm install` sets up a Git hook with [Husky](https://typicode.github.io/husky/). On every commit, [lint-staged](https://github.com/lint-staged/lint-staged) runs ESLint and Prettier on the staged files and fixes what it can, then `pnpm typecheck` checks the whole project. If anything fails, the commit stops.
