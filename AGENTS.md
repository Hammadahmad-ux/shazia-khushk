v# Repository Guidelines

## Project Structure & Module Organization

This repository is currently an application scaffold. Its only content is `.codex/skills/ui-ux-pro-max/`, local agent tooling rather than application source. As the storefront is introduced, keep runtime code in `src/`, static files in `public/`, and tests in `tests/` or beside modules as `*.test.*`. Group code by feature (for example, `src/features/cart/`) and put reusable components or utilities in clearly named shared directories.

## Build, Test, and Development Commands

No package manifest, build configuration, or test runner is committed yet, so there are currently no supported build or test commands. Do not document or rely on guessed commands. When the application toolchain is added, expose standard scripts through the package manifest and update this guide. Typical script names should be:

- `npm run dev` - start the local development server.
- `npm run build` - create a production build.
- `npm run lint` - run static analysis and formatting checks.
- `npm test` - execute the automated test suite.

## Coding Style & Naming Conventions

Follow the formatter and linter configurations committed with the eventual application stack. Until then, use two-space indentation for JSON, YAML, JavaScript, and TypeScript; prefer UTF-8 and final newlines. Use `PascalCase` for components and types, `camelCase` for functions and variables, and `kebab-case` for route or asset names. Keep modules focused, reuse existing helpers, and avoid adding dependencies for behavior available in the language or framework.

## Testing Guidelines

No testing framework or coverage threshold exists yet. New features should introduce tests with the selected framework and document its setup. Name tests after observable behavior, such as `cart.test.ts` or `checkout.spec.ts`, and cover success, validation, and failure paths. Run all available lint, type-check, test, and build commands before requesting review.

## Commit & Pull Request Guidelines

Git history is unavailable in the current workspace, so no repository-specific convention can be inferred. Use Conventional Commits (`feat: add cart quantity controls`, `fix: prevent duplicate checkout submission`) with imperative, focused subjects. Pull requests should explain the problem and solution, link relevant work items, list validation commands and results, and include screenshots for visible UI changes. Call out configuration changes, migrations, risks, and rollback steps.

## Security & Configuration

Never commit secrets, credentials, payment keys, or populated environment files. Provide redacted examples such as `.env.example`, validate user-controlled input, and keep server-only values out of client bundles.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
