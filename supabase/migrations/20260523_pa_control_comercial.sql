-- =====================================================================
-- PAESAGGIO · Sistema comercial integrado
-- Migración aditiva para Supabase/Postgres.
-- No borra ni modifica tablas existentes: usa prefijo pa_.
-- Ejecutar en Supabase SQL Editor.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------
do $$ begin
  create type pa_user_role as enum ('admin', 'operador', 'vendedor', 'aliado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type pa_partner_type as enum ('pet_shop', 'corralon', 'vivero', 'ferreteria', 'arquitecto', 'paisajista', 'comercio', 'cliente');
exception when duplicate_object then null; end $$;

do $$ begin
  create type pa_consignment_status as enum ('borrador', 'preparando', 'en_reparto', 'entregada', 'recibida', 'en_venta', 'rendicion_parcial', 'rendida', 'cerrada', 'observada');
exception when duplicate_object then null; end $$;

do $$ begin
  create type pa_payment_status as enum ('pendiente', 'comprobante_recibido', 'confirmado', 'observado', 'rechazado', 'conciliado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type pa_commission_status as enum ('pendiente', 'aprobada', 'pagada', 'anulada');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- Usuarios internos simples para backoffice propio.
-- No depende de Supabase Auth. La app usa cookie firmada + service role server-side.
-- ---------------------------------------------------------------------
create table if not exists public.pa_app_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null,
  role pa_user_role not null default 'operador',
  password_hash text not null,
  commission_rate numeric(8,2) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Usuario admin inicial. Cambiar contraseña después de entrar.
insert into public.pa_app_users (email, full_name, role, password_hash, active)
values (
  'admin@paesaggio.local',
  'Admin Paesaggio',
  'admin',
  'scrypt$16384$8$1$6c7281ea2be15b5963a82eacaf0ea023$923c757b706fe4f566a8b527eecce3fb103c68603b6eee9ee09417ece4ee3ff22aef0b17a418f8f6c5a08f9e2c96ef7c71e0b348647071ce4e2aaac41fbf1256',
  true
)
on conflict (email) do update set
  full_name = excluded.full_name,
  role = excluded.role,
  active = true,
  updated_at = now();

-- ---------------------------------------------------------------------
-- Productos y stock
-- ---------------------------------------------------------------------
create table if not exists public.pa_products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  category text not null,
  presentation text not null,
  retail_price numeric(14,2) not null default 0,
  wholesale_price numeric(14,2) not null default 0,
  consignment_render_price numeric(14,2) not null default 0,
  cost_price numeric(14,2) not null default 0,
  stock_owned integer not null default 0,
  stock_reserved integer not null default 0,
  stock_consigned integer not null default 0,
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pa_products_category_idx on public.pa_products (category);
create index if not exists pa_products_active_idx on public.pa_products (active);

-- Seed inicial basado en la lista minorista/mayorista conversada.
-- consignment_render_price = valor unitario que debe rendir el local.
insert into public.pa_products (sku, name, category, presentation, retail_price, wholesale_price, consignment_render_price, stock_owned, active) values
('ARB-BRACH-10L', 'Brachichito', 'Árboles / Arbustos', '10L / 1.5 mts', 15700, 9500, 12000, 0, true),
('ARB-FRES-AUR-68', 'Fresno Áureo', 'Árboles / Arbustos', '6/8 cm', 46000, 28000, 36000, 0, true),
('ARB-FRES-RED-68', 'Fresno Redwood', 'Árboles / Arbustos', '6/8 cm', 46000, 28000, 36000, 0, true),
('ARB-JUN-NANA-10L', 'Juniperus Procumbens Nana', 'Árboles / Arbustos', '10L', 29500, 18000, 23000, 0, true),
('ARB-LAUR-10L', 'Laurentino', 'Árboles / Arbustos', '10L / 1 mt', 23000, 14000, 18000, 0, true),
('ARB-LEY-10L', 'Leylandii Pino', 'Árboles / Arbustos', '10L', 25000, 18000, 20000, 0, true),
('ARB-OLEA-8L', 'Olea Europea', 'Árboles / Arbustos', '8L', 25000, 18000, 20000, 0, true),
('ARB-PRUN-15L', 'Prunus Trailblazer', 'Árboles / Arbustos', '15L', 40000, 28000, 32000, 0, true),
('ARB-LIM-7L', 'Limonero con limones', 'Árboles / Arbustos', '7L', 30000, 20000, 24000, 0, true),
('JAR-AGAP', 'Agapanthus Africanus', 'Plantas de jardín', '-', 8000, 4800, 6200, 0, true),
('JAR-BUX-COMP-4L', 'Buxus Compacto', 'Plantas de jardín', '4L', 14900, 9000, 11500, 0, true),
('JAR-BUX-SEMP-4L', 'Buxus Sempervirens', 'Plantas de jardín', '4L', 13500, 8500, 10500, 0, true),
('JAR-LAV-3L', 'Lavanda', 'Plantas de jardín', '3L', 6000, 3500, 4500, 0, true),
('JAR-DYM-M12', 'Dymondia', 'Plantas de jardín', 'M12', 2500, 1500, 1900, 0, true),
('JAR-GAURA-3L', 'Gaura Rosada', 'Plantas de jardín', '3L', 6300, 3800, 4800, 0, true),
('JAR-JAZ-LECHE-4L', 'Jazmín de Leche', 'Plantas de jardín', '4L', 10700, 6500, 8200, 0, true),
('JAR-JAZ-FORT-10L', 'Jazmín Fortunei', 'Plantas de jardín', '10L', 44500, 27000, 35000, 0, true),
('JAR-SALVIA-3L', 'Salvia Leucantha', 'Plantas de jardín', '3L', 6300, 3800, 4800, 0, true),
('GRAM-ACOR-M12', 'Acorus', 'Gramíneas', 'M12', 2500, 1500, 1900, 0, true),
('GRAM-LIRIOPE-M12', 'Liriope Muscari desarrollado', 'Gramíneas', 'M12', 4300, 2600, 3300, 0, true),
('GRAM-MUHL-2L', 'Muhlenbergia Capillaris', 'Gramíneas', '2L', 5800, 3500, 4500, 0, true),
('GRAM-NASS-3L', 'Nassella Tenuissima', 'Gramíneas', '3L', 4600, 2800, 3600, 0, true),
('GRAM-PENN-3L', 'Pennisetum Rubrum', 'Gramíneas', '3L', 5800, 3500, 4500, 0, true),
('INT-BROM', 'Bromelia Cryptanthus', 'Plantas de interior', '-', 8500, 5000, 6500, 0, true),
('INT-FICUS-3L', 'Ficus Ali', 'Plantas de interior', '3L', 19800, 12000, 15500, 0, true),
('INT-SAN-3L', 'Sansevieria', 'Plantas de interior', '3L', 13000, 7500, 10000, 0, true),
('INT-STREL-10L', 'Strelitzia Reginae', 'Plantas de interior', '10L', 58000, 38000, 47000, 0, true),
('SUST-HUM-5', 'Humus', 'Tierras / Sustratos', '5L', 4100, 2500, 3200, 0, true),
('SUST-SUST-5', 'Sustrato', 'Tierras / Sustratos', '5 dm³', 2100, 1300, 1600, 0, true),
('SUST-SUST-10', 'Sustrato', 'Tierras / Sustratos', '10 dm³', 4000, 2300, 3000, 0, true),
('SUST-SUST-20', 'Sustrato', 'Tierras / Sustratos', '20 dm³', 6200, 4000, 4800, 0, true),
('SUST-TIERRA-30', 'Tierra Negra Preparada', 'Tierras / Sustratos', '30 dm³', 6200, 4000, 4800, 0, true),
('SUST-TIERRA-100', 'Tierra Negra Preparada', 'Tierras / Sustratos', '100 dm³', 17300, 10500, 13200, 0, true),
('COR-PINO-60', 'Corteza de Pino', 'Chips / Cortezas', '60 dm³', 16500, 10500, 12800, 0, true),
('COR-PINO-100', 'Corteza de Pino', 'Chips / Cortezas', '100 dm³', 23000, 18000, 19500, 0, true),
('CHIP-ROBLE-10', 'Chip de Roble', 'Chips / Cortezas', '10 dm³', 5800, 3500, 4500, 0, true),
('CHIP-ROBLE-20', 'Chip de Roble', 'Chips / Cortezas', '20 dm³', 10000, 6000, 7800, 0, true)
on conflict (sku) do update set
  name = excluded.name,
  category = excluded.category,
  presentation = excluded.presentation,
  retail_price = excluded.retail_price,
  wholesale_price = excluded.wholesale_price,
  consignment_render_price = excluded.consignment_render_price,
  active = excluded.active,
  updated_at = now();

-- ---------------------------------------------------------------------
-- Aliados / comercios / profesionales
-- ---------------------------------------------------------------------
create table if not exists public.pa_partners (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type pa_partner_type not null default 'comercio',
  business_name text not null,
  contact_name text,
  whatsapp text,
  email text,
  address text,
  zone text,
  agreement_type text not null default 'consignacion',
  default_commission_rate numeric(8,2) not null default 0,
  seller_id uuid references public.pa_app_users(id),
  portal_token text not null unique default encode(gen_random_bytes(18), 'hex'),
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pa_partners_type_idx on public.pa_partners (type);
create index if not exists pa_partners_seller_idx on public.pa_partners (seller_id);
create index if not exists pa_partners_token_idx on public.pa_partners (portal_token);

-- ---------------------------------------------------------------------
-- Consignaciones
-- ---------------------------------------------------------------------
create table if not exists public.pa_consignments (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  partner_id uuid not null references public.pa_partners(id),
  seller_id uuid references public.pa_app_users(id),
  status pa_consignment_status not null default 'preparando',
  delivered_at timestamptz,
  received_at timestamptz,
  review_date date,
  notes text,
  created_by uuid references public.pa_app_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pa_consignments_partner_idx on public.pa_consignments (partner_id);
create index if not exists pa_consignments_status_idx on public.pa_consignments (status);

create table if not exists public.pa_consignment_items (
  id uuid primary key default gen_random_uuid(),
  consignment_id uuid not null references public.pa_consignments(id) on delete cascade,
  product_id uuid not null references public.pa_products(id),
  quantity_delivered integer not null check (quantity_delivered > 0),
  quantity_sold integer not null default 0 check (quantity_sold >= 0),
  quantity_returned integer not null default 0 check (quantity_returned >= 0),
  quantity_damaged integer not null default 0 check (quantity_damaged >= 0),
  quantity_missing integer not null default 0 check (quantity_missing >= 0),
  suggested_price numeric(14,2) not null default 0,
  render_price numeric(14,2) not null default 0,
  local_commission_unit numeric(14,2) generated always as (greatest(suggested_price - render_price, 0)) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(consignment_id, product_id)
);

create index if not exists pa_consignment_items_consignment_idx on public.pa_consignment_items (consignment_id);

create table if not exists public.pa_consignment_sales (
  id uuid primary key default gen_random_uuid(),
  consignment_id uuid not null references public.pa_consignments(id) on delete cascade,
  partner_id uuid not null references public.pa_partners(id),
  sale_date timestamptz not null default now(),
  total_sold numeric(14,2) not null default 0,
  total_to_render numeric(14,2) not null default 0,
  local_commission_total numeric(14,2) not null default 0,
  status text not null default 'pendiente_rendicion',
  notes text,
  created_by uuid references public.pa_app_users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.pa_consignment_sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.pa_consignment_sales(id) on delete cascade,
  consignment_item_id uuid not null references public.pa_consignment_items(id),
  product_id uuid not null references public.pa_products(id),
  quantity integer not null check (quantity > 0),
  sale_price numeric(14,2) not null default 0,
  render_price numeric(14,2) not null default 0,
  local_commission_unit numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.pa_payments (
  id uuid primary key default gen_random_uuid(),
  reference_type text not null,
  reference_id uuid not null,
  payer_type text,
  payer_id uuid,
  expected_amount numeric(14,2) not null default 0,
  received_amount numeric(14,2) not null default 0,
  method text not null default 'transferencia',
  external_reference text,
  status pa_payment_status not null default 'confirmado',
  notes text,
  created_by uuid references public.pa_app_users(id),
  created_at timestamptz not null default now()
);

create index if not exists pa_payments_ref_idx on public.pa_payments (reference_type, reference_id);

create table if not exists public.pa_deliveries (
  id uuid primary key default gen_random_uuid(),
  reference_type text not null,
  reference_id uuid not null,
  address text,
  zone text,
  responsible_name text,
  status text not null default 'pendiente',
  scheduled_at timestamptz,
  delivered_at timestamptz,
  delivery_photo_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pa_commissions (
  id uuid primary key default gen_random_uuid(),
  beneficiary_type text not null default 'vendedor',
  beneficiary_user_id uuid references public.pa_app_users(id),
  partner_id uuid references public.pa_partners(id),
  reference_type text not null,
  reference_id uuid not null,
  base_amount numeric(14,2) not null default 0,
  rate numeric(8,2) not null default 0,
  amount numeric(14,2) not null default 0,
  status pa_commission_status not null default 'pendiente',
  notes text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists pa_commissions_user_idx on public.pa_commissions (beneficiary_user_id);
create index if not exists pa_commissions_ref_idx on public.pa_commissions (reference_type, reference_id);

create table if not exists public.pa_inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.pa_products(id),
  movement_type text not null,
  quantity integer not null,
  reference_type text,
  reference_id uuid,
  from_location text,
  to_location text,
  notes text,
  created_by uuid references public.pa_app_users(id),
  created_at timestamptz not null default now()
);

create index if not exists pa_inventory_movements_product_idx on public.pa_inventory_movements (product_id);

create table if not exists public.pa_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.pa_app_users(id),
  actor_label text,
  event_type text not null,
  entity_type text not null,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Triggers updated_at
-- ---------------------------------------------------------------------
create or replace function public.pa_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create or replace trigger pa_app_users_touch before update on public.pa_app_users for each row execute function public.pa_touch_updated_at();
create or replace trigger pa_products_touch before update on public.pa_products for each row execute function public.pa_touch_updated_at();
create or replace trigger pa_partners_touch before update on public.pa_partners for each row execute function public.pa_touch_updated_at();
create or replace trigger pa_consignments_touch before update on public.pa_consignments for each row execute function public.pa_touch_updated_at();
create or replace trigger pa_consignment_items_touch before update on public.pa_consignment_items for each row execute function public.pa_touch_updated_at();
create or replace trigger pa_deliveries_touch before update on public.pa_deliveries for each row execute function public.pa_touch_updated_at();

-- ---------------------------------------------------------------------
-- Vistas de cálculo
-- ---------------------------------------------------------------------
create or replace view public.pa_v_consignment_items_status as
select
  ci.id,
  ci.consignment_id,
  ci.product_id,
  p.sku,
  p.name as product_name,
  p.category,
  p.presentation,
  ci.quantity_delivered,
  ci.quantity_sold,
  ci.quantity_returned,
  ci.quantity_damaged,
  ci.quantity_missing,
  greatest(ci.quantity_delivered - ci.quantity_sold - ci.quantity_returned - ci.quantity_damaged - ci.quantity_missing, 0) as quantity_remaining,
  ci.suggested_price,
  ci.render_price,
  ci.local_commission_unit,
  (ci.quantity_delivered * ci.suggested_price) as delivered_value,
  (ci.quantity_sold * ci.suggested_price) as sold_value,
  (ci.quantity_sold * ci.render_price) as render_value,
  (ci.quantity_sold * ci.local_commission_unit) as local_commission_value
from public.pa_consignment_items ci
join public.pa_products p on p.id = ci.product_id;

create or replace view public.pa_v_consignments_summary as
select
  c.id,
  c.code,
  c.partner_id,
  pt.business_name as partner_name,
  pt.type as partner_type,
  pt.whatsapp as partner_whatsapp,
  pt.zone as partner_zone,
  pt.portal_token,
  c.seller_id,
  s.full_name as seller_name,
  c.status,
  c.review_date,
  c.delivered_at,
  c.received_at,
  c.created_at,
  coalesce(sum(ci.quantity_delivered), 0)::integer as total_units_delivered,
  coalesce(sum(ci.quantity_sold), 0)::integer as total_units_sold,
  coalesce(sum(greatest(ci.quantity_delivered - ci.quantity_sold - ci.quantity_returned - ci.quantity_damaged - ci.quantity_missing, 0)), 0)::integer as total_units_remaining,
  coalesce(sum(ci.quantity_delivered * ci.suggested_price), 0) as total_value_delivered,
  coalesce(sum(ci.quantity_sold * ci.suggested_price), 0) as total_sold,
  coalesce(sum(ci.quantity_sold * ci.render_price), 0) as total_to_render,
  coalesce(sum(ci.quantity_sold * greatest(ci.suggested_price - ci.render_price, 0)), 0) as local_commission_total,
  coalesce((select sum(p.received_amount) from public.pa_payments p where p.reference_type = 'consignment' and p.reference_id = c.id and p.status in ('confirmado', 'conciliado')), 0) as total_rendered,
  greatest(coalesce(sum(ci.quantity_sold * ci.render_price), 0) - coalesce((select sum(p.received_amount) from public.pa_payments p where p.reference_type = 'consignment' and p.reference_id = c.id and p.status in ('confirmado', 'conciliado')), 0), 0) as pending_to_render
from public.pa_consignments c
join public.pa_partners pt on pt.id = c.partner_id
left join public.pa_app_users s on s.id = c.seller_id
left join public.pa_consignment_items ci on ci.consignment_id = c.id
group by c.id, pt.id, s.id;

create sequence if not exists public.pa_consignments_code_seq;

-- ---------------------------------------------------------------------
-- RPC: crear consignación con items
-- p_items: [{"product_id":"uuid", "quantity":10, "suggested_price":6200, "render_price":4800}]
-- ---------------------------------------------------------------------
create or replace function public.pa_create_consignment(
  p_partner_id uuid,
  p_items jsonb,
  p_seller_id uuid default null,
  p_review_date date default null,
  p_notes text default null,
  p_created_by uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_code text;
  v_item jsonb;
  v_product public.pa_products%rowtype;
  v_qty integer;
  v_suggested numeric(14,2);
  v_render numeric(14,2);
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'La consignación debe tener al menos un producto';
  end if;

  v_code := 'CON-' || to_char(now(), 'YYMMDD') || '-' || lpad(nextval('public.pa_consignments_code_seq')::text, 4, '0');

  insert into public.pa_consignments (code, partner_id, seller_id, status, review_date, notes, created_by, delivered_at)
  values (v_code, p_partner_id, p_seller_id, 'entregada', p_review_date, p_notes, p_created_by, now())
  returning id into v_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product from public.pa_products where id = (v_item->>'product_id')::uuid;
    if not found then
      raise exception 'Producto no existe: %', v_item->>'product_id';
    end if;

    v_qty := greatest((v_item->>'quantity')::integer, 0);
    if v_qty <= 0 then
      continue;
    end if;

    v_suggested := coalesce(nullif(v_item->>'suggested_price','')::numeric, v_product.retail_price);
    v_render := coalesce(nullif(v_item->>'render_price','')::numeric, v_product.consignment_render_price, v_product.wholesale_price);

    insert into public.pa_consignment_items (consignment_id, product_id, quantity_delivered, suggested_price, render_price)
    values (v_id, v_product.id, v_qty, v_suggested, v_render);

    update public.pa_products
      set stock_owned = stock_owned - v_qty,
          stock_consigned = stock_consigned + v_qty
      where id = v_product.id;

    insert into public.pa_inventory_movements (product_id, movement_type, quantity, reference_type, reference_id, from_location, to_location, notes, created_by)
    values (v_product.id, 'salida_consignacion', v_qty, 'consignment', v_id, 'stock_propio', 'aliado', p_notes, p_created_by);
  end loop;

  insert into public.pa_audit_events (actor_user_id, event_type, entity_type, entity_id, payload)
  values (p_created_by, 'create_consignment', 'consignment', v_id, jsonb_build_object('partner_id', p_partner_id, 'items', p_items));

  return v_id;
end;
$$;

-- ---------------------------------------------------------------------
-- RPC: registrar venta de consignación
-- p_items: [{"consignment_item_id":"uuid", "quantity":3, "sale_price":6200}]
-- Calcula total vendido, monto a rendir, comisión del local y stock restante.
-- ---------------------------------------------------------------------
create or replace function public.pa_register_consignment_sale(
  p_consignment_id uuid,
  p_items jsonb,
  p_notes text default null,
  p_created_by uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sale_id uuid;
  v_partner_id uuid;
  v_item jsonb;
  v_ci public.pa_consignment_items%rowtype;
  v_qty integer;
  v_remaining integer;
  v_sale_price numeric(14,2);
  v_total_sold numeric(14,2) := 0;
  v_total_render numeric(14,2) := 0;
  v_total_commission numeric(14,2) := 0;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'La venta debe tener al menos un producto';
  end if;

  select partner_id into v_partner_id from public.pa_consignments where id = p_consignment_id;
  if v_partner_id is null then
    raise exception 'Consignación no encontrada';
  end if;

  insert into public.pa_consignment_sales (consignment_id, partner_id, notes, created_by)
  values (p_consignment_id, v_partner_id, p_notes, p_created_by)
  returning id into v_sale_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_ci from public.pa_consignment_items where id = (v_item->>'consignment_item_id')::uuid and consignment_id = p_consignment_id for update;
    if not found then
      raise exception 'Item de consignación inválido';
    end if;

    v_qty := greatest((v_item->>'quantity')::integer, 0);
    if v_qty <= 0 then
      continue;
    end if;

    v_remaining := greatest(v_ci.quantity_delivered - v_ci.quantity_sold - v_ci.quantity_returned - v_ci.quantity_damaged - v_ci.quantity_missing, 0);
    if v_qty > v_remaining then
      raise exception 'Cantidad vendida excede stock disponible. Disponible: %, solicitado: %', v_remaining, v_qty;
    end if;

    v_sale_price := coalesce(nullif(v_item->>'sale_price','')::numeric, v_ci.suggested_price);

    insert into public.pa_consignment_sale_items (sale_id, consignment_item_id, product_id, quantity, sale_price, render_price, local_commission_unit)
    values (v_sale_id, v_ci.id, v_ci.product_id, v_qty, v_sale_price, v_ci.render_price, greatest(v_sale_price - v_ci.render_price, 0));

    update public.pa_consignment_items
      set quantity_sold = quantity_sold + v_qty
      where id = v_ci.id;

    update public.pa_products
      set stock_consigned = greatest(stock_consigned - v_qty, 0)
      where id = v_ci.product_id;

    insert into public.pa_inventory_movements (product_id, movement_type, quantity, reference_type, reference_id, from_location, to_location, notes, created_by)
    values (v_ci.product_id, 'venta_consignacion', v_qty, 'consignment_sale', v_sale_id, 'aliado', 'cliente_final', p_notes, p_created_by);

    v_total_sold := v_total_sold + (v_qty * v_sale_price);
    v_total_render := v_total_render + (v_qty * v_ci.render_price);
    v_total_commission := v_total_commission + (v_qty * greatest(v_sale_price - v_ci.render_price, 0));
  end loop;

  if v_total_sold <= 0 then
    delete from public.pa_consignment_sales where id = v_sale_id;
    raise exception 'No se registraron cantidades válidas';
  end if;

  update public.pa_consignment_sales
    set total_sold = v_total_sold,
        total_to_render = v_total_render,
        local_commission_total = v_total_commission
    where id = v_sale_id;

  update public.pa_consignments
    set status = 'en_venta'
    where id = p_consignment_id and status in ('entregada', 'recibida', 'preparando', 'en_reparto');

  insert into public.pa_audit_events (actor_user_id, event_type, entity_type, entity_id, payload)
  values (p_created_by, 'register_consignment_sale', 'consignment_sale', v_sale_id, jsonb_build_object('consignment_id', p_consignment_id, 'total_sold', v_total_sold, 'total_to_render', v_total_render, 'local_commission', v_total_commission));

  return v_sale_id;
end;
$$;

-- ---------------------------------------------------------------------
-- RPC: registrar rendición/pago de consignación
-- Genera comisión del vendedor si corresponde.
-- ---------------------------------------------------------------------
create or replace function public.pa_register_consignment_payment(
  p_consignment_id uuid,
  p_amount numeric,
  p_method text default 'transferencia',
  p_external_reference text default null,
  p_notes text default null,
  p_created_by uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment_id uuid;
  v_partner_id uuid;
  v_expected numeric(14,2);
  v_total_paid numeric(14,2);
  v_seller_id uuid;
  v_rate numeric(8,2);
  v_commission numeric(14,2);
begin
  if p_amount <= 0 then
    raise exception 'El monto rendido debe ser mayor a cero';
  end if;

  select partner_id, seller_id into v_partner_id, v_seller_id from public.pa_consignments where id = p_consignment_id;
  if v_partner_id is null then
    raise exception 'Consignación no encontrada';
  end if;
  if v_seller_id is null then
    select seller_id into v_seller_id from public.pa_partners where id = v_partner_id;
  end if;

  select total_to_render into v_expected from public.pa_v_consignments_summary where id = p_consignment_id;

  insert into public.pa_payments (reference_type, reference_id, payer_type, payer_id, expected_amount, received_amount, method, external_reference, status, notes, created_by)
  values ('consignment', p_consignment_id, 'partner', v_partner_id, coalesce(v_expected,0), p_amount, p_method, p_external_reference, 'confirmado', p_notes, p_created_by)
  returning id into v_payment_id;

  select total_rendered into v_total_paid from public.pa_v_consignments_summary where id = p_consignment_id;
  if coalesce(v_total_paid,0) >= coalesce(v_expected,0) and coalesce(v_expected,0) > 0 then
    update public.pa_consignments set status = 'rendida' where id = p_consignment_id;
  else
    update public.pa_consignments set status = 'rendicion_parcial' where id = p_consignment_id;
  end if;

  if v_seller_id is not null then
    select commission_rate into v_rate from public.pa_app_users where id = v_seller_id and active = true;
    if coalesce(v_rate,0) > 0 then
      v_commission := round((p_amount * v_rate / 100.0)::numeric, 2);
      insert into public.pa_commissions (beneficiary_type, beneficiary_user_id, partner_id, reference_type, reference_id, base_amount, rate, amount, status, notes)
      values ('vendedor', v_seller_id, v_partner_id, 'payment', v_payment_id, p_amount, v_rate, v_commission, 'pendiente', 'Comisión generada sobre rendición confirmada');
    end if;
  end if;

  insert into public.pa_audit_events (actor_user_id, event_type, entity_type, entity_id, payload)
  values (p_created_by, 'register_consignment_payment', 'payment', v_payment_id, jsonb_build_object('consignment_id', p_consignment_id, 'amount', p_amount));

  return v_payment_id;
end;
$$;

-- ---------------------------------------------------------------------
-- RPC: ajuste de stock consignado por devolución/daño/faltante.
-- ---------------------------------------------------------------------
create or replace function public.pa_register_consignment_adjustment(
  p_consignment_item_id uuid,
  p_type text,
  p_quantity integer,
  p_notes text default null,
  p_created_by uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ci public.pa_consignment_items%rowtype;
  v_remaining integer;
begin
  if p_quantity <= 0 then
    raise exception 'La cantidad debe ser mayor a cero';
  end if;
  if p_type not in ('devuelto', 'danado', 'faltante') then
    raise exception 'Tipo de ajuste inválido';
  end if;

  select * into v_ci from public.pa_consignment_items where id = p_consignment_item_id for update;
  if not found then
    raise exception 'Item no encontrado';
  end if;

  v_remaining := greatest(v_ci.quantity_delivered - v_ci.quantity_sold - v_ci.quantity_returned - v_ci.quantity_damaged - v_ci.quantity_missing, 0);
  if p_quantity > v_remaining then
    raise exception 'Cantidad excede stock restante. Disponible: %, solicitado: %', v_remaining, p_quantity;
  end if;

  if p_type = 'devuelto' then
    update public.pa_consignment_items set quantity_returned = quantity_returned + p_quantity where id = p_consignment_item_id;
    update public.pa_products set stock_owned = stock_owned + p_quantity, stock_consigned = greatest(stock_consigned - p_quantity, 0) where id = v_ci.product_id;
  elsif p_type = 'danado' then
    update public.pa_consignment_items set quantity_damaged = quantity_damaged + p_quantity where id = p_consignment_item_id;
    update public.pa_products set stock_consigned = greatest(stock_consigned - p_quantity, 0) where id = v_ci.product_id;
  else
    update public.pa_consignment_items set quantity_missing = quantity_missing + p_quantity where id = p_consignment_item_id;
    update public.pa_products set stock_consigned = greatest(stock_consigned - p_quantity, 0) where id = v_ci.product_id;
  end if;

  insert into public.pa_inventory_movements (product_id, movement_type, quantity, reference_type, reference_id, from_location, to_location, notes, created_by)
  values (v_ci.product_id, 'ajuste_' || p_type, p_quantity, 'consignment_item', p_consignment_item_id, 'aliado', case when p_type='devuelto' then 'stock_propio' else 'ajuste' end, p_notes, p_created_by);
end;
$$;


-- ---------------------------------------------------------------------
-- RPC: ajuste simple de stock propio.
-- p_quantity positivo suma stock; negativo descuenta stock.
-- ---------------------------------------------------------------------
create or replace function public.pa_register_stock_adjustment(
  p_product_id uuid,
  p_quantity integer,
  p_notes text default null,
  p_created_by uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_quantity = 0 then
    raise exception 'La cantidad no puede ser cero';
  end if;

  update public.pa_products
    set stock_owned = stock_owned + p_quantity
    where id = p_product_id;

  insert into public.pa_inventory_movements (product_id, movement_type, quantity, reference_type, reference_id, from_location, to_location, notes, created_by)
  values (p_product_id, 'ajuste_stock_propio', abs(p_quantity), 'product', p_product_id, case when p_quantity < 0 then 'stock_propio' else 'ajuste' end, case when p_quantity > 0 then 'stock_propio' else 'ajuste' end, p_notes, p_created_by);
end;
$$;

-- ---------------------------------------------------------------------
-- RLS básico. La app usa service role en server, por eso no se exponen tablas al cliente.
-- ---------------------------------------------------------------------
alter table public.pa_app_users enable row level security;
alter table public.pa_products enable row level security;
alter table public.pa_partners enable row level security;
alter table public.pa_consignments enable row level security;
alter table public.pa_consignment_items enable row level security;
alter table public.pa_consignment_sales enable row level security;
alter table public.pa_consignment_sale_items enable row level security;
alter table public.pa_payments enable row level security;
alter table public.pa_deliveries enable row level security;
alter table public.pa_commissions enable row level security;
alter table public.pa_inventory_movements enable row level security;
alter table public.pa_audit_events enable row level security;

-- No se crean policies públicas: todo pasa por rutas server-side con service role.
