import Link from "next/link";

import { primaryNavigation } from "@/data/navigation";

export function DesktopNavigation() {
  return (
    <nav aria-label="Primary" className="hidden xl:block">
      <ul className="flex items-center gap-6 2xl:gap-8">
        {primaryNavigation.map((item) => (
          <li key={item.href}>
            <Link
              className="relative flex min-h-11 items-center text-[0.8125rem] font-medium tracking-[0.01em] text-foreground no-underline transition-colors duration-[var(--transition-fast)] after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-[var(--transition-base)] hover:text-accent hover:after:scale-x-100 focus-visible:after:scale-x-100"
              href={item.href}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
