import { Card } from "antd";
import { Link } from "@tanstack/react-router";
import "./ProductCard.css";

const formatPrice = (price) => (price ? `${price} €` : "Precio no disponible");

export default function ProductCard({ product }) {
  return (
    <Link to="/product/$productId" params={{ productId: product.id }} className="product-card-link">
      <Card
        hoverable
        className="product-card"
        cover={<img src={product.imgUrl} alt={`${product.brand} ${product.model}`} />}
      >
        <p className="product-card__brand">{product.brand}</p>
        <p className="product-card__model">{product.model}</p>
        <p className="product-card__price">{formatPrice(product.price)}</p>
      </Card>
    </Link>
  );
}
