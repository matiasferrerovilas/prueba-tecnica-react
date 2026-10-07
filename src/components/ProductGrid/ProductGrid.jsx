import { Col, Row } from "antd";
import ProductCard from "@/components/ProductCard/ProductCard";

export default function ProductGrid({ products }) {
  return (
    <Row gutter={[16, 16]}>
      {products.map((product) => (
        <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
}
