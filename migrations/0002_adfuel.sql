-- AdFuel Studio: per-user plans, credits, generated ad packs, and billing events.
create table if not exists profiles (
  user_id    text primary key,
  plan       text not null default 'trial',
  credits    integer not null default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ad_packs (
  id           serial primary key,
  user_id      text not null,
  product_name text not null,
  brief        text not null,
  platform     text not null,
  goal         text not null,
  engine       text not null,
  octane       integer,
  pack_json    text not null,
  created_at   timestamptz not null default now()
);
create index if not exists ad_packs_user_id_idx on ad_packs (user_id);
create index if not exists ad_packs_created_at_idx on ad_packs (created_at desc);

create table if not exists subscriptions (
  id           serial primary key,
  user_id      text not null,
  plan         text not null,
  amount_cents integer not null,
  status       text not null default 'active',
  created_at   timestamptz not null default now()
);
create index if not exists subscriptions_user_id_idx on subscriptions (user_id);
