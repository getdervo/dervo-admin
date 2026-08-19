"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "../auth/actions";

const initialState: SignInState = {};

const FIELD =
  "w-full rounded-full border-[1.5px] border-outline bg-white px-5 py-[13px] text-[14.5px] text-navy outline-none placeholder:text-[#9aa8c0]";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-[14px] font-bold text-navy"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="you@example.com"
          aria-describedby={state.error ? "signin-error" : undefined}
          className={FIELD}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-[14px] font-bold text-navy"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          aria-describedby={state.error ? "signin-error" : undefined}
          className={FIELD}
        />
      </div>

      {state.error && (
        <p
          id="signin-error"
          role="alert"
          className="text-[13px] font-medium text-alert"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-royal px-7 py-3.5 text-[15px] font-bold text-frost shadow-dervo-md transition-colors duration-150 hover:bg-royal-dark disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
