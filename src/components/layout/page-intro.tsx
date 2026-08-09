import type { ReactNode } from "react";

interface PageIntroProps {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}

export function PageIntro({ eyebrow, title, children }: PageIntroProps) {
  return (
    <header className="max-w-3xl">
      {eyebrow && (
        <p className="mb-4 text-xs font-semibold tracking-[var(--tracking-label)] text-muted uppercase">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-[var(--text-display)] leading-[var(--leading-tight)] font-normal text-balance">
        {title}
      </h1>
      <div className="mt-6 max-w-2xl text-lg text-muted">{children}</div>
    </header>
  );
}
