"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import LeadItem from "./LeadItem";
import { Button } from "@/components/ui/button";
import { DAY_LABELS } from "@/lib/dayUtils";

interface Lead {
  id: string;
  name: string;
  profileUrl: string;
  hasReplied: boolean;
}

export default function DayGroup({ day, leads }: { day: number; leads: Lead[] }) {
  const [open, setOpen] = useState(leads.length > 0);
  const label = DAY_LABELS[day] ?? `Day ${day}`;

  function handleOpenAll() {
    leads.forEach((lead, i) => {
      setTimeout(() => window.open(lead.profileUrl, "_blank", "noopener,noreferrer"), i * 120);
    });
  }

  return (
    <div
      className="day-card animate-fade-up"
      style={
        {
          "--dc": `var(--day${day})`,
          "--da": `var(--day${day}-a)`,
          animationDelay: `${(day - 1) * 50}ms`,
        } as React.CSSProperties
      }
    >
      {/* Header */}
      <div className="day-head" onClick={() => setOpen((o) => !o)}>
        {/* Watermark */}
        <span className="day-watermark">{day}</span>

        {/* Left — chevron + badge + label + count */}
        <div className="relative flex items-center gap-2">
          <ChevronDown
            size={12}
            className="text-muted-foreground transition-transform duration-150 flex-shrink-0"
            style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)" }}
          />

          {/* Day badge */}
          <span
            className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-extrabold text-white flex-shrink-0 font-mono"
            style={{ background: `var(--day${day})` }}
          >
            {day}
          </span>

          <span className="text-[13px] font-semibold tracking-tight text-foreground">{label}</span>

          {/* Count badge */}
          <span className="text-[11px] font-semibold tabular-nums font-mono text-muted-foreground bg-muted px-1.5 py-px rounded-full">
            {leads.length}
          </span>
        </div>

        {/* Right — open all */}
        <div className="relative flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {leads.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleOpenAll}>
              Open All ↗
            </Button>
          )}
        </div>
      </div>

      {/* Lead list */}
      {open && (
        <ul className="px-2 pb-2 pt-1 flex flex-col gap-px">
          {leads.length === 0 ? (
            <li className="text-center text-xs text-muted-foreground py-5 font-mono">
              — no leads —
            </li>
          ) : (
            leads.map((lead) => <LeadItem key={lead.id} lead={lead} />)
          )}
        </ul>
      )}
    </div>
  );
}
