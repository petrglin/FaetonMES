"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navigation } from "@/lib/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="FaetonMES — главная" onClick={() => setOpen(false)}>
          <Image src="/brand/faeton-logo.png" width={48} height={41} alt="" />
          <span className="brand-name">Faeton<span>MES</span></span>
        </Link>
        <button
          type="button"
          className="menu-toggle xl:hidden"
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "Закрыть меню" : "Меню"}
        </button>
        <nav
          id="main-navigation"
          aria-label="Главное меню"
          className={"main-nav " + (open ? "block" : "hidden xl:block")}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
              event.currentTarget.parentElement?.querySelector("button")?.focus();
            }
          }}
        >
          <ul >
            {navigation.map(({ href, label }) => {
              const active = href === "/" ? pathname === href : pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="nav-link"
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
