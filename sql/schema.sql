-- Supabase schema for the cash in/out prototype.

create extension if not exists "pgcrypto";

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  amount numeric(12,2) not null check (amount > 0),
  type text not null check (type in ('deposit', 'withdrawal')),
  description text
);

create index if not exists transactions_created_at_idx
  on public.transactions (created_at desc);

create index if not exists transactions_type_idx
  on public.transactions (type);

alter table public.transactions enable row level security;

create policy "Public read transactions"
  on public.transactions
  for select
  using (auth.uid() = user_id);

create policy "Public insert transactions"
  on public.transactions
  for insert
  with check (auth.uid() = user_id);
