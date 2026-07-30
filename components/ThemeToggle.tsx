"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") setTheme("light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-paper/70 transition hover:bg-line/40 hover:text-paper"
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]">
          <path
            d="M17 10.8A7 7 0 0 1 9.2 3a7 7 0 1 0 7.8 7.8Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]">
          <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M10 2v2M10 16v2M18 10h-2M4 10H2M15.5 4.5l-1.4 1.4M5.9 14.1l-1.4 1.4M15.5 15.5l-1.4-1.4M5.9 5.9 4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
