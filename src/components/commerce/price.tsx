import type { Currency } from "@/types/product";
import { formatMoney } from "@/utils/format-money";

interface PriceProps {
  amountMinor: number;
  currency?: Currency;
}

export function Price({ amountMinor, currency = "PKR" }: PriceProps) {
  return <span>{formatMoney(amountMinor, currency)}</span>;
}
