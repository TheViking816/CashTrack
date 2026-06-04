-- Supabase schema for CashTrack.
-- Run this file in the Supabase SQL editor for the project before using the app.

create extension if not exists "pgcrypto";

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  amount numeric(12,2) not null check (amount > 0),
  type text not null check (type in ('deposit', 'withdrawal')),
  description text
);

alter table public.transactions
  alter column description set default '';

create index if not exists transactions_created_at_idx
  on public.transactions (created_at desc);

create index if not exists transactions_type_idx
  on public.transactions (type);

create index if not exists transactions_user_created_at_idx
  on public.transactions (user_id, created_at desc);

alter table public.transactions enable row level security;

drop policy if exists "Public read transactions" on public.transactions;
drop policy if exists "Public insert transactions" on public.transactions;
drop policy if exists "Public update transactions" on public.transactions;
drop policy if exists "Public delete transactions" on public.transactions;

create policy "Public read transactions"
  on public.transactions
  for select
  using (auth.uid() = user_id);

create policy "Public insert transactions"
  on public.transactions
  for insert
  with check (auth.uid() = user_id);

create policy "Public update transactions"
  on public.transactions
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Public delete transactions"
  on public.transactions
  for delete
  using (auth.uid() = user_id);

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.transactions to authenticated;
