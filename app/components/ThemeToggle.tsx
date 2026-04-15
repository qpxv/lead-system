"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Pref = "system" | "light" | "dark";

function getInitialPref(): Pref {
  try {
    const s = localStorage.getItem("theme");
    if (s === "light" || s === "dark") return s;
  } catch {}
  return "system";
}

function applyTheme(pref: Pref) {
  const dark =
    pref === "dark" ||
    (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  if (pref === "system") {
    localStorage.removeItem("theme");
  } else {
    localStorage.setItem("theme", pref);
  }
}

const icons: Record<Pref, React.ReactNode> = {
  system: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  light: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  ),
  dark: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
};

export default function ThemeToggle() {
  const [pref, setPref] = useState<Pref>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPref(getInitialPref());
  }, []);

  useEffect(() => {
    if (!mounted || pref !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) =>
      document.documentElement.classList.toggle("dark", e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mounted, pref]);

  function cycle() {
    const next: Pref = pref === "system" ? "light" : pref === "light" ? "dark" : "system";
    setPref(next);
    applyTheme(next);
  }

  const labels: Record<Pref, string> = { system: "Auto", light: "Light", dark: "Dark" };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycle}
      title={`Theme: ${labels[pref ?? "system"]} — click to cycle`}
      aria-label={`Theme: ${labels[pref ?? "system"]}`}
    >
      {mounted ? icons[pref] : icons.system}
    </Button>
  );
}
