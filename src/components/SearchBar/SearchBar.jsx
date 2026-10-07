import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function SearchBar({ value, onChange }) {
  return (
    <Input
      allowClear
      placeholder="Buscar por marca o modelo..."
      prefix={<SearchOutlined />}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      style={{ maxWidth: 320 }}
      aria-label="Buscar productos"
    />
  );
}
