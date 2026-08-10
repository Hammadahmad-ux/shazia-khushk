export interface NavigationItem {
  label: string;
  href: string;
}

export interface FooterItem {
  label: string;
  href?: string;
}

export const primaryNavigation: readonly NavigationItem[] = [
  { label: "Shop", href: "/shop" },
  { label: "Clothing", href: "/collections/clothing" },
  { label: "Fragrance", href: "/collections/fragrance" },
  { label: "Beauty & Hair Care", href: "/collections/beauty-hair-care" },
];

export const footerNavigation: Readonly<
  Record<"shop" | "care" | "legal", readonly FooterItem[]>
> = {
  shop: primaryNavigation,
  care: [
    { label: "Contact", href: "/contact" },
    { label: "Shipping & Returns", href: "/shipping-returns" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};
