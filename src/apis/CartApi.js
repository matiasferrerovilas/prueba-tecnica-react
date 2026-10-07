import { api } from "@/apis/axios";

export const addToCart = ({ id, colorCode, storageCode }) =>
  api.post("/api/cart", { id, colorCode, storageCode }).then((response) => response.data);
