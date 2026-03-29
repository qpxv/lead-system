"use client";

import { useOptimistic, useTransition, useState, useRef } from "react";
import { toggleReplied, deleteLead, updateLead } from "@/app/actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Spinner } from "./ui/spinner";

interface Lead {
  id: string;
  name: string;
  profileUrl: string;
  hasReplied: boolean;
}

export default function LeadItem({ lead }: { lead: Lead }) {
  const [optimisticReplied, setOptimisticReplied] = useOptimistic(lead.hasReplied);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(lead.name);
  const [editUrl, setEditUrl] = useState(lead.profileUrl);
  const [pending, startTransition] = useTransition();
  const nameRef = useRef<HTMLInputElement>(null);

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
        <Input ref={nameRef} value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" />
        <Input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="Profile URL" type="url" />
        <div className="flex gap-1.5 justify-end">
          <Button size="sm" onClick={handleEditSave} disabled={pending}>
            {pending ? <Spinner /> : "Save"}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleEditCancel}>Cancel</Button>
        </div>
      </li>
    );
  }

  return (
    <li className={`lead-row ${optimisticReplied ? "opacity-40" : ""}`}>
      {/* Checkbox */}
      <Checkbox
        checked={optimisticReplied}
        onCheckedChange={handleToggle}
        className="flex-shrink-0"
        title={optimisticReplied ? "Mark as not replied" : "Mark as replied → Conversations"}
      />

      {/* Name + link */}
      <div className="flex-1 min-w-0 flex items-baseline gap-2">
        <span className={`text-sm font-medium truncate text-foreground ${optimisticReplied ? "line-through" : ""}`}>
          {lead.name}
        </span>
        <a
          href={lead.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-muted-foreground hover:text-primary transition-colors truncate flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          ↗ profile
        </a>
      </div>

      {/* Actions — fade in on hover via .lead-actions CSS class */}
      <div className="lead-actions flex items-center gap-0.5 flex-shrink-0">
        <Button variant="ghost" size="sm" onClick={handleEditStart}>Edit</Button>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={pending}>✕</Button>
      </div>
    </li>
  );
}
