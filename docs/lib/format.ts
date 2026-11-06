import type { Currency, Order, Summary } from "./types.ts";

const formatters = new Map<Currency, Intl.NumberFormat>();

export function money(amount: number, currency: Currency = "USD"): string {
  let formatter = formatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", { style: "currency", currency });
    formatters.set(currency, formatter);
  }
  return formatter.format(amount);
}

export function summarize<T extends Order>(order: T): Summary<T> {
  const total = order.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  const items = order.lines.reduce((count, line) => count + line.quantity, 0);
  return { order, total, items };
}

export class Ledger {
  private readonly entries: Summary[] = [];

  add(summary: Summary): this {
    this.entries.push(summary);
    return this;
  }

  get grandTotal(): number {
    return this.entries.reduce((sum, entry) => sum + entry.total, 0);
  }

  get size(): number {
    return this.entries.length;
  }
}
