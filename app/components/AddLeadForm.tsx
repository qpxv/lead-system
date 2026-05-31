"use client";

import { useRef, useTransition } from "react";
import { Plus } from "lucide-react";
import { createLead } from "@/app/actions";

function stripTrackingParams(raw: string): string {
  try {
    const url = new URL(raw.trim());
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return raw;
  }
}

export default function AddLeadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  function clientAction(formData: FormData) {
    startTransition(async () => {
      await createLead(formData);
      formRef.current?.reset();
    });
  }

  return (
    <form
      ref={formRef}
      action={clientAction}
      className="flex flex-col gap-2 p-3.5 bg-card border border-border rounded-lg"
    >
      <div className="flex flex-row flex-wrap gap-2">
        <input
          name="name"
          type="text"
          placeholder="Name"
          required
          autoComplete="off"
          className="app-input flex-1 min-w-32"
        />
        <input
          name="profileUrl"
          type="url"
          placeholder="Profile URL"
          required
          autoComplete="off"
          className="app-input flex-[2] min-w-48"
          onPaste={(e) => {
            const raw = e.clipboardData.getData("text");
            const clean = stripTrackingParams(raw);
            if (clean !== raw) {
              e.preventDefault();
              e.currentTarget.value = clean;
            }
          }}
        />
      </div>
      <button type="submit" disabled={pending} className="app-btn app-btn-primary app-btn-full">
        {pending ? (
          <span className="app-spinner" />
        ) : (
          <Plus size={13} />
        )}
        {pending ? "Adding…" : "Add Lead"}
      </button>
    </form>
  );
}
