import { readFileSync } from "node:fs";
import { join } from "node:path";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase",
    "migrations",
    "20260821151849_correct_public_event_visibility.sql"
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

    const policyPredicate = migration.match(/using\s*\(([\s\S]*?)\);/i)?.[1];
    expect(policyPredicate).toBeDefined();
    expect(policyPredicate).not.toMatch(/is_members_only/i);

    const canSignedOutUserRead = (event: {
      is_public: boolean | null;
      is_past_event: boolean | null;
      is_members_only: boolean;
    }) => event.is_public === true && event.is_past_event !== true;

    expect(
      canSignedOutUserRead({
        is_public: true,
        is_past_event: false,
        is_members_only: true,
      })
    ).toBe(true);
    expect(
      canSignedOutUserRead({
        is_public: false,
        is_past_event: false,
        is_members_only: false,
      })
    ).toBe(false);
  });

  it("does not remove authenticated-member or administrator policies", () => {
    expect(migration).not.toMatch(
      /drop policy[^;]*(Members|Authenticated|Admin)/i
    );
  });
});
