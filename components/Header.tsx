"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Logo } from "./Logo";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/mayorista", label: "Mayorista" },
  { href: "/aliados", label: "Aliados" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-bone/90 backdrop-blur-md border-b border-forest-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 text-forest-800">
            <Logo variant="full" color="dark" className="text-xl md:text-2xl" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-sm transition-colors relative ${
                    active
                      ? "text-forest-900"
                      : "text-forest-700 hover:text-forest-900"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-4 right-4 h-px bg-forest-700" />
                  )}
                </Link>
              );
            })}
            <a
              href="https://wa.me/5492614191619" target="_blank" rel="noopener noreferrer"
              className="ml-3 px-5 py-2 text-sm bg-forest-800 text-bone hover:bg-forest-900 rounded-full transition-colors"
            >
              WhatsApp
            </a>
          </nav>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 -m-2 text-forest-800"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <>
                  <path d="M3 7h18M3 17h18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-forest-100 py-4 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2 py-2 text-base ${
                    pathname === item.href
                      ? "text-forest-900 font-medium"
                      : "text-forest-700"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
