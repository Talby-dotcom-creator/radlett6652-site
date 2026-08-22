import { createHash } from "crypto";
import fs from "fs";
import path from "path";

type Article = {
  title: string;
  normalized_title: string;
  content: string;
  source_message_id: string;
  source_url: string;
};

const root = path.resolve(__dirname, "../..");
const migration = fs.readFileSync(
  path.join(
    root,
    "supabase/migrations/20260822150615_repair_snippet_bulk_import_rotation.sql"
  ),
  "utf8"
);
const articles: Article[] = JSON.parse(
  fs.readFileSync(
    path.join(
      root,
      "supabase/imports/freemasons_community_approved_articles.json"
    ),
    "utf8"
  )
);

const existingTitles = [
  "A look at the Masonic obligation",
  "A mystery written above",
  "Collapse by comfort",
  "Defenders of the mind",
  "Depth in a shallow world",
  "Depth in a shallow world  It’s the only way to build a life",
  "Did You Know?",
  "Fame vs. character",
  "Fearing the small things",
  "Holding on to truth",
  "How to let a man stumble",
  "How to make the universe bend",
  "How to respect yourself",
  "If not now, when?",
  "Learn it, or live it again",
  "Maybe the world isn’t lost",
  "Ruthless or real?",
  "Stand back up",
  "The butterfly effect",
  "The duel of ideas",
  "The guilt of doing well",
  "The joy in ordinary",
  "The joys of new beginnings",
  "The kindness you don’t see",
  "The Light Within the Stone",
  "The Mason’s Path",
  "The sound of recognition",
  "The standard you set",
  "The weight without thanks",
  "The weight you don't need",
  "Time (really) is running out",
  "What real Freemasonry looks like",
  "When charm beats truth",
  "Why you should swim back up",
];

const normalize = (title: string) =>
  title
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const orderForSeed = (titles: string[], seed: string) =>
  [...titles].sort((a, b) => {
    const hash = (title: string) =>
      createHash("md5").update(`${seed}:${title}`).digest("hex");
    return hash(a).localeCompare(hash(b)) || a.localeCompare(b);
  });

const londonSlot = (date: Date) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value])
  );
  return parts.weekday === "Mon" && parts.hour === "21" && parts.minute === "00"
    ? `${parts.year}-${parts.month}-${parts.day}`
    : null;
};

describe("snippet import contract", () => {
  it("deduplicates the approved source and explicitly excludes service messages", () => {
    expect(articles).toHaveLength(358);
    expect(new Set(articles.map((item) => item.normalized_title)).size).toBe(358);
    expect(new Set(articles.map((item) => item.source_message_id)).size).toBe(358);
    expect(new Set(articles.map((item) => item.source_url)).size).toBe(358);
    expect(articles.map((item) => item.normalized_title)).not.toEqual(
      expect.arrayContaining([
        "420463 is your substack verification code",
        "you re on the list",
      ])
    );
    expect(articles.some((item) => /view this post on the web|unsubscribe|548 market street/i.test(item.content))).toBe(false);

    const existing = new Set(existingTitles.map(normalize));
    expect(articles.filter((item) => existing.has(item.normalized_title))).toHaveLength(29);
    expect(articles.filter((item) => !existing.has(item.normalized_title))).toHaveLength(329);
    expect(existing.size + 329).toBe(363);
  });

  it("initializes exactly one active item and progresses once per weekly slot", () => {
    const titles = Array.from(
      new Set([...existingTitles.map(normalize), ...articles.map((item) => item.normalized_title)])
    );
    const queue = orderForSeed(titles, "4e36cc16-c957-42c5-b902-67bdd9ac2a5d");
    expect(queue).toHaveLength(363);
    let position = 0;
    let lastSlot: string | null = null;
    const rotate = (runAt: string) => {
      const slot = londonSlot(new Date(runAt));
      if (!slot || slot === lastSlot) return queue[position];
      lastSlot = slot;
      position += 1;
      return queue[position];
    };

    const firstActive = queue[position];
    expect(queue.filter((title) => title === firstActive)).toHaveLength(1);
    expect(rotate("2026-08-24T20:00:00Z")).toBe(queue[1]);
    expect(rotate("2026-08-24T20:00:30Z")).toBe(queue[1]);
    expect(position).toBe(1);
  });

  it("completes every item once, then creates a new shuffled cycle", () => {
    const titles = Array.from(
      new Set([...existingTitles.map(normalize), ...articles.map((item) => item.normalized_title)])
    );
    const first = orderForSeed(titles, "4e36cc16-c957-42c5-b902-67bdd9ac2a5d");
    const second = orderForSeed(titles, "5cb886bb-815d-4897-91b9-0bc73d957be0");
    const shownInCycleOne = new Set<string>();
    for (let position = 0; position < first.length; position += 1) {
      shownInCycleOne.add(first[position]);
    }
    expect(shownInCycleOne.size).toBe(363);
    expect(first[362]).toBeDefined();
    expect(second[0]).toBeDefined();
    expect(new Set(second).size).toBe(363);
    expect(second).not.toEqual(first);
    expect(first.slice().sort()).toEqual(second.slice().sort());
  });

  it("recognizes 9 pm London across BST and GMT transitions", () => {
    expect(londonSlot(new Date("2026-03-23T21:00:00Z"))).toBe("2026-03-23");
    expect(londonSlot(new Date("2026-03-30T20:00:00Z"))).toBe("2026-03-30");
    expect(londonSlot(new Date("2026-10-19T20:00:00Z"))).toBe("2026-10-19");
    expect(londonSlot(new Date("2026-10-26T21:00:00Z"))).toBe("2026-10-26");
    expect(londonSlot(new Date("2026-03-30T21:00:00Z"))).toBeNull();
    expect(londonSlot(new Date("2026-10-26T20:00:00Z"))).toBeNull();
  });

  it("locks down execution and preserves transactional cron replacement", () => {
    expect(migration).toContain("begin;");
    expect(migration.trimEnd()).toMatch(/commit;$/);
    expect(migration).toContain("pg_advisory_xact_lock");
    expect(migration).toContain("Europe/London");
    expect(migration).toContain("'0 20,21 * * 1'");
    expect(migration).toMatch(/revoke execute[\s\S]+from public, anon, authenticated/);
    expect(migration).toContain("drop function public.rotate_snippet_weekly()");
    expect(migration).toContain("drop function public.snippet_activate_one(uuid)");
    expect(migration).toContain("Expected 29 preserved title matches");
    expect(migration).toContain("Import must insert exactly 329 new snippets");
    expect(migration).toContain("Final rotation pool must contain exactly 363 snippets");
  });
});
