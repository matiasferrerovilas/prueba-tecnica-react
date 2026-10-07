import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider } from "@/apis/cart/CartProvider";
import { useCart } from "@/apis/cart/CartContext";

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

beforeEach(() => {
  window.localStorage.clear();
});

describe("CartProvider / useCart", () => {
  it("starts at 0 when there is nothing stored", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.count).toBe(0);
  });

  it("reads the initial count from localStorage", () => {
    window.localStorage.setItem("cartCount", "3");
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.count).toBe(3);
  });

  it("updates the count and persists it to localStorage", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.setCount(5);
    });

    expect(result.current.count).toBe(5);
    expect(window.localStorage.getItem("cartCount")).toBe("5");
  });

  it("throws when used outside of a CartProvider", () => {
    const { result } = renderHook(() => {
      try {
        return useCart();
      } catch (error) {
        return error;
      }
    });

    expect(result.current).toBeInstanceOf(Error);
  });
});
