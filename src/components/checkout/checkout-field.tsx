"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";

interface FieldShellProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

function FieldShell({ label, name, error, required, hint, children }: FieldShellProps) {
  return (
    <div className="checkout-field" data-invalid={error ? "true" : undefined}>
      <label htmlFor={name}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="checkout-field__hint" id={`${name}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="checkout-field__error" id={`${name}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type CheckoutTextFieldProps = {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  hint?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name">;

export const CheckoutTextField = forwardRef<HTMLInputElement, CheckoutTextFieldProps>(function CheckoutTextField(
  { label, name, error, required, hint, ...inputProps },
  ref,
) {
  const describedBy = [error ? `${name}-error` : null, hint && !error ? `${name}-hint` : null].filter(Boolean).join(" ") || undefined;

  return (
    <FieldShell error={error} hint={hint} label={label} name={name} required={required}>
      <input
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        aria-required={required}
        id={name}
        name={name}
        ref={ref}
        {...inputProps}
      />
    </FieldShell>
  );
});

type CheckoutSelectFieldProps = {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "name">;

export const CheckoutSelectField = forwardRef<HTMLSelectElement, CheckoutSelectFieldProps>(function CheckoutSelectField(
  { label, name, error, required, hint, children, ...selectProps },
  ref,
) {
  const describedBy = [error ? `${name}-error` : null, hint && !error ? `${name}-hint` : null].filter(Boolean).join(" ") || undefined;

  return (
    <FieldShell error={error} hint={hint} label={label} name={name} required={required}>
      <select
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        aria-required={required}
        id={name}
        name={name}
        ref={ref}
        {...selectProps}
      >
        {children}
      </select>
    </FieldShell>
  );
});
