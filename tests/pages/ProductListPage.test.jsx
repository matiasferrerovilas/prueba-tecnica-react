import { describe, it, expect, beforeAll, beforeEach, afterEach, afterAll } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { renderApp } from "../testUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const mockProducts = [
  { id: "p1", brand: "Acer", model: "Liquid Z320", price: "90", imgUrl: "p1.jpg" },
  { id: "p2", brand: "Apple", model: "iPhone 11", price: "900", imgUrl: "p2.jpg" },
];

const server = setupServer(
  http.get(`${API_BASE_URL}/api/product`, () => HttpResponse.json(mockProducts)),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ProductListPage", () => {
  it("renders every product returned by the API", async () => {
    renderApp({ initialEntry: "/" });

    expect(await screen.findByText("Liquid Z320")).toBeInTheDocument();
    expect(screen.getByText("iPhone 11")).toBeInTheDocument();
  });

  it("filters the list in real time by brand or model", async () => {
    const user = userEvent.setup();
    renderApp({ initialEntry: "/" });

    await screen.findByText("Liquid Z320");

    const searchInput = screen.getByRole("textbox", { name: /buscar productos/i });
    await user.type(searchInput, "apple");

    expect(screen.queryByText("Liquid Z320")).not.toBeInTheDocument();
    expect(screen.getByText("iPhone 11")).toBeInTheDocument();
  });

  it("shows an empty state when no product matches the search", async () => {
    const user = userEvent.setup();
    renderApp({ initialEntry: "/" });

    await screen.findByText("Liquid Z320");

    const searchInput = screen.getByRole("textbox", { name: /buscar productos/i });
    await user.type(searchInput, "nokia");

    await waitFor(() =>
      expect(screen.getByText(/no se encontraron productos/i)).toBeInTheDocument(),
    );
  });
});

describe("ProductListPage pagination", () => {
  const manyProducts = Array.from({ length: 60 }, (_, index) => ({
    id: `p${index}`,
    brand: "Brand",
    model: `Model ${index}`,
    price: "100",
    imgUrl: `p${index}.jpg`,
  }));

  beforeEach(() => {
    server.use(http.get(`${API_BASE_URL}/api/product`, () => HttpResponse.json(manyProducts)));
  });

  it("shows only the first page of results", async () => {
    renderApp({ initialEntry: "/" });

    await screen.findByText("Model 0");

    expect(screen.getByText("Model 49")).toBeInTheDocument();
    expect(screen.queryByText("Model 50")).not.toBeInTheDocument();
  });

  it("navigates to the next page", async () => {
    const user = userEvent.setup();
    renderApp({ initialEntry: "/" });

    await screen.findByText("Model 0");

    await user.click(screen.getByTitle("2"));

    expect(await screen.findByText("Model 50")).toBeInTheDocument();
    expect(screen.queryByText("Model 0")).not.toBeInTheDocument();
  });

  it("resets to the first page when the search term changes", async () => {
    const user = userEvent.setup();
    renderApp({ initialEntry: "/" });

    await screen.findByText("Model 0");
    await user.click(screen.getByTitle("2"));
    await screen.findByText("Model 50");

    const searchInput = screen.getByRole("textbox", { name: /buscar productos/i });
    await user.type(searchInput, "model");

    expect(await screen.findByText("Model 0")).toBeInTheDocument();
  });
});
