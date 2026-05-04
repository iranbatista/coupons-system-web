import type { ApplyCouponResponse, Coupon, CreateCouponData } from "@/types";
import { api } from "./api";

export const couponService = {
  async getAll(): Promise<Coupon[]> {
    const { data } = await api.get<Coupon[]>("/coupons");
    return data;
  },

  async apply(code: string, cartTotal: number): Promise<ApplyCouponResponse> {
    const { data } = await api.post<ApplyCouponResponse>("/coupons/apply", {
      code,
      cartTotal,
    });
    return data;
  },
  async create(data: CreateCouponData): Promise<Coupon> {
    const { data: response } = await api.post<Coupon>("/coupons", data);
    return response;
  },
};
