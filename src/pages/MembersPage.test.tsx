import React from "react";
import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MembersPage from "./MembersPage";
import { useAuth } from "../contexts/AuthContext";
import { optimizedApi } from "../lib/optimizedApi";

jest.mock("../contexts/AuthContext", () => ({ useAuth: jest.fn() }));
jest.mock("../lib/optimizedApi", () => ({
  optimizedApi: { getLodgeDocuments: jest.fn() },
}));
jest.mock("../components/VirtualizedList", () => ({
  __esModule: true,
  default: ({ items, renderItem }: any) => (
    <div data-testid="document-list">
      {items.map((_: unknown, index: number) => (
        <React.Fragment key={items[index].id}>
          {renderItem({ index, style: {}, data: items })}
        </React.Fragment>
      ))}
    </div>
  ),
}));

const activeAuth = {
  user: { id: "member-1", email: "member@example.test" },
  profile: {
    id: "profile-1",
    user_id: "member-1",
    full_name: "Active Member",
    role: "member",
    status: "active",
  },
  isAdmin: false,
  signOut: jest.fn(),
  loading: false,
  needsPasswordReset: false,
};

const renderMembersPage = () =>
  render(
    <MemoryRouter>
      <MembersPage />
    </MemoryRouter>
  );

describe("MembersPage documents", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue(activeAuth);
  });

  it("shows an accessible loading state", () => {
    (optimizedApi.getLodgeDocuments as jest.Mock).mockReturnValue(
      new Promise(() => undefined)
    );

    renderMembersPage();

    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading member documents..."
    );
  });

  it("shows an empty state", async () => {
    (optimizedApi.getLodgeDocuments as jest.Mock).mockResolvedValue([]);

    renderMembersPage();

    expect(
      await screen.findByRole("heading", {
        name: "No Member Documents Available",
      })
    ).toBeInTheDocument();
  });

  it("shows an accessible error state", async () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    (optimizedApi.getLodgeDocuments as jest.Mock).mockRejectedValue(
      new Error("Documents unavailable")
    );

    renderMembersPage();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to load documents"
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Documents unavailable"
    );
    consoleError.mockRestore();
  });

  it("renders summonses newest first with meeting details and signed private links", async () => {
    (optimizedApi.getLodgeDocuments as jest.Mock).mockResolvedValue([
      {
        id: "summons-369",
        title: "February 2023 Summons",
        category: "summons",
        file_url: "https://private.test/signed-summons-369",
        url: "https://example.supabase.co/storage/v1/object/public/member-documents/legacy.pdf",
        meeting_date: "2023-02-11",
        document_date: "2023-02-11",
        meeting_number: 369,
        storage_path: "summonses/Meeting 369 - 2023-02-11 - Summons.pdf",
      },
      {
        id: "summons-385",
        title: "April 2026 Summons",
        category: "summons",
        file_url: "https://private.test/signed-summons-385",
        meeting_date: "2026-04-18",
        document_date: "2026-04-18",
        meeting_number: 385,
        storage_path: "summonses/Meeting 385 - 2026-04-18 - Summons.pdf",
      },
    ]);

    renderMembersPage();

    const documentList = await screen.findByTestId("document-list");
    const newer = within(documentList).getByRole("heading", {
      name: "April 2026 Summons",
    });
    const older = within(documentList).getByRole("heading", {
      name: "February 2023 Summons",
    });
    expect(
      newer.compareDocumentPosition(older) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      screen.getByText("Meeting 369 — 11 February 2023")
    ).toBeInTheDocument();
    expect(screen.getByText("Meeting 385 — 18 April 2026")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Summonses, 2 documents" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Open February 2023 Summons in a new tab",
      })
    ).toHaveAttribute("href", "https://private.test/signed-summons-369");
    expect(
      documentList.querySelector('a[href*="/storage/v1/object/public/"]')
    ).not.toBeInTheDocument();
    expect(optimizedApi.getLodgeDocuments).toHaveBeenCalledTimes(1);
  });

  it("renders GPC dates without numbers and preserves Lodge meeting numbers", async () => {
    (optimizedApi.getLodgeDocuments as jest.Mock).mockResolvedValue([
      {
        id: "gpc-2023-07",
        title: "GPC July Minutes",
        description: "GPC minutes — 8 July 2023",
        category: "gpc_minutes",
        file_url: "https://private.test/gpc-2023-07",
        meeting_date: "2023-07-08",
        meeting_number: null,
        storage_path: "GPC minutes/GPC Minutes - 2023-07-08.pdf",
      },
      {
        id: "gpc-virtual",
        title: "GPC Virtual Minutes",
        description: "GPC minutes — virtual meeting, 25 November 2021",
        category: "gpc_minutes",
        file_url: "https://private.test/gpc-virtual",
        meeting_date: "2021-11-25",
        meeting_number: null,
        storage_path:
          "GPC minutes/GPC Minutes - 2021-11-25 - Virtual Meeting.pdf",
      },
      {
        id: "lodge-371",
        title: "Lodge Minutes 371",
        category: "minutes",
        file_url: "https://private.test/lodge-371",
        meeting_date: "2023-07-08",
        meeting_number: 371,
      },
    ]);

    renderMembersPage();

    const documentList = await screen.findByTestId("document-list");
    const gpcHeading = within(documentList).getByRole("heading", {
      name: "GPC July Minutes",
    });
    const gpcRow = gpcHeading.closest("[data-document-id]");
    expect(gpcRow).not.toBeNull();
    expect(within(gpcRow as HTMLElement).getByText("GPC MINUTES")).toBeInTheDocument();
    expect(within(gpcRow as HTMLElement).getByText("8 July 2023")).toBeInTheDocument();
    expect(within(gpcRow as HTMLElement).queryByText(/Meeting \d+/)).not.toBeInTheDocument();
    expect(
      within(gpcRow as HTMLElement).getByRole("link", {
        name: "Open GPC July Minutes in a new tab",
      })
    ).toHaveAttribute("href", "https://private.test/gpc-2023-07");

    expect(
      screen.getByText("25 November 2021 — Virtual Meeting")
    ).toBeInTheDocument();
    expect(screen.getByText("Meeting 371 — 8 July 2023")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "GPC Minutes, 2 documents" })
    ).toBeInTheDocument();
    expect(optimizedApi.getLodgeDocuments).toHaveBeenCalledTimes(1);
  });

  it("sorts GPC minutes newest first", async () => {
    (optimizedApi.getLodgeDocuments as jest.Mock).mockResolvedValue([
      {
        id: "older",
        title: "Older GPC Minutes",
        category: "gpc_minutes",
        file_url: "https://private.test/older",
        meeting_date: "2021-11-25",
      },
      {
        id: "newer",
        title: "Newer GPC Minutes",
        category: "gpc_minutes",
        file_url: "https://private.test/newer",
        meeting_date: "2025-07-12",
      },
    ]);

    renderMembersPage();

    const documentList = await screen.findByTestId("document-list");
    const newer = within(documentList).getByRole("heading", {
      name: "Newer GPC Minutes",
    });
    const older = within(documentList).getByRole("heading", {
      name: "Older GPC Minutes",
    });
    expect(
      newer.compareDocumentPosition(older) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

});
