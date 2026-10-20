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

| Script              | What it does                              |
| ------------------- | ----------------------------------------- |
| `pnpm dev`          | Starts the dev server with hot reload     |
| `pnpm build`        | Creates a production build                |
| `pnpm start`        | Serves the production build locally       |
| `pnpm lint`         | Checks the code with ESLint               |
| `pnpm typecheck`    | Checks types with the TypeScript compiler |
| `pnpm format`       | Formats all files with Prettier           |
| `pnpm format:check` | Checks formatting without changing files  |
