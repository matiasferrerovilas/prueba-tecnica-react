import { Alert, Col, Row, Skeleton } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useParams } from "@tanstack/react-router";
import { useProduct } from "@/apis/hooks/useProducts";
import ProductImage from "@/components/ProductImage/ProductImage";
import ProductDescription from "@/components/ProductDescription/ProductDescription";
import ProductActions from "@/components/ProductActions/ProductActions";
import "./ProductDetailPage.css";

export default function ProductDetailPage() {
  const { productId } = useParams({ from: "/product/$productId" });
  const { data: product, isPending, isError } = useProduct(productId);

  return (
    <section className="product-detail-page">
      <Link to="/" className="product-detail-page__back">
        <ArrowLeftOutlined /> Volver al listado
      </Link>

      {isPending && <Skeleton active paragraph={{ rows: 8 }} />}

      {isError && (
        <Alert
          type="error"
          message="No se pudo cargar el producto"
          description="Intentá volver al listado y entrar de nuevo."
          showIcon
        />
      )}

      {!isPending && !isError && product && (
        <Row gutter={[32, 32]} className="product-detail-page__content">
          <Col xs={24} md={10}>
            <ProductImage product={product} />
          </Col>
          <Col xs={24} md={14}>
            <ProductDescription product={product} />
            <ProductActions product={product} />
          </Col>
        </Row>
      )}
    </section>
  );
}
