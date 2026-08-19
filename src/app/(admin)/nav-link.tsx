"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-full px-3.5 py-2 text-[14px] font-semibold transition-colors duration-150 ${
        active
          ? "bg-frost text-navy"
          : "text-muted hover:bg-frost/60 hover:text-navy"
      }`}
    >
      {children}
    </Link>
  );
}
