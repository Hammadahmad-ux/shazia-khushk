// Pure predicate (no server-only imports) so the admin authorization
// rule itself -- not just its wiring into cookies/redirects -- can be
// unit tested directly.

export function isAllowedAdminEmail(email: string | null | undefined, allowedEmail: string): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === allowedEmail.trim().toLowerCase();
}
