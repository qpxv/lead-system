"use client";

import { useState, useTransition } from "react";
import { rewindLeads } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Select } from "@/components/ui/select";

export default function RewindButton() {
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(1);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await rewindLeads(days);
      setOpen(false);
      alert(`Rewound ${result.rewound} lead${result.rewound === 1 ? "" : "s"} by ${days} day${days === 1 ? "" : "s"}.`);
    });
  }

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setOpen((o) => !o)} disabled={pending} title="Rewind active leads">
        {pending ? <span><Spinner/>Rewinding...</span> : "Rewind"}

      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute top-full right-0 mt-1 z-50 w-52 rounded-lg border border-border bg-background shadow-lg p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Rewind leads</span>
              <Button variant="outline" size="sm" onClick={() => setOpen(false)} aria-label="Close">✕</Button>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">Days to rewind</span>
              <Select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                disabled={pending}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <option key={d} value={d}>{d} {d === 1 ? "day" : "days"}</option>
                ))}
              </Select>
            </label>

            <Button onClick={handleConfirm} disabled={pending} className="w-full">
              {pending && <Spinner />}
              {pending ? "Rewinding…" : "Rewind"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
