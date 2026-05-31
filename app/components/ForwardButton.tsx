"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { forwardLeads } from "@/app/actions";

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
      <button
        className="app-btn app-btn-ghost"
        onClick={() => setOpen((o) => !o)}
        disabled={pending}
        title="Fast-forward active leads"
      >
        {pending ? <span className="app-spinner" /> : null}
        {pending ? "Forwarding…" : "Forward"}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute top-full right-0 mt-1 z-50 w-52 rounded-lg border border-border bg-card shadow-xl p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Fast-forward leads</span>
              <button className="app-btn app-btn-icon" onClick={() => setOpen(false)} aria-label="Close">
                <X size={12} />
              </button>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">Days to fast-forward</span>
              <select
                className="app-select"
                value={days}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDays(Number(e.target.value))}
                disabled={pending}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <option key={d} value={d}>{d === 1 ? "1 day" : `${d} days`}</option>
                ))}
              </select>
            </label>

            <button
              className="app-btn app-btn-primary app-btn-full"
              onClick={handleConfirm}
              disabled={pending}
            >
              {pending ? <span className="app-spinner" /> : null}
              {pending ? "Forwarding…" : "Fast-forward"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
