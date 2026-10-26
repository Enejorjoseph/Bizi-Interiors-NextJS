-- Bisi Interiors product catalogue setup / migration
-- Safe to run if the categories/products tables already exist.

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(12,2) not null default 0,
  category_id uuid references public.categories(id) on delete set null,
  category text,
  image_url text,
  stock integer not null default 0,
  is_featured boolean not null default false,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add columns required by the website if the table was created from the earlier SQL.
alter table public.products add column if not exists category text;
alter table public.products add column if not exists image_url text;
alter table public.products add column if not exists is_featured boolean not null default false;
alter table public.products add column if not exists is_available boolean not null default true;
alter table public.products add column if not exists created_at timestamptz not null default now();

insert into public.categories (name, description) values
 ('Barber Chairs & Equipment', 'Professional barber chairs and barbershop equipment'),
 ('Salon Furniture & Equipment', 'Furniture and equipment for salons'),
 ('Reception & Waiting Area', 'Reception desks and waiting room furniture'),
 ('Tools & Accessories', 'Professional tools and accessories'),
 ('Interior Design Solutions', 'Interior design products and solutions')
on conflict (name) do nothing;

alter table public.categories enable row level security;
alter table public.products enable row level security;

drop policy if exists "Anyone can view categories" on public.categories;
create policy "Anyone can view categories" on public.categories for select to anon, authenticated using (true);

drop policy if exists "Anyone can view available products" on public.products;
create policy "Anyone can view available products" on public.products for select to anon, authenticated using (is_available = true);

-- Create a public-read bucket for product images. Only the server-side service role uploads/deletes images.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/png','image/jpeg','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/png','image/jpeg','image/webp','image/gif'];
