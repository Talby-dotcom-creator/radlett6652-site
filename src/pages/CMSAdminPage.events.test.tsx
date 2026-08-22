import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CMSAdminPage from "./CMSAdminPage";

const mockUpcomingEvent = {
  id: "c12148cb-ab65-4d01-a5d4-8149aae17a6c",
  title: "Radlett Lodge Regular Meeting",
  description: "The September Regular Meeting of Radlett Lodge No. 6652.",
  event_date: "2026-09-05T15:00:00Z",
  location: "Radlett Masonic Centre",
  event_type: "regular",
  image_url: null,
  is_public: true,
  is_members_only: true,
  is_past_event: false,
};

jest.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "admin-user" },
    isAdmin: true,
    loading: false,
    signOut: jest.fn(),
  }),
}));

jest.mock("../lib/cmsApi", () => ({
  cmsApi: {
    getEvents: jest.fn(),
    getNewsArticles: jest.fn().mockResolvedValue([]),
    getOfficers: jest.fn().mockResolvedValue([]),
    getTestimonials: jest.fn().mockResolvedValue([]),
    getFAQItems: jest.fn().mockResolvedValue([]),
    getSiteSettings: jest.fn().mockResolvedValue([]),
    getPageContent: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock("../lib/optimizedApi", () => ({
  optimizedApi: {
    getEvents: jest.fn(),
    getSnippets: jest.fn().mockResolvedValue([]),
    getMemberResources: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock("../lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => {
        const result: any = Promise.resolve({ count: 0, data: [], error: null });
        result.eq = jest
          .fn()
          .mockResolvedValue({ count: 0, data: [], error: null });
        return result;
      }),
    })),
    storage: {
      from: jest.fn(() => ({
        list: jest.fn().mockResolvedValue({ data: [], error: null }),
      })),
    },
  },
}));

jest.mock("../components/cms/EventForm", () => ({ initialData }: any) => (
  <div data-testid="event-form">
    <span>{initialData?.id}</span>
    <span>{initialData?.title}</span>
    <span>{initialData?.event_date}</span>
  </div>
));

jest.mock("../components/MediaManager", () => () => null);
jest.mock("../components/cms/BulkActions", () => () => null);
jest.mock("../components/QuillEditor", () => () => null);

describe("CMS events editing", () => {
  it("opens and reveals a database-created upcoming event for editing", async () => {
    const { cmsApi } = jest.requireMock("../lib/cmsApi");
    const { optimizedApi } = jest.requireMock("../lib/optimizedApi");
    cmsApi.getEvents.mockResolvedValue([mockUpcomingEvent]);
    optimizedApi.getEvents.mockResolvedValue([mockUpcomingEvent]);

    const scrollIntoView = jest.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });
    Object.defineProperty(window, "requestAnimationFrame", {
      configurable: true,
      value: jest.fn((callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      }),
    });

    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <CMSAdminPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Events \(/ })).toBeEnabled()
    );
    fireEvent.click(screen.getByRole("button", { name: /Events \(/ }));

    await screen.findByText(mockUpcomingEvent.title);
    fireEvent.click(screen.getByTitle("Edit event"));

    expect(await screen.findByRole("heading", { name: "Edit Event" })).toBeVisible();
    expect(screen.getByTestId("event-form")).toHaveTextContent(mockUpcomingEvent.id);
    expect(screen.getByTestId("event-form")).toHaveTextContent(mockUpcomingEvent.title);
    expect(screen.getByTestId("event-form")).toHaveTextContent(mockUpcomingEvent.event_date);
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });
});
