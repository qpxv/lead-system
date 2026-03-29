"use client";

import { useState, useTransition, useRef } from "react";
import { updateNotes, deleteLead, moveToPipeline } from "@/app/actions";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Spinner } from "./ui/spinner";

interface Conversation {
  id: string;
  name: string;
  profileUrl: string;
  notes: string;
  createdAt: Date;
}

export default function ConversationItem({ conversation }: { conversation: Conversation }) {
  const [notes, setNotes] = useState(conversation.notes);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(conversation.notes);
  const [pending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleEditStart() {
    setDraft(notes);
    setEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  function handleSave() {
    const trimmed = draft.trim();
    startTransition(async () => {
      await updateNotes(conversation.id, trimmed);
      setNotes(trimmed);
      setEditing(false);
    });
  }

  function handleCancel() {
    setDraft(notes);
    setEditing(false);
  }

  function handleDelete() {
    if (!confirm(`Remove "${conversation.name}" from conversations?`)) return;
    startTransition(() => deleteLead(conversation.id));
  }

  function handleMoveToPipeline() {
    if (!confirm(`Move "${conversation.name}" back to the pipeline?`)) return;
    startTransition(() => moveToPipeline(conversation.id));
  }

  const dateStr = new Date(conversation.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <li className="bg-card border border-border rounded-lg animate-fade-up">
      <div className="p-4 flex flex-col gap-3">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <span className="text-sm font-semibold tracking-tight text-foreground">{conversation.name}</span>
            <div className="flex items-center gap-2">
              <a
                href={conversation.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
              >
                ↗ profile
              </a>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-[11px] text-muted-foreground font-mono">{dateStr}</span>
            </div>
          </div>

          <div className="flex items-center gap-0.5 flex-shrink-0">
            {!editing && (
              <Button variant="ghost" size="sm" onClick={handleEditStart}>
                {notes ? "Edit notes" : "+ Note"}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleMoveToPipeline} disabled={pending} title="Move back to pipeline">
              ↩
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={pending} title="Delete">
              ✕
            </Button>
          </div>
        </div>

        {/* Notes */}
        {editing ? (
          <div className="flex flex-col gap-2">
            <Textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add notes…"
              rows={3}
            />
            <div className="flex gap-1.5 justify-end">
              <Button size="sm" onClick={handleSave} disabled={pending}>
                {pending ? <Spinner /> : "Save"}
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel}>Cancel</Button>
            </div>
          </div>
        ) : notes ? (
          <p
            className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap cursor-pointer rounded-md bg-muted px-3 py-2.5 border border-border hover:border-ring/40 transition-colors"
            onClick={handleEditStart}
            title="Click to edit"
          >
            {notes}
          </p>
        ) : null}

      </div>
    </li>
  );
}
