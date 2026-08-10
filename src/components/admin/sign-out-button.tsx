import { signOutAdmin } from "@/lib/admin/actions/sign-out";

export function SignOutButton() {
  return (
    <form action={signOutAdmin}>
      <button className="admin-shell__sign-out" type="submit">
        Sign Out
      </button>
    </form>
  );
}
