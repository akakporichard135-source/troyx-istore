create table if not exists products (
  id text primary key,
  slug text unique not null,
  name text not null,
  category text not null,
  price numeric not null,
  compare_at_price numeric,
  description text not null,
  images jsonb not null default '[]',
  colors jsonb not null default '[]',
  storage jsonb not null default '[]',
  condition jsonb not null default '[]',
  stock integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  customer_id uuid,
  email text not null,
  status text not null default 'Confirmed',
  total numeric not null,
  fulfillment text not null,
  payment_provider text not null,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id text references orders(id) on delete cascade,
  product_id text references products(id),
  quantity integer not null,
  selected_color text,
  selected_storage text,
  selected_condition text
);

create table if not exists audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
