"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import RewindButton from "./RewindButton";
import ForwardButton from "./ForwardButton";

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-[740px] mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span
            className="w-2 h-2 rounded-full bg-accent flex-shrink-0"
            style={{ boxShadow: "0 0 7px var(--accent)" }}
          />
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-foreground">
            Outreach
          </span>
        </div>

        {/* Page tabs */}
        <nav className="flex items-center rounded-md border border-border p-0.5 gap-px bg-muted">
          <Link
            href="/"
            className={cn(
              "px-3 py-1 rounded text-[11px] font-medium transition-colors",
              pathname === "/"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Pipeline
          </Link>
          <Link
            href="/conversations"
            className={cn(
              "px-3 py-1 rounded text-[11px] font-medium transition-colors",
              pathname === "/conversations"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Conversations
          </Link>
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <RewindButton />
          <ForwardButton />
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}
