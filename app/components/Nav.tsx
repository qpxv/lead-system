"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { runDailyAutomation } from "@/app/actions";
import { useTransition } from "react";
import ThemeToggle from "./ThemeToggle";
import { Spinner } from "./ui/spinner";

export default function Nav() {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function handleRunAutomation() {
    startTransition(async () => {
      const result = await runDailyAutomation();
      alert(`Automation done\n• Deleted: ${result.deleted}\n• Promoted: ${result.converted}`);
    });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/75 backdrop-blur-md">
      <div className="max-w-[740px] mx-auto px-4 h-12 flex items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-[7px] h-[7px] rounded-full bg-primary" />
          <span className="text-sm font-semibold tracking-tight text-foreground">Outreach</span>
        </div>

        {/* Segmented nav */}
        <nav
          className="flex gap-px bg-muted rounded-lg p-0.5"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className={[
              "px-3 py-1 rounded-md text-xs font-medium transition-colors no-underline",
              pathname === "/"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            Pipeline
          </Link>
          <Link
            href="/conversations"
            className={[
              "px-3 py-1 rounded-md text-xs font-medium transition-colors no-underline",
              pathname === "/conversations"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            Conversations
          </Link>
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleRunAutomation}
            disabled={pending}
            title="Run daily automation"
            className="hidden sm:flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-40"
          >
            {pending ? <Spinner /> : <span className="text-[11px]">⚡</span>}
            {pending ? "Running…" : "Run Daily"}
          </button>
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}
