alter table ad_packs add column if not exists share_id text;
create unique index if not exists ad_packs_share_id_idx on ad_packs (share_id);
