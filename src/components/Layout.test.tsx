import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";

// Mocks for child components
jest.mock("./Header", () => () => <div data-testid="header">Header</div>);
jest.mock("./Footer", () => () => <div data-testid="footer">Footer</div>);
describe("Layout", () => {
  it("renders the shared Header and Footer around public content", () => {
    render(
      <MemoryRouter
        initialEntries={["/"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
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
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("uses the same shared shell for members content", () => {
    render(
      <MemoryRouter
        initialEntries={["/members"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
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
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByText("Members Content")).toBeInTheDocument();
  });

  it("renders children inside main", () => {
    render(
      <MemoryRouter
        initialEntries={["/"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
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
