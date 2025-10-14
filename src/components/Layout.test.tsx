import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";

// Mocks for child components
jest.mock("./Header", () => () => <div data-testid="header">Header</div>);
jest.mock("./Footer", () => () => <div data-testid="footer">Footer</div>);
jest.mock("./MembersHeader", () => () => (
  <div data-testid="members-header">MembersHeader</div>
));
jest.mock("./SkipLink", () => () => (
  <div data-testid="skip-link">SkipLink</div>
));
jest.mock("./CookieConsent", () => () => (
  <div data-testid="cookie-consent">CookieConsent</div>
));
jest.mock("./Toast", () => ({ type, message, onClose }: any) => (
  <div data-testid="toast">Toast: {message}</div>
));
jest.mock("../hooks/useToast", () => ({
  useToast: () => ({ toasts: [], removeToast: jest.fn() }),
}));

describe("Layout", () => {
  it("renders Header, Footer, SkipLink, CookieConsent for non-members route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <div>Content</div>
              </Layout>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByTestId("skip-link")).toBeInTheDocument();
    expect(screen.getByTestId("cookie-consent")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders MembersHeader for /members route", () => {
    render(
      <MemoryRouter initialEntries={["/members"]}>
        <Routes>
          <Route
            path="/members"
            element={
              <Layout>
                <div>Members Content</div>
              </Layout>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId("members-header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByTestId("skip-link")).toBeInTheDocument();
    expect(screen.getByTestId("cookie-consent")).toBeInTheDocument();
    expect(screen.getByText("Members Content")).toBeInTheDocument();
  });

  it("renders children inside main", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <span>Child Element</span>
              </Layout>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("Child Element")).toBeInTheDocument();
    const main = screen.getByRole("main");
    expect(main).toContainElement(screen.getByText("Child Element"));
  });
});

describe("Layout Toasts", () => {
  beforeAll(() => {
    jest.resetModules();
    jest.mock("../hooks/useToast", () => ({
      useToast: () => ({
        toasts: [{ id: 1, type: "info", message: "Test Toast" }],
        removeToast: jest.fn(),
      }),
    }));
  });
  afterAll(() => {
    jest.resetModules();
  });
  it.skip("renders Toasts when present", () => {
    const LayoutWithToast = require("./Layout").default;
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <LayoutWithToast>
                <div>Content</div>
              </LayoutWithToast>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId("toast")).toBeInTheDocument();
    expect(screen.getByText(/Test Toast/)).toBeInTheDocument();
  });
});
