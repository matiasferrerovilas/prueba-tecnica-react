import { useState } from "react";
import { App, Button, Select } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useAddToCart } from "@/apis/hooks/useAddToCart";
import "./ProductActions.css";

export default function ProductActions({ product }) {
  const { message } = App.useApp();
  const colors = product.options?.colors ?? [];
  const storages = product.options?.storages ?? [];

  const [colorCode, setColorCode] = useState(colors[0]?.code);
  const [storageCode, setStorageCode] = useState(storages[0]?.code);

  const { mutate, isPending } = useAddToCart();

  const handleAddToCart = () => {
    mutate(
      { id: product.id, colorCode, storageCode },
      {
        onSuccess: () => message.success("Producto añadido a la cesta"),
        onError: () => message.error("No se pudo añadir el producto a la cesta"),
      },
    );
  };

  return (
    <div className="product-actions">
      <div className="product-actions__field">
        <label htmlFor="storage-select">Almacenamiento</label>
        <Select
          id="storage-select"
          value={storageCode}
          onChange={setStorageCode}
          options={storages.map((storage) => ({ value: storage.code, label: storage.name }))}
          style={{ width: "100%" }}
        />
      </div>

      <div className="product-actions__field">
        <label htmlFor="color-select">Color</label>
        <Select
          id="color-select"
          value={colorCode}
          onChange={setColorCode}
          options={colors.map((color) => ({ value: color.code, label: color.name }))}
          style={{ width: "100%" }}
        />
      </div>

      <Button
        type="primary"
        icon={<ShoppingCartOutlined />}
        size="large"
        block
        loading={isPending}
        disabled={colorCode === undefined || storageCode === undefined}
        onClick={handleAddToCart}
      >
        Añadir a la cesta
      </Button>
    </div>
  );
}
