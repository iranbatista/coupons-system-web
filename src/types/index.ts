export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface CouponRule {
  id: string;
  type: string;
  config: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "FIXED" | "PERCENTAGE";
  discountValue: number;
  isActive: boolean;
  rules: CouponRule[];
}

export interface ApplyCouponResponse {
  code: string;
  discountType: "FIXED" | "PERCENTAGE";
  discountValue: number;
  originalTotal: number;
  discount: number;
  finalTotal: number;
}

export interface CreateCouponRuleData {
  type: string;
  config: Record<string, unknown>;
}

export interface CreateCouponData {
  code: string;
  discountType: "FIXED" | "PERCENTAGE";
  discountValue: number;
  rules: CreateCouponRuleData[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
