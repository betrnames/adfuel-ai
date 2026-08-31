-- Real billing: invoices + extra subscription fields.
alter table subscriptions add column if not exists provider text not null default 'ledger';
alter table subscriptions add column if not exists provider_ref text;
alter table subscriptions add column if not exists billing_email text;
alter table subscriptions add column if not exists billing_name text;
alter table subscriptions add column if not exists period_end timestamptz;

create table if not exists payments (
  id            serial primary key,
  user_id       text not null,
  plan          text not null,
  amount_cents  integer not null,
  currency      text not null default 'usd',
  status        text not null,
  provider      text not null,
  provider_ref  text,
  billing_email text,
  billing_name  text,
  created_at    timestamptz not null default now()
);
create index if not exists payments_user_id_idx on payments (user_id);
create unique index if not exists payments_provider_ref_idx on payments (provider, provider_ref)
  where provider_ref is not null;
