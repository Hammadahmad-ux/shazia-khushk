import type { Currency } from "@/types/product";

const currencyFormatters = new Map<Currency, Intl.NumberFormat>();

export function formatMoney(priceMinor: number, currency: Currency = "PKR") {
  const formatter =
    currencyFormatters.get(currency) ??
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });

  currencyFormatters.set(currency, formatter);

  return formatter.format(priceMinor / 100);
}
