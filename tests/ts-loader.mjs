import { extname } from "node:path";

// Node's native TypeScript support resolves ESM specifiers exactly like
// JS: relative imports need an explicit extension. The app source under
// src/ follows the project-wide (bundler-resolution) convention of
// extensionless relative imports, matching every other file in the
// codebase. Rather than special-case imports inside src/lib/commerce/
// with a `.ts` suffix that would look inconsistent next to the rest of
// the app, this loader (used only by `npm test`, never by Next.js)
// tries appending .ts/.tsx for extensionless relative specifiers.

const TS_EXTENSIONS = [".ts", ".tsx"];

export async function resolve(specifier, context, nextResolve) {
  const isRelative = specifier.startsWith("./") || specifier.startsWith("../");

  if (isRelative && extname(specifier) === "") {
    for (const ext of TS_EXTENSIONS) {
      try {
        return await nextResolve(specifier + ext, context);
      } catch {
        // try the next extension
      }
    }
  }

  return nextResolve(specifier, context);
}
