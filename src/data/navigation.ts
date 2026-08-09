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
  Record<"shop" | "care" | "about", readonly FooterItem[]>
> = {
  shop: primaryNavigation,
  care: [
    { label: "Contact" },
    { label: "Shipping" },
    { label: "Returns & Exchanges" },
    { label: "FAQ" },
  ],
  about: [
    { label: "Our Story" },
    { label: "Instagram" },
    { label: "Facebook" },
  ],
};
