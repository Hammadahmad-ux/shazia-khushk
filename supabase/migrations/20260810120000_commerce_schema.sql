-- Core commerce schema: products, variants, media, inventory, customers,
-- addresses, orders, order_items, payments.
--
-- Kept deliberately small and flat for a small catalog: no category or
-- variant-option tables, no multi-tenant concerns, no soft-delete layer.
-- Category-specific product facts (fabric, scent notes, ingredients, ...)
-- are not modeled here yet; they can be added later without touching the
-- order-creation path, which only needs slug, title, price, and stock.

create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- PRODUCTS -------------------------------------------------------------

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null check (category in ('clothing', 'fragrance', 'beauty-hair-care')),
  subcategory text,
  description text,
  active boolean not null default false,
  featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column products.active is
  'Must be true, with an active priced variant and available stock, before a product is purchasable. Defaults to false so imported/incomplete records stay unpurchasable.';

create trigger products_set_updated_at
before update on products
for each row execute function set_updated_at();

create index products_category_idx on products (category) where active;

-- PRODUCT VARIANTS -------------------------------------------------------

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  sku text not null unique,
  variant_label text,
  size text,
  color text,
  volume text,
  price_minor integer check (price_minor is null or price_minor >= 0),
  compare_at_price_minor integer check (compare_at_price_minor is null or compare_at_price_minor >= 0),
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, variant_label)
);

comment on column product_variants.variant_label is
  'Must match the label the storefront generates from selected options (e.g. "Ivory / M"), or be NULL for a single-variant product. Used to resolve a cart line (product slug + label) back to an authoritative variant without trusting a client-supplied variant id.';

comment on column product_variants.price_minor is
  'Integer minor currency units (paisa). NULL means the price is not confirmed yet -- such a variant must never be purchasable, regardless of the active flag.';

create trigger product_variants_set_updated_at
before update on product_variants
for each row execute function set_updated_at();

create index product_variants_product_id_idx on product_variants (product_id);

-- PRODUCT MEDIA ----------------------------------------------------------

create table product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  variant_id uuid references product_variants (id) on delete cascade,
  url text not null,
  alt text not null default '',
  role text not null default 'gallery' check (role in ('primary', 'gallery', 'hover', 'detail')),
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index product_media_product_id_idx on product_media (product_id);

-- INVENTORY ----------------------------------------------------------

create table inventory (
  variant_id uuid primary key references product_variants (id) on delete cascade,
  quantity_available integer not null default 0 check (quantity_available >= 0),
  quantity_reserved integer not null default 0 check (quantity_reserved >= 0),
  low_stock_threshold integer,
  updated_at timestamptz not null default now()
);

create trigger inventory_set_updated_at
before update on inventory
for each row execute function set_updated_at();

-- CUSTOMERS ----------------------------------------------------------

create table customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  mobile text not null,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table customers is
  'Guest checkout only -- one row is inserted per order for now. No account/auth linkage or anonymous-to-account merge logic yet; add that only when accounts are introduced.';

create trigger customers_set_updated_at
before update on customers
for each row execute function set_updated_at();

create index customers_mobile_idx on customers (mobile);

-- ADDRESSES ----------------------------------------------------------

create table addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id) on delete cascade,
  address_line text not null,
  apartment text,
  city text not null,
  province text,
  postal_code text,
  country text not null default 'PK',
  created_at timestamptz not null default now()
);

create index addresses_customer_id_idx on addresses (customer_id);

-- ORDERS ----------------------------------------------------------

create sequence order_number_seq start 1000;

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  confirmation_token text not null unique,
  idempotency_key text unique,
  customer_id uuid references customers (id),
  address_id uuid references addresses (id),
  -- Snapshots below: order history must never change if the customer or
  -- catalog record it was created from later changes.
  contact_full_name text not null,
  contact_mobile text not null,
  contact_email text,
  shipping_address jsonb not null,
  subtotal_minor integer not null check (subtotal_minor >= 0),
  shipping_minor integer not null default 0 check (shipping_minor >= 0),
  shipping_status text not null default 'unresolved' check (shipping_status in ('unresolved', 'flat_rate')),
  total_minor integer not null check (total_minor >= 0),
  currency text not null default 'PKR',
  payment_method text not null check (payment_method in ('cash_on_delivery', 'online')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  fulfillment_status text not null default 'unfulfilled' check (fulfillment_status in ('unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled')),
  customer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column orders.shipping_status is
  'unresolved = courier/shipping pricing is not confirmed yet, shipping_minor is a 0 placeholder, not a "free shipping" promise. flat_rate = a configured flat amount was applied.';

comment on column orders.confirmation_token is
  'High-entropy opaque token required alongside order_number to view /order-confirmation. Prevents guessing a confirmation page by incrementing the (sequential, human-readable) order number.';

create trigger orders_set_updated_at
before update on orders
for each row execute function set_updated_at();

create index orders_customer_id_idx on orders (customer_id);
create index orders_created_at_idx on orders (created_at desc);

-- ORDER ITEMS (immutable snapshots) ----------------------------------

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  variant_id uuid references product_variants (id) on delete set null,
  product_title text not null,
  sku text not null,
  variant_label text,
  unit_price_minor integer not null check (unit_price_minor >= 0),
  quantity integer not null check (quantity > 0),
  line_total_minor integer not null check (line_total_minor >= 0),
  created_at timestamptz not null default now()
);

create index order_items_order_id_idx on order_items (order_id);

-- PAYMENTS ----------------------------------------------------------

create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  method text not null check (method in ('cash_on_delivery', 'online')),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  amount_minor integer not null check (amount_minor >= 0),
  provider text,
  provider_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table payments is
  'provider/provider_reference stay NULL for cash_on_delivery. They exist so a future online-payment adapter can attach its own attempt/transaction reference without a schema change.';

create trigger payments_set_updated_at
before update on payments
for each row execute function set_updated_at();

create index payments_order_id_idx on payments (order_id);
