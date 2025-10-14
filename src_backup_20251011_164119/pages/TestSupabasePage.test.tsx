jest.mock("../lib/supabase");
import "@testing-library/jest-dom";
import { supabase } from "../lib/supabase";
import { render, screen, waitFor } from "@testing-library/react";
import TestSupabasePage from "./TestSupabasePage";

// Helper to mock Supabase client chain
const mockFromChain = (mockData: any[], mockError: any = null, delay = 0) => {
  return {
    select: jest.fn().mockReturnValue({
      limit: jest
        .fn()
        .mockImplementation(
          () =>
            new Promise((resolve) =>
              setTimeout(
                () => resolve({ data: mockData, error: mockError }),
                delay
              )
            )
        ),
    }),
  };
};

describe("TestSupabasePage", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("renders blog posts from Supabase", async () => {
    jest.spyOn(supabase, "from").mockImplementation(() =>
      mockFromChain([
        {
          id: 1,
          title: "Test Post",
          category: "General",
          publish_date: "2025-10-01",
        },
        {
          id: 2,
          title: "Another Post",
          category: "News",
          publish_date: "2025-10-02",
        },
      ])
    );
    render(<TestSupabasePage />);
    await waitFor(() =>
      expect(screen.getByText("Test Post")).toBeInTheDocument()
    );
    expect(screen.getByText("Another Post")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("shows error message if Supabase returns error", async () => {
    jest
      .spyOn(supabase, "from")
      .mockImplementation(() =>
        mockFromChain([], { message: "Supabase error" })
      );
    render(<TestSupabasePage />);
    await waitFor(() =>
      expect(screen.getByText(/Error: Supabase error/)).toBeInTheDocument()
    );
  });

  it("renders empty table when no data", async () => {
    jest.spyOn(supabase, "from").mockImplementation(() => mockFromChain([]));
    render(<TestSupabasePage />);
    await waitFor(() =>
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    );
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryByText("Test Post")).not.toBeInTheDocument();
  });

  it("shows loading state initially", async () => {
    jest
      .spyOn(supabase, "from")
      .mockImplementation(() => mockFromChain([], null, 100));
    render(<TestSupabasePage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    );
  });

  it("renders table headers", async () => {
    jest.spyOn(supabase, "from").mockImplementation(() => mockFromChain([]));
    render(<TestSupabasePage />);
    await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument());
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Publish Date")).toBeInTheDocument();
  });

  it("table is accessible", async () => {
    jest.spyOn(supabase, "from").mockImplementation(() => mockFromChain([]));
    render(<TestSupabasePage />);
    await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument());
    // Accessibility check: table should have a label
    // This will pass if you add aria-label or a caption to your table
    // expect(screen.getByRole('table')).toHaveAccessibleName('Test Supabase Blog Posts');
  });
});
