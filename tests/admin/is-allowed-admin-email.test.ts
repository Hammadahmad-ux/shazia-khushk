import assert from "node:assert/strict";
import { test } from "node:test";

import { isAllowedAdminEmail } from "../../src/lib/admin/is-allowed-admin-email";

const ALLOWED = "teamshaziakhushk@gmail.com";

test("the allowed admin email is authorized", () => {
  assert.equal(isAllowedAdminEmail("teamshaziakhushk@gmail.com", ALLOWED), true);
});

test("email comparison is case-insensitive", () => {
  assert.equal(isAllowedAdminEmail("TeamShaziaKhushk@Gmail.com", ALLOWED), true);
});

test("a different authenticated email is not authorized", () => {
  assert.equal(isAllowedAdminEmail("someone-else@gmail.com", ALLOWED), false);
});

test("no email (no session) is not authorized", () => {
  assert.equal(isAllowedAdminEmail(null, ALLOWED), false);
  assert.equal(isAllowedAdminEmail(undefined, ALLOWED), false);
  assert.equal(isAllowedAdminEmail("", ALLOWED), false);
});

test("leading/trailing whitespace does not defeat the check", () => {
  assert.equal(isAllowedAdminEmail("  teamshaziakhushk@gmail.com  ", ALLOWED), true);
});
