// Every project on the site, generated from src/content/projects.
// Don't edit by hand: change the MDX files, then run pnpm twin:projects
export const projectsKnowledge = `
## AI Digital Twin (2026)

- Page: https://davidaguirre.tech/projects/digital-twin
- Stack: Next.js, TypeScript, Vercel AI SDK, Claude API, Upstash Redis
- Code: https://github.com/davidaguirrel/portfolio-refresh
- Demo: https://davidaguirre.tech

The chat button in the corner of every page opens my AI digital twin. It
answers recruiters' questions about my experience, skills and projects in the
first person, and lets them leave their email so I can get back to them.

### Where it started

I learned the pattern in Ed Donner's Complete Agent and MCP course. My first
version was a Python app with a Gradio chat window and an OpenAI model. It read
my LinkedIn profile and a short summary, and it had two tools that send me a
Pushover notification: one when someone shares their contact details, and one
when it gets a question it can't answer.

### Fitting it into this site

Instead of hosting a separate Python app, I ported the agent to TypeScript and
built it into this portfolio, so it shares the same repo, tests, deploys and
domain.

- A Next.js route handler on Vercel runs the agent with the Vercel AI SDK, which
  streams the answer and handles the tool calls. The model is Claude Haiku.
- The prompt is built from my LinkedIn profile, a summary and the project
  pages on this site, so it stays on career topics and records any question it
  can't answer instead of making something up. A small script turns the
  project pages into the twin's knowledge, and a test fails if I forget to
  run it.
- The chat window is a React component that loads only when you open it, so
  it adds nothing to the page load. On phones it opens full screen.

### Keeping a public endpoint safe

Anyone can call an AI endpoint on a public site, so most of the work went into
protecting it, cheapest checks first:

- Two kill switches: an environment variable and a flag in Upstash Redis.
- A same-origin check, Vercel BotID and strict limits on message size.
- Per-visitor and site-wide rate limits in Upstash Redis, plus a Vercel
  Firewall rule.
- A daily cap on notifications and a hard spending limit on the API key.

### How it's checked

- Vitest covers the prompt, the tools, the rate limits and the API route.
- Playwright tests the chat window against a mocked stream, including keyboard
  use and an axe accessibility scan in both themes.

### What I learned

Calling the model was the easy part. Most of the effort went into the prompt,
abuse protection and cost control, which is what turns a demo into something
I'm happy to leave running on a public site.

## Create React App to Vite (2026, Caterpillar)

- Page: https://davidaguirre.tech/projects/vite-migration
- Stack: React, TypeScript, Vite

Create React App is no longer maintained, so our team moved its production
app to Vite.

### My part

- Contributed to the migration from Create React App to Vite.
- Found the root cause of a critical production bug that surfaced during the
  migration, using GitHub Copilot's image analysis on a screenshot of the
  error.

## This Portfolio (2026)

- Page: https://davidaguirre.tech/projects/portfolio-site
- Stack: Next.js, React, TypeScript, Tailwind CSS, MDX
- Code: https://github.com/davidaguirrel/portfolio-refresh

I rebuilt my personal site from scratch in ten small pull requests, each one
reviewed and checked in CI before it merged.

### What's inside

- Pages are prerendered with React Server Components and ship very little
  JavaScript.
- Each project is an MDX file, and Zod checks its frontmatter, so bad data
  fails the build instead of reaching the site.
- Light and dark themes are built from Tailwind CSS design tokens.
- Every page has metadata, a generated Open Graph image and structured data.

### How it's checked

- GitHub Actions runs lint, formatting, typecheck, tests and the build on
  every pull request.
- Vitest and Testing Library cover the components, and Playwright with axe
  scans every page for accessibility issues in both themes.
- Lighthouse CI fails the pull request if performance, accessibility or SEO
  scores drop.

## Unified View (2026, Caterpillar)

- Page: https://davidaguirre.tech/projects/unified-view
- Stack: React, TypeScript, Component library

Unified View was the frontend team's largest project of 2026, and I led it.
Dealers used to move across several parts of the app to work with a
customer. The redesigned Customers page lets them act on customers, users and
assets from one page.

### My role

- Led the project from planning through delivery, coordinating product, data,
  backend and frontend teams.
- Shipped it together with the move from Material UI to the company's
  in-house component library.

## S3 Storage Cleanup (2025, Caterpillar)

- Page: https://davidaguirre.tech/projects/storage-cleanup
- Stack: AWS, CloudFormation, S3

A security report flagged that our deployment artifacts were kept in S3
forever. I fixed it in the shared CloudFormation template that creates those
buckets.

### What I did

- Added S3 lifecycle and deletion policies, so old artifacts expire instead of
  piling up.
- Used GitHub Copilot to work through infrastructure-as-code I hadn't written
  before.

### Result

Retained storage dropped from over 30 GB to a few hundred MB, and the
security finding was closed.

## COVID-19 Tracker (2020)

- Page: https://davidaguirre.tech/projects/covid19-tracker
- Stack: React, Material UI, Chart.js
- Code: https://github.com/davidaguirrel/covid19-tracker
- Demo: https://davidaguirrel.github.io/covid19-tracker/
- An older project, listed in the archive

A dashboard of COVID-19 case counts, with charts built in Chart.js and a
layout built with Material UI.

## Hacker News Clone (2020)

- Page: https://davidaguirre.tech/projects/hacker-news-clone
- Stack: React, React Router, JavaScript
- Code: https://github.com/davidaguirrel/hacker-news-clone
- Demo: https://practical-dijkstra-d153f5.netlify.app/
- An older project, listed in the archive

A Hacker News reader built with React Router, React Context, reusable
components and code splitting.

## Mobile Flashcards (2019)

- Page: https://davidaguirre.tech/projects/mobile-flashcards
- Stack: React, React Native
- Code: https://github.com/davidaguirrel/mobile-flashcards
- An older project, listed in the archive

A React Native app where you create decks of flashcards and quiz yourself on
them.

## My Reads (2018)

- Page: https://davidaguirre.tech/projects/my-reads
- Stack: React, JavaScript
- Code: https://github.com/davidaguirrel/reactnd-project-myreads-starter
- Demo: https://davidaguirrel.github.io/reactnd-project-myreads-starter
- An older project, listed in the archive

A bookshelf app where you move books between "Currently reading", "Want to
read" and "Read", and search for new books to add.

### What I learned

- Lifting state up to share it between pages
- Calling a REST API with \`fetch\`

## Would You Rather (2018)

- Page: https://davidaguirre.tech/projects/would-you-rather
- Stack: React, Redux
- Code: https://github.com/davidaguirrel/would-you-rather-app
- Demo: https://davidaguirrel.github.io/would-you-rather-app/login
- An older project, listed in the archive

A polling game with a leaderboard, built with React and Redux.
`.trim();
