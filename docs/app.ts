import type { Order } from "./lib/types.ts";
import { Ledger, money, summarize } from "./lib/format.ts";

const orders = [
  {
    id: "A-1042",
    customer: "Juniper & Vale",
    placedAt: new Date("2026-11-05T09:12:00"),
    lines: [
      { sku: "MUG-OAT", quantity: 4, unitPrice: 18 },
      { sku: "TEA-SMOKE", quantity: 2, unitPrice: 24.5 }
    ]
  },
  {
    id: "A-1043",
    customer: "Northfold Studio",
    placedAt: new Date("2026-11-05T11:40:00"),
    lines: [{ sku: "LAMP-BRASS", quantity: 1, unitPrice: 189 }]
  }
] satisfies Order[];

const ledger = new Ledger();
for (const order of orders) ledger.add(summarize(order));

const output = document.querySelector<HTMLElement>("[data-output]")!;
output.textContent = `${ledger.size} orders · ${money(ledger.grandTotal)} total · computed by app.ts`;

export const loaded: boolean = true;
