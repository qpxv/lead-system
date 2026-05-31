"use client";

import { useOptimistic, useTransition, useState, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { toggleReplied, deleteLead, updateLead } from "@/app/actions";

interface Lead {
  id: string;
  name: string;
  profileUrl: string;
  hasReplied: boolean;
}

interface LeadItemProps {
  lead: Lead;
  dayVar?: string;
  dayGlowVar?: string;
}

export default function LeadItem({ lead, dayVar, dayGlowVar }: LeadItemProps) {
  const [optimisticReplied, setOptimisticReplied] = useOptimistic(lead.hasReplied);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(lead.name);
  const [editUrl, setEditUrl] = useState(lead.profileUrl);
  const [pending, startTransition] = useTransition();
  const nameRef = useRef<HTMLInputElement>(null);

  const checkboxStyle = dayVar
    ? ({ "--dc": dayVar, "--dg": dayGlowVar } as React.CSSProperties)
    : undefined;

  function handleToggle() {
    const next = !optimisticReplied;
    startTransition(async () => {
      setOptimisticReplied(next);
      await toggleReplied(lead.id, next);
    });
  }

  function handleDelete() {
    if (!confirm(`Delete "${lead.name}"?`)) return;
    startTransition(() => deleteLead(lead.id));
  }

  function handleEditStart() {
    setIsEditing(true);
    setTimeout(() => nameRef.current?.focus(), 0);
  }

  function handleEditSave() {
    const name = editName.trim();
    const profileUrl = editUrl.trim();
    if (!name || !profileUrl) return;
    startTransition(async () => {
      await updateLead(lead.id, { name, profileUrl });
      setIsEditing(false);
    });
  }

  function handleEditCancel() {
    setEditName(lead.name);
    setEditUrl(lead.profileUrl);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li className="flex flex-col gap-2 p-2.5 rounded-md bg-muted border border-border my-0.5">
        <input
          ref={nameRef}
          className="app-input"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Name"
          autoComplete="off"
        />
        <input
          className="app-input"
          value={editUrl}
          onChange={(e) => setEditUrl(e.target.value)}
          placeholder="Profile URL"
          type="url"
          autoComplete="off"
        />
        <div className="flex gap-1.5 justify-end">
          <button className="app-btn app-btn-primary" onClick={handleEditSave} disabled={pending}>
            {pending ? <span className="app-spinner" /> : null}
            Save
          </button>
          <button className="app-btn app-btn-outline" onClick={handleEditCancel}>Cancel</button>
        </div>
      </li>
    );
  }

  return (
    <li className={`lead-row ${optimisticReplied ? "opacity-40" : ""}`}>
      {/* Checkbox */}
      <input
        type="checkbox"
        className="app-checkbox"
        style={checkboxStyle}
        checked={optimisticReplied}
        onChange={handleToggle}
        title={optimisticReplied ? "Mark as not replied" : "Mark as replied — moves to Conversations"}
      />

      {/* Name + link */}
      <div className="flex-1 min-w-0 flex items-baseline gap-2">
        <span className={`text-[13px] font-medium truncate text-foreground ${optimisticReplied ? "line-through" : ""}`}>
          {lead.name}
        </span>
        <a
          href={lead.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors rounded px-1 py-px border border-border bg-card flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          profile
          <ArrowUpRight size={9} />
        </a>
      </div>

      {/* Actions */}
      <div className="lead-actions flex items-center gap-0.5 flex-shrink-0">
        <button className="app-btn app-btn-outline" onClick={handleEditStart}>Edit</button>
        <button
          className="app-btn app-btn-icon"
          onClick={handleDelete}
          disabled={pending}
          title="Delete lead"
          style={{ color: "var(--danger)" }}
        >
          <X size={12} />
        </button>
      </div>
    </li>
  );
}
