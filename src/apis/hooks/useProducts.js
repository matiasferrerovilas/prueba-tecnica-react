import { useQuery } from "@tanstack/react-query";
import { getProductById, getProducts } from "@/apis/ProductApi";
import { PRODUCTS_QUERY_KEY, productQueryKey } from "@/apis/hooks/productQueryKeys";

export const useProducts = () =>
  useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: getProducts,
  });

export const useProduct = (id) =>
  useQuery({
    queryKey: productQueryKey(id),
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });
