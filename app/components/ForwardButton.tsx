"use client";

import { useState, useTransition } from "react";
import { forwardLeads } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function ForwardButton() {
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(1);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await forwardLeads(days);
      setOpen(false);
    });
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        disabled={pending}
        title="Fast-forward active leads"
      >
        {pending ? (
          <span>
            <Spinner />
            Forwarding…
          </span>
        ) : (
          "Forward"
        )}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute top-full right-0 mt-1 z-50 w-52 rounded-lg border border-border bg-background shadow-lg p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Fast-forward leads
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ✕
              </Button>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">
                Days to fast-forward
              </span>
              <select
                value={days}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDays(Number(e.target.value))}
                disabled={pending}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <option key={d} value={d}>
                    {d === 1 ? "1 day" : `${d} days`}
                  </option>
                ))}
              </select>
            </label>

            <Button
              onClick={handleConfirm}
              disabled={pending}
              className="w-full"
            >
              {pending && <Spinner />}
              {pending ? "Forwarding…" : "Fast-forward"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
