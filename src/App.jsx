import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { App as AntdApp, ConfigProvider } from "antd";
import esES from "antd/locale/es_ES";
import { CartProvider } from "@/apis/cart/CartProvider";
import { router } from "@/router";

const ONE_HOUR_MS = 60 * 60 * 1000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: ONE_HOUR_MS,
      gcTime: ONE_HOUR_MS * 2,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <ConfigProvider locale={esES} theme={{ token: { borderRadius: 8 } }}>
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
