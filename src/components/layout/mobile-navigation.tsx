"use client";

import Link from "next/link";
import { useRef } from "react";

import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { primaryNavigation } from "@/data/navigation";

export function MobileNavigation() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function openMenu() {
    dialogRef.current?.showModal();
  }

  function closeMenu() {
    dialogRef.current?.close();
  }

  return (
    <div className="xl:hidden">
      <button
        ref={triggerRef}
        aria-haspopup="dialog"
        aria-label="Open menu"
        className="flex min-h-11 min-w-11 items-center justify-center text-foreground"
        onClick={openMenu}
        type="button"
      >
        <MenuIcon className="size-6" />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="mobile-menu-title"
        className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[min(90vw,24rem)] max-w-none border-0 bg-surface p-0 text-foreground shadow-none backdrop:bg-foreground/40"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeMenu();
          }
        }}
        onClose={() => triggerRef.current?.focus()}
      >
        <div className="flex min-h-full flex-col px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <p id="mobile-menu-title" className="font-display text-2xl leading-none">
              Menu
            </p>
            <button
              aria-label="Close menu"
              className="flex min-h-11 min-w-11 items-center justify-center"
              onClick={closeMenu}
              type="button"
            >
              <CloseIcon className="size-6" />
            </button>
          </div>

          <nav aria-label="Mobile primary" className="flex-1 py-7">
            <ul className="grid gap-1">
              {primaryNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    className="flex min-h-12 items-center border-b border-border py-3 font-display text-2xl leading-tight no-underline transition-colors duration-[var(--transition-fast)] hover:text-accent"
                    href={item.href}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="border-t border-border pt-5 text-sm text-muted">
            Pakistan · PKR
          </p>
        </div>
      </dialog>
    </div>
  );
}
