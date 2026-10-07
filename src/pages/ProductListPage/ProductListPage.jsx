import { useMemo, useState } from "react";
import { Alert, Empty, Pagination, Skeleton, Typography } from "antd";
import { useProducts } from "@/apis/hooks/useProducts";
import SearchBar from "@/components/SearchBar/SearchBar";
import ProductGrid from "@/components/ProductGrid/ProductGrid";
import "./ProductListPage.css";

const PAGE_SIZE = 50;

export default function ProductListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageResetKey, setPageResetKey] = useState(searchTerm);
  const { data: products, isPending, isError } = useProducts();

  if (searchTerm !== pageResetKey) {
    setPageResetKey(searchTerm);
    setCurrentPage(1);
  }

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const normalizedTerm = searchTerm.trim().toLowerCase();
    if (!normalizedTerm) return products;
    return products.filter((product) =>
      `${product.brand} ${product.model}`.toLowerCase().includes(normalizedTerm),
    );
  }, [products, searchTerm]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  return (
    <section className="product-list-page">
      <div className="product-list-page__toolbar">
        <Typography.Title level={4} style={{ margin: 0 }}>
          Listado de productos
        </Typography.Title>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      {isPending && <Skeleton active paragraph={{ rows: 6 }} />}

      {isError && (
        <Alert
          type="error"
          message="No se pudieron cargar los productos"
          description="Intentá recargar la página en unos segundos."
          showIcon
        />
      )}

      {!isPending && !isError && filteredProducts.length === 0 && (
        <Empty description="No se encontraron productos" />
      )}

      {!isPending && !isError && filteredProducts.length > 0 && (
        <>
          <ProductGrid products={paginatedProducts} />
          <div className="product-list-page__pagination">
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={filteredProducts.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </section>
  );
}
