-- Fix create_order() so order placement works on the live Supabase project.
--
-- Root cause: the confirmation token was generated with
-- gen_random_bytes(24) from pgcrypto. That extension installs into the
-- `extensions` schema on Supabase, but this function sets
-- `search_path = public`, so the call failed at runtime with
-- "function gen_random_bytes(integer) does not exist" -- which aborted
-- every order creation after the inserts, returning a generic
-- "We couldn't place your order" error.
--
-- Fix: build the token from two core gen_random_uuid() values (always
-- available via pg_catalog regardless of search_path). 64 hex chars =
-- 256 bits of entropy, >= the 192 bits the old token provided, and the
-- token stays opaque/unguessable. Everything else about create_order
-- is unchanged: same idempotency short-circuit, same atomic inserts,
-- same conditional inventory decrement, same revoke/grant.

create or replace function create_order(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing_order_number text;
  v_existing_token text;
  v_idempotency_key text := payload ->> 'idempotency_key';
  v_customer_id uuid;
  v_address_id uuid;
  v_order_id uuid;
  v_order_number text;
  v_confirmation_token text;
  v_item jsonb;
  v_updated_rows int;
begin
  if v_idempotency_key is not null then
    select order_number, confirmation_token
      into v_existing_order_number, v_existing_token
      from orders
      where idempotency_key = v_idempotency_key;

    if found then
      return jsonb_build_object(
        'order_number', v_existing_order_number,
        'confirmation_token', v_existing_token
      );
    end if;
  end if;

  insert into customers (full_name, mobile, email)
  values (
    payload -> 'contact' ->> 'full_name',
    payload -> 'contact' ->> 'mobile',
    payload -> 'contact' ->> 'email'
  )
  returning id into v_customer_id;

  insert into addresses (customer_id, address_line, apartment, city, province, postal_code)
  values (
    v_customer_id,
    payload -> 'address' ->> 'address_line',
    payload -> 'address' ->> 'apartment',
    payload -> 'address' ->> 'city',
    payload -> 'address' ->> 'province',
    payload -> 'address' ->> 'postal_code'
  )
  returning id into v_address_id;

  v_order_number := 'SK-' || lpad(nextval('order_number_seq')::text, 6, '0');
  v_confirmation_token := replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');

  insert into orders (
    order_number, confirmation_token, idempotency_key, customer_id, address_id,
    contact_full_name, contact_mobile, contact_email, shipping_address,
    subtotal_minor, shipping_minor, shipping_status, total_minor, currency,
    payment_method
  )
  values (
    v_order_number, v_confirmation_token, v_idempotency_key, v_customer_id, v_address_id,
    payload -> 'contact' ->> 'full_name',
    payload -> 'contact' ->> 'mobile',
    payload -> 'contact' ->> 'email',
    payload -> 'address',
    (payload ->> 'subtotal_minor')::int,
    (payload ->> 'shipping_minor')::int,
    payload ->> 'shipping_status',
    (payload ->> 'total_minor')::int,
    payload ->> 'currency',
    payload ->> 'payment_method'
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(payload -> 'items')
  loop
    update inventory
      set quantity_available = quantity_available - (v_item ->> 'quantity')::int
      where variant_id = (v_item ->> 'variant_id')::uuid
        and quantity_available >= (v_item ->> 'quantity')::int;

    get diagnostics v_updated_rows = row_count;

    if v_updated_rows = 0 then
      raise exception 'insufficient_stock: %', v_item ->> 'sku';
    end if;

    insert into order_items (
      order_id, product_id, variant_id, product_title, sku, variant_label,
      unit_price_minor, quantity, line_total_minor
    )
    values (
      v_order_id,
      (v_item ->> 'product_id')::uuid,
      (v_item ->> 'variant_id')::uuid,
      v_item ->> 'product_title',
      v_item ->> 'sku',
      v_item ->> 'variant_label',
      (v_item ->> 'unit_price_minor')::int,
      (v_item ->> 'quantity')::int,
      (v_item ->> 'line_total_minor')::int
    );
  end loop;

  insert into payments (order_id, method, status, amount_minor)
  values (
    v_order_id,
    payload ->> 'payment_method',
    'pending',
    (payload ->> 'total_minor')::int
  );

  return jsonb_build_object(
    'order_number', v_order_number,
    'confirmation_token', v_confirmation_token
  );
end;
$$;

revoke execute on function create_order(jsonb) from public, anon, authenticated;
grant execute on function create_order(jsonb) to service_role;
