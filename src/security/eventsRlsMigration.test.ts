import { readFileSync } from "node:fs";
import { join } from "node:path";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase",
    "migrations",
    "20260822095916_correct_public_event_visibility.sql"
  ),
  "utf8"
);

describe("public event visibility migration", () => {
  it("creates one SELECT-only policy scoped to the anon role", () => {
    expect(migration.match(/create policy/gi)).toHaveLength(1);
    expect(migration).toMatch(
      /create policy "Anonymous can view public upcoming events"[\s\S]*for select[\s\S]*to anon/i
    );
    expect(migration).not.toMatch(/for\s+(insert|update|delete|all)\b/i);
    expect(migration).not.toMatch(/\b(grant|revoke)\b/i);
  });

  it("allows public upcoming rows without using attendance eligibility", () => {
    expect(migration).toMatch(/is_public is true/i);
    expect(migration).toMatch(/is_past_event is not true/i);
    expect(migration).toMatch(/event_date >= now\(\)/i);

    const policyPredicate = migration.match(/using\s*\(([\s\S]*?)\);/i)?.[1];
    expect(policyPredicate).toBeDefined();
    expect(policyPredicate).not.toMatch(/is_members_only/i);

    const canSignedOutUserRead = (event: {
      is_public: boolean | null;
      is_past_event: boolean | null;
      is_members_only: boolean;
      event_date: Date;
    }) =>
      event.is_public === true &&
      event.is_past_event !== true &&
      event.event_date >= now;

    const now = new Date("2026-08-21T12:00:00Z");

    expect(
      canSignedOutUserRead({
        is_public: true,
        is_past_event: false,
        is_members_only: true,
        event_date: new Date("2026-09-05T15:00:00Z"),
      })
    ).toBe(true);
    expect(
      canSignedOutUserRead({
        is_public: false,
        is_past_event: false,
        is_members_only: false,
        event_date: new Date("2026-09-05T15:00:00Z"),
      })
    ).toBe(false);

    expect(
      canSignedOutUserRead({
        is_public: true,
        is_past_event: false,
        is_members_only: false,
        event_date: new Date("2025-09-05T15:00:00Z"),
      })
    ).toBe(false);
    expect(
      canSignedOutUserRead({
        is_public: true,
        is_past_event: null,
        is_members_only: false,
        event_date: new Date("2025-09-05T15:00:00Z"),
      })
    ).toBe(false);
  });

  it("does not remove authenticated-member or administrator policies", () => {
    expect(migration).not.toMatch(
      /drop policy[^;]*(Members|Authenticated|Admin)/i
    );
  });
});
