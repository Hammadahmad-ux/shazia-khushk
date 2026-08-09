import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

interface ContainerProps<T extends ElementType = "div"> {
  as?: T;
  children: ReactNode;
  className?: string;
}

export function Container<T extends ElementType = "div">({
  as,
  children,
  className = "",
}: ContainerProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ContainerProps<T>>) {
  const Component = as ?? "div";

  return (
    <Component
      className={`mx-auto w-full max-w-[var(--container-max)] px-[var(--container-gutter)] ${className}`}
    >
      {children}
    </Component>
  );
}
