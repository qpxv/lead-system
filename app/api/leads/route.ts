import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

function extractUrl(raw: string): string | null {
  // Match the first URL and stop before any subsequent URL —
  // Shortcuts sometimes concatenates two copies with no separator.
  const match = raw.match(/https?:\/\/(?:(?!https?:\/\/).)+/);
  if (!match) return null;
  try {
    const url = new URL(match[0]);
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

async function deriveNameFromUrl(url: string): Promise<string> {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace("www.", "");
    const isX = hostname === "x.com" || hostname === "twitter.com";

    if (isX) {
      const username = parsed.pathname.split("/").filter(Boolean)[0];
      if (!username) return "Unknown";

      // Best-effort fetch of display name from X profile page
      try {
        const res = await fetch(`https://x.com/${username}`, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
          },
          signal: AbortSignal.timeout(3000),
          next: { revalidate: 0 },
        });

        if (res.ok) {
          const html = await res.text();

          // Try og:title: <meta property="og:title" content="Thomas Bergersen (@coolboy)" />
          const ogMatch =
            html.match(/property="og:title"[^>]+content="([^"]+)"/i) ??
            html.match(/content="([^"]+)"[^>]+property="og:title"/i);

          if (ogMatch) {
            const name = ogMatch[1]
              .replace(/\s*\(@[^)]+\).*$/, "")
              .trim();
            if (name && name !== "X") return name;
          }

          // Try <title>: "Thomas Bergersen (@coolboy) / X"
          const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
          if (titleMatch) {
            const name = titleMatch[1]
              .replace(/\s*\(@[^)]+\).*$/, "")
              .replace(/\s*[/|]\s*X\s*$/i, "")
              .trim();
            if (name && name !== "X") return name;
          }
        }
      } catch {
        // Scraping failed — fall through to username
      }

      return `@${username}`;
    }

    // Non-X URLs: use the first meaningful path segment
    const segment = parsed.pathname.split("/").filter(Boolean)[0];
    return segment ? `@${segment}` : hostname;
  } catch {
    return "Unknown";
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl = (body.url as string)?.trim();
    const rawName = (body.name as string)?.trim();

    if (!rawUrl) {
      return Response.json({ error: "url is required" }, { status: 400 });
    }

    const profileUrl = extractUrl(rawUrl);
    if (!profileUrl) {
      return Response.json({ error: "could not parse a valid URL" }, { status: 400 });
    }

    const name = rawName || (await deriveNameFromUrl(profileUrl));

    const lead = await prisma.lead.create({
      data: { name, profileUrl },
      select: { id: true, name: true, profileUrl: true, createdAt: true },
    });

    return Response.json({ success: true, lead });
  } catch (err) {
    console.error("[api/leads] POST failed:", err);
    return Response.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
