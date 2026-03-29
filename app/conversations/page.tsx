import { prisma } from "@/lib/prisma";
import ConversationItem from "@/app/components/ConversationItem";

export const dynamic = "force-dynamic";

export default async function ConversationsPage() {
  const conversations = await prisma.lead.findMany({
    where: { status: "conversation" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-[740px] mx-auto w-full px-4 py-6 pb-24 flex flex-col gap-5">
      <div className="animate-fade-up">
        <h1 className="text-base font-bold tracking-tight text-foreground">Conversations</h1>
        <p className="text-xs text-muted-foreground mt-px tabular-nums font-mono">
          {conversations.length} {conversations.length === 1 ? "conversation" : "conversations"}
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="animate-fade-up bg-card border border-dashed border-border rounded-lg" style={{ animationDelay: "40ms" }}>
          <div className="flex flex-col items-center py-16 gap-1.5">
            <p className="text-sm font-medium text-muted-foreground">No conversations yet</p>
            <p className="text-xs text-muted-foreground/60 text-center max-w-xs leading-relaxed">
              Mark a lead as replied in the pipeline —<br />they&apos;ll appear here instantly.
            </p>
          </div>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {conversations.map((c: { id: string; name: string; profileUrl: string; notes: string; createdAt: Date }, i: number) => (
            <ConversationItem
              key={c.id}
              conversation={c}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
