import { Egg } from './egg';

export type CartItem = {
  egg: Egg;
  quantity: number;
};

export type Order = {
  id: string;
  code: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
};
