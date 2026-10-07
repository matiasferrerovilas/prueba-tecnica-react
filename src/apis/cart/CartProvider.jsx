import { useMemo, useState } from "react";
import { CartContext } from "@/apis/cart/CartContext";

const CART_COUNT_STORAGE_KEY = "cartCount";

const readStoredCount = () => {
  const stored = window.localStorage.getItem(CART_COUNT_STORAGE_KEY);
  const parsed = Number(stored);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function CartProvider({ children }) {
  const [count, setCountState] = useState(readStoredCount);

  const setCount = (nextCount) => {
    setCountState(nextCount);
    window.localStorage.setItem(CART_COUNT_STORAGE_KEY, String(nextCount));
  };

  const value = useMemo(() => ({ count, setCount }), [count]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
