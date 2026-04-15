"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import RewindButton from "./RewindButton";
import ForwardButton from "./ForwardButton";

export default function Nav() {
  const pathname = usePathname();

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
          <RewindButton />
          <ForwardButton />
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}
