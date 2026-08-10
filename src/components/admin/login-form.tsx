"use client";

import { useActionState } from "react";

import { signInAdmin, type SignInState } from "@/lib/admin/actions/sign-in";

const initialState: SignInState = { error: null };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signInAdmin, initialState);

  return (
    <form action={formAction} className="admin-login__form">
      <div className="admin-field">
        <label htmlFor="email">Email</label>
        <input autoComplete="username" id="email" name="email" required type="email" />
      </div>
      <div className="admin-field">
        <label htmlFor="password">Password</label>
        <input autoComplete="current-password" id="password" name="password" required type="password" />
      </div>
      {state.error && (
        <p className="admin-login__error" role="alert">
          {state.error}
        </p>
      )}
      <button className="admin-button admin-button--primary" disabled={isPending} type="submit">
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
