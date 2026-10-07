import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { useProduct, useProducts } from "@/apis/hooks/useProducts";
import { PRODUCTS_QUERY_KEY, productQueryKey } from "@/apis/hooks/productQueryKeys";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const mockProducts = [
  { id: "p1", brand: "Acer", model: "Liquid Z320", price: "90", imgUrl: "p1.jpg" },
  { id: "p2", brand: "Apple", model: "iPhone 11", price: "900", imgUrl: "p2.jpg" },
];

const mockDetail = { ...mockProducts[0], cpu: "Quad-core", ram: "1 GB RAM" };

const server = setupServer(
  http.get(`${API_BASE_URL}/api/product`, () => HttpResponse.json(mockProducts)),
  http.get(`${API_BASE_URL}/api/product/:id`, () => HttpResponse.json(mockDetail)),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  };
}

describe("useProducts", () => {
  it("calls GET /api/product and returns the product list", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockProducts);
  });

  it("uses the correct query key", () => {
    expect(PRODUCTS_QUERY_KEY).toEqual(["products"]);
  });

  it("returns error state when the request fails", async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/product`, () => HttpResponse.json(null, { status: 500 })),
    );

    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useProduct", () => {
  it("calls GET /api/product/:id and returns the product detail", async () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useProduct("p1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockDetail);
  });

  it("uses the correct query key", () => {
    expect(productQueryKey("p1")).toEqual(["products", "p1"]);
  });

  it("does not fetch when no id is provided", () => {
    const { wrapper } = makeWrapper();
    const { result } = renderHook(() => useProduct(undefined), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
  });
});
