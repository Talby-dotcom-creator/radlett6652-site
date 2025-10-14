import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactForm from "./ContactForm";

// Mock fetch globally
beforeAll(() => {
  global.fetch = jest.fn();
});
afterAll(() => {
  // @ts-ignore
  global.fetch.mockRestore && global.fetch.mockRestore();
});
afterEach(() => {
  // @ts-ignore
  global.fetch.mockClear && global.fetch.mockClear();
});

describe("ContactForm", () => {
  it("renders all required fields", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/I am interested/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Send Message/i })
    ).toBeInTheDocument();
  });

  it("shows error if required fields are missing", async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: /Send Message/i }));
    // Should not submit, so no success or error message
    await waitFor(() => {
      expect(
        screen.queryByText(/Your message has been sent successfully/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Failed to send message/i)
      ).not.toBeInTheDocument();
    });
  });

  it("submits form and shows success message", async () => {
    // @ts-ignore
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ status: "ok", message: "sent" }),
    });
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(/Your Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Subject/i), {
      target: { value: "general" },
    });
    fireEvent.change(screen.getByLabelText(/Your Message/i), {
      target: { value: "Hello there!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Send Message/i }));
    await waitFor(() =>
      expect(
        screen.getByText(/Your message has been sent successfully/i)
      ).toBeInTheDocument()
    );
  });

  it("shows error message on failed submit", async () => {
    // @ts-ignore
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(/Your Name/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Subject/i), {
      target: { value: "membership" },
    });
    fireEvent.change(screen.getByLabelText(/Your Message/i), {
      target: { value: "Interested in joining." },
    });
    fireEvent.click(screen.getByRole("button", { name: /Send Message/i }));
    await waitFor(() =>
      expect(screen.getByText(/Server error/i)).toBeInTheDocument()
    );
  });

  it("honeypot field prevents submission for bots", async () => {
    render(<ContactForm />);
    const honeypot = screen.getByTestId("honeypot");
    fireEvent.change(honeypot, { target: { value: "bot" } });
    fireEvent.change(screen.getByLabelText(/Your Name/i), {
      target: { value: "Bot" },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "bot@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Subject/i), {
      target: { value: "other" },
    });
    fireEvent.change(screen.getByLabelText(/Your Message/i), {
      target: { value: "Spam!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Send Message/i }));
    // Should not submit, so no success or error message
    await waitFor(() => {
      expect(
        screen.queryByText(/Your message has been sent successfully/i)
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/Server error/i)).not.toBeInTheDocument();
    });
  });
});
