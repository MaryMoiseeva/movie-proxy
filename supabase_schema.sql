create table if not exists public.movies_cache (
    film_id bigint primary key,
    payload jsonb not null,
    updated_at timestamptz not null default now()
);

create table if not exists public.favorite_movies (
    user_id text not null,
    film_id bigint not null,
    movie jsonb not null,
    created_at timestamptz not null default now(),
    primary key (user_id, film_id)
);

create index if not exists movies_cache_updated_at_idx
    on public.movies_cache (updated_at desc);

create index if not exists favorite_movies_user_created_idx
    on public.favorite_movies (user_id, created_at desc);

create table if not exists public.user_search_history (
    id bigserial primary key,
    user_id text not null,
    query text not null,
    source text,
    result_count integer not null default 0,
    top_movies jsonb not null default '[]'::jsonb,
    plan jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create table if not exists public.user_preferences (
    user_id text primary key,
    preferences jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);

create index if not exists user_search_history_user_created_idx
    on public.user_search_history (user_id, created_at desc);

-- The backend reads and writes these tables with SUPABASE_SERVICE_ROLE_KEY.
-- RLS stays on so the Android anon key cannot access another user's cached/profile data directly.
alter table public.movies_cache enable row level security;
alter table public.favorite_movies enable row level security;
alter table public.user_search_history enable row level security;
alter table public.user_preferences enable row level security;

revoke all on public.movies_cache from anon, authenticated;
revoke all on public.favorite_movies from anon, authenticated;
revoke all on public.user_search_history from anon, authenticated;
revoke all on public.user_preferences from anon, authenticated;
revoke all on sequence public.user_search_history_id_seq from anon, authenticated;

grant select, insert, update, delete on public.movies_cache to service_role;
grant select, insert, update, delete on public.favorite_movies to service_role;
grant select, insert, update, delete on public.user_search_history to service_role;
grant select, insert, update, delete on public.user_preferences to service_role;
grant usage, select on sequence public.user_search_history_id_seq to service_role;
