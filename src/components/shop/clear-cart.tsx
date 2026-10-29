"use client";

import { useEffect } from "react";
import { cart } from "./cart-store";

/** Ödeme başarı sayfasında sepeti boşaltır. */
export function ClearCart() {
  useEffect(() => cart.clear(), []);
  return null;
}
