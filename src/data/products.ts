import type { CartItem } from "@/types";

export const products: Omit<CartItem, "quantity">[] = [
  {
    id: "1",
    name: "Tênis Runner Pro",
    price: 299.9,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  },
  {
    id: "2",
    name: "Camiseta Essentials",
    price: 89.9,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
  },
  {
    id: "3",
    name: "Mochila Urban",
    price: 199.9,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
  },
  {
    id: "4",
    name: "Boné Classic",
    price: 69.9,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80",
  },
  {
    id: "5",
    name: "Óculos Street",
    price: 159.9,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
  },
  {
    id: "6",
    name: "Relógio Minimal",
    price: 449.9,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  },
];
