import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { App as AntdApp, ConfigProvider } from "antd";
import { CartProvider } from "@/apis/cart/CartProvider";
import { routeTree } from "@/router";

export function makeTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

export function renderApp({ initialEntry = "/", queryClient = makeTestQueryClient() } = {}) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialEntry] }),
    context: { queryClient },
  });

  const utils = render(
    <ConfigProvider>
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>,
  );

  return { ...utils, router, queryClient };
}
