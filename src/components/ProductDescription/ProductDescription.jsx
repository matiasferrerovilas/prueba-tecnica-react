import { Descriptions } from "antd";

const formatPrice = (price) => (price ? `${price} €` : "Precio no disponible");

const formatCameras = (product) => {
  const cameras = [product.primaryCamera, product.secondaryCmera]
    .filter(Boolean)
    .map((camera) => (Array.isArray(camera) ? camera.join(", ") : camera));
  return cameras.length > 0 ? cameras.join(" / ") : "-";
};

export default function ProductDescription({ product }) {
  const items = [
    { key: "brand", label: "Marca", children: product.brand },
    { key: "model", label: "Modelo", children: product.model },
    { key: "price", label: "Precio", children: formatPrice(product.price) },
    { key: "cpu", label: "CPU", children: product.cpu || "-" },
    { key: "ram", label: "RAM", children: product.ram || "-" },
    { key: "os", label: "Sistema Operativo", children: product.os || "-" },
    { key: "displaySize", label: "Resolución de pantalla", children: product.displaySize || "-" },
    { key: "battery", label: "Batería", children: product.battery || "-" },
    { key: "cameras", label: "Cámaras", children: formatCameras(product) },
    { key: "dimentions", label: "Dimensiones", children: product.dimentions || "-" },
    { key: "weight", label: "Peso", children: product.weight ? `${product.weight} g` : "-" },
  ];

  return <Descriptions title="Descripción" column={1} items={items} bordered size="small" />;
}
