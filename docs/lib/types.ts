export interface Order {
  id: string;
  customer: string;
  lines: ReadonlyArray<Line>;
  placedAt: Date;
}

export interface Line {
  sku: string;
  quantity: number;
  unitPrice: number;
}

export type Currency = "USD" | "CAD" | "EUR";

export type Summary<T extends Order = Order> = {
  order: T;
  total: number;
  items: number;
};
