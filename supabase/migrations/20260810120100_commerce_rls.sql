-- Row Level Security for the commerce schema.
--
-- Only the service_role key (used exclusively from server-only code --
-- Server Actions and Server Components, never shipped to the browser)
-- can write to any table here, because service_role bypasses RLS.
-- Anonymous/authenticated roles get a narrow, explicit, read-only view
-- of published catalog data and NO access at all to inventory counts,
-- customers, addresses, orders, order_items, or payments.
--
-- This is what guarantees a customer can never modify a price, alter
-- inventory, change an order total, or flip a payment/fulfillment
-- status from the browser: those tables simply have no policy granting
-- anon/authenticated any access, and RLS defaults to deny.

alter table products enable row level security;
alter table product_variants enable row level security;
alter table product_media enable row level security;
alter table inventory enable row level security;
alter table customers enable row level security;
alter table addresses enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payments enable row level security;

-- Public, read-only catalog browsing of published products/variants.
-- The storefront does not call Supabase for catalog reads yet (it still
-- renders from static fixtures pending confirmed client data), but this
-- is safe and correct to enable now for when that changes.

create policy "Public can read active products"
on products for select
to anon, authenticated
using (active);

create policy "Public can read active variants of active products"
on product_variants for select
to anon, authenticated
using (
  active
  and exists (
    select 1 from products
    where products.id = product_variants.product_id
      and products.active
  )
);

create policy "Public can read media of active products"
on product_media for select
to anon, authenticated
using (
  exists (
    select 1 from products
    where products.id = product_media.product_id
      and products.active
  )
);

-- inventory, customers, addresses, orders, order_items, payments:
-- RLS is enabled above with NO policy defined for anon/authenticated on
-- any of them, which denies all access by default. Only service_role
-- (server-only) can read or write these tables.
