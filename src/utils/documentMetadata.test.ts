import {
  formatDocumentDate,
  getDocumentTimestamp,
  getMeetingMetadata,
} from "./documentMetadata";

describe("member document metadata", () => {
  it("shows the meeting number and full UK meeting date", () => {
    expect(
      getMeetingMetadata({
        id: "minutes-374",
        title: "Radlett Lodge Meeting Minutes",
        category: "minutes",
        file_url: "https://example.test/meeting-374.pdf",
        meeting_number: 374,
        meeting_date: "2024-02-10",
      })
    ).toBe("Meeting 374 — 10 February 2024");
  });

  it("uses the meeting date ahead of the upload date for sorting", () => {
    expect(
      getDocumentTimestamp({
        id: "minutes-371",
        title: "Radlett Lodge Meeting Minutes",
        category: "minutes",
        file_url: "https://example.test/meeting-371.pdf",
        meeting_date: "2023-07-08",
        created_at: "2026-08-22T12:00:00Z",
      })
    ).toBe(new Date("2023-07-08").getTime());
  });

  it("returns a safe fallback for an invalid date", () => {
    expect(formatDocumentDate("not-a-date")).toBe("Unknown");
  });
});
