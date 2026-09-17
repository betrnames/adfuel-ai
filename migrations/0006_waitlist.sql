-- Email capture for launch notify. No marketing beyond that list.
create table if not exists waitlist (
  id         serial primary key,
  email      text not null unique,
  ip_hash    text,
  created_at timestamptz not null default now()
);
create index if not exists waitlist_ip_hash_created_idx on waitlist (ip_hash, created_at desc);
