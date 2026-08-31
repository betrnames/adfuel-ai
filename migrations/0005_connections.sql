-- Per-user generation source: hosted Grok, bring-your-own key, MCP servers.
create table if not exists user_connections (
  user_id        text primary key,
  source         text not null default 'hosted',
  llm_provider   text not null default 'xai',
  llm_model      text,
  llm_key_enc    text,
  updated_at     timestamptz not null default now()
);

create table if not exists mcp_servers (
  id             text primary key,
  user_id        text not null,
  name           text not null,
  url            text not null,
  auth_enc       text,
  enabled        boolean not null default true,
  last_ok        timestamptz,
  last_error     text,
  tool_count     integer,
  created_at     timestamptz not null default now()
);
create index if not exists mcp_servers_user_id_idx on mcp_servers (user_id);
