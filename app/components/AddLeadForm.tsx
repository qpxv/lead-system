"use client";

import { useRef, useTransition } from "react";
import { createLead } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

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
      className="flex flex-row flex-wrap gap-2 p-3 bg-card border border-border rounded-lg"
    >
      <Input
        name="name"
        type="text"
        placeholder="Name"
        required
        autoComplete="off"
        className="flex-1 min-w-32"
      />
      <Input
        name="profileUrl"
        type="url"
        placeholder="Profile URL"
        required
        autoComplete="off"
        className="flex-[2] min-w-48"
      />
      <Button type="submit" disabled={pending} className="flex-shrink-0">
        {pending && <Spinner />}
        {pending ? "Adding…" : "+ Add Lead"}
      </Button>
    </form>
  );
}
