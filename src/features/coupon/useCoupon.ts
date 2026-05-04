import { useState } from "react";
import type { ApplyCouponResponse } from "@/types";
import { couponService } from "@/services/coupon.service";

export function useCoupon() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<ApplyCouponResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function applyCoupon(cartTotal: number) {
    if (!code.trim()) return;
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const data = await couponService.apply(code, cartTotal);
      setResult(data);
    } catch (e: unknown) {
      const message = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(message ?? "Cupom inválido.");
    } finally {
      setLoading(false);
    }
  }

  function clearCoupon() {
    setCode("");
    setResult(null);
    setError("");
  }

  return { code, setCode, result, error, loading, applyCoupon, clearCoupon };
}
