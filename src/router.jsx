import { createRootRoute, createRoute, createRouter, Link, Outlet } from "@tanstack/react-router";
import { Result } from "antd";
import Header from "@/components/Header/Header";
import ProductListPage from "@/pages/ProductListPage/ProductListPage";
import ProductDetailPage from "@/pages/ProductDetailPage/ProductDetailPage";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
    </>
  ),
  notFoundComponent: () => (
    <Result
      status="404"
      title="Página no encontrada"
      extra={<Link to="/">Volver al listado</Link>}
    />
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ProductListPage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$productId",
  component: ProductDetailPage,
});

export const routeTree = rootRoute.addChildren([indexRoute, productDetailRoute]);

export const router = createRouter({ routeTree });
