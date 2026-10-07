import { Badge, Breadcrumb } from "antd";
import { MobileOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link, useMatches } from "@tanstack/react-router";
import { useProduct } from "@/apis/hooks/useProducts";
import { useCart } from "@/apis/cart/CartContext";
import "./Header.css";

function useBreadcrumbItems() {
  const matches = useMatches();
  const detailMatch = matches.find((match) => match.routeId === "/product/$productId");
  const productId = detailMatch?.params.productId;
  const { data: product } = useProduct(productId);

  const items = [{ title: <Link to="/">Inicio</Link> }];

  if (detailMatch) {
    items.push({
      title: product ? `${product.brand} ${product.model}` : "Detalle del producto",
    });
  }

  return items;
}

export default function Header() {
  const { count } = useCart();
  const items = useBreadcrumbItems();

  return (
    <header className="app-header">
      <div className="app-header__bar">
        <Link to="/" className="app-header__brand">
          <MobileOutlined />
          <span>ITX Store</span>
        </Link>
        <Badge count={count} showZero>
          <ShoppingCartOutlined className="app-header__cart-icon" />
        </Badge>
      </div>
      <Breadcrumb className="app-header__breadcrumb" items={items} />
    </header>
  );
}
