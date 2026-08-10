import "server-only";

// The one allowed admin email, configurable via env instead of being
// duplicated across the login action, the route-group guard, and every
// admin Server Action.
export const ADMIN_ALLOWED_EMAIL = process.env.ADMIN_ALLOWED_EMAIL ?? "teamshaziakhushk@gmail.com";
