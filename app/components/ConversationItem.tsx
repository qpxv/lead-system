"use client";

import { useState, useTransition, useRef } from "react";
import { ArrowUpRight, CornerUpLeft, X } from "lucide-react";
import { updateNotes, deleteLead, moveToPipeline } from "@/app/actions";

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
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <span className="text-[14px] font-semibold tracking-tight text-foreground">
              {conversation.name}
            </span>
            <div className="flex items-center gap-2">
              <a
                href={conversation.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors rounded px-1 py-px border border-border bg-background"
              >
                profile
                <ArrowUpRight size={9} />
              </a>
              <span className="w-px h-3 bg-border" />
              <span className="text-[11px] text-muted-foreground font-mono tabular-nums">
                {dateStr}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-0.5 flex-shrink-0">
            {!editing && (
              <button className="app-btn app-btn-outline" onClick={handleEditStart}>
                {notes ? "Edit notes" : "+ Note"}
              </button>
            )}
            <button
              className="app-btn app-btn-icon"
              onClick={handleMoveToPipeline}
              disabled={pending}
              title="Move back to pipeline"
            >
              <CornerUpLeft size={12} />
            </button>
            <button
              className="app-btn app-btn-icon"
              onClick={handleDelete}
              disabled={pending}
              title="Delete"
              style={{ color: "var(--danger)" }}
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* Notes */}
        {editing ? (
          <div className="flex flex-col gap-2">
            <textarea
              ref={textareaRef}
              className="app-textarea"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add notes…"
              rows={3}
            />
            <div className="flex gap-1.5 justify-end">
              <button className="app-btn app-btn-primary" onClick={handleSave} disabled={pending}>
                {pending ? <span className="app-spinner" /> : null}
                Save
              </button>
              <button className="app-btn app-btn-outline" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        ) : notes ? (
          <p
            className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap cursor-pointer rounded-md px-3 py-2.5 border border-border hover:border-accent/30 transition-colors"
            style={{ background: "var(--surface-hover)" }}
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
