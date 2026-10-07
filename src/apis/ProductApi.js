import { api } from "@/apis/axios";

export const getProducts = () => api.get("/api/product").then((response) => response.data);

export const getProductById = (id) =>
  api.get(`/api/product/${id}`).then((response) => response.data);
