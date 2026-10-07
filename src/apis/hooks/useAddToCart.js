import { useMutation } from "@tanstack/react-query";
import { addToCart } from "@/apis/CartApi";
import { useCart } from "@/apis/cart/CartContext";

export const useAddToCart = () => {
  const { setCount } = useCart();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      setCount(data.count);
    },
  });
};
