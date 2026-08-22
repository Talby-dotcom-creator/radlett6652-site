import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EventDetailsModal from "./EventDetailsModal";

describe("EventDetailsModal", () => {
  it("clearly labels a publicly listed members-only meeting", () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <EventDetailsModal
          isOpen
          onClose={jest.fn()}
          event={{
            id: "public-members-only-event",
            title: "Radlett Lodge Regular Meeting",
            description: "A regular Lodge meeting.",
            event_date: "2099-09-05T15:00:00Z",
            location: "Radlett Masonic Centre",
            is_public: true,
            is_members_only: true,
            is_past_event: false,
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Members Only")).toBeInTheDocument();
    expect(
      screen.getByText(/restricted to Lodge members and their guests only/i)
    ).toBeInTheDocument();
  });
});
