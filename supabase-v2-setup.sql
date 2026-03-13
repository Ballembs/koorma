-- ═══════════════════════════════════════════════
-- KOORMA V2 SCHEMA ADDITIONS
-- ═══════════════════════════════════════════════

-- 1. Weekly activity tracking
create table if not exists public.weekly_activity (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  week_start date not null,
  letters_learned text[] default '{}',
  words_learned text[] default '{}',
  sentences_practiced int default 0,
  stories_read int default 0,
  rhymes_sung int default 0,
  daily_challenges_completed int default 0,
  session_minutes int default 0,
  xp_earned int default 0,
  created_at timestamp with time zone default now(),
  unique(user_id, week_start)
);

alter table public.weekly_activity enable row level security;
drop policy if exists "own_activity_select" on weekly_activity;
create policy "own_activity_select" on weekly_activity for select using (auth.uid() = user_id);
drop policy if exists "own_activity_insert" on weekly_activity;
create policy "own_activity_insert" on weekly_activity for insert with check (auth.uid() = user_id);
drop policy if exists "own_activity_update" on weekly_activity;
create policy "own_activity_update" on weekly_activity for update using (auth.uid() = user_id);

-- 2. Certificates earned
create table if not exists public.certificates (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  certificate_type text not null,
  child_name text not null,
  earned_at timestamp with time zone default now()
);

alter table public.certificates enable row level security;
drop policy if exists "own_certs" on certificates;
create policy "own_certs" on certificates for all using (auth.uid() = user_id);

-- 3. Sheet download tracking
create table if not exists public.sheet_downloads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  sheet_type text not null,
  downloaded_at timestamp with time zone default now()
);

alter table public.sheet_downloads enable row level security;
drop policy if exists "own_downloads" on sheet_downloads;
create policy "own_downloads" on sheet_downloads for all using (auth.uid() = user_id);

-- 4. Multi-Child Profiles
create table if not exists public.child_profiles (
  id uuid default gen_random_uuid() primary key,
  parent_id uuid references auth.users not null,
  child_name text not null,
  child_age int default 5,
  avatar_emoji text default '🐢',
  telugu_level text default 'beginner',
  created_at timestamp with time zone default now()
);

alter table public.child_profiles enable row level security;
drop policy if exists "Parents can manage children" on child_profiles;
create policy "Parents can manage children" on child_profiles 
  for all using (auth.uid() = parent_id);

-- 5. Add child_id column to user_progress (only if it doesn't exist)
do $$
begin
  if not exists (select 1 from information_schema.columns 
                 where table_schema='public' and table_name='user_progress' and column_name='child_id') then
    alter table public.user_progress add column child_id uuid references child_profiles(id);
  end if;
end $$;

-- 6. Track AP textbook progress per child
create table if not exists public.ap_textbook_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  class_number int not null,
  chapter_id text not null,
  content_type text not null,  -- 'rhyme', 'story', 'exercise', etc.
  completed boolean default false,
  score int default 0,         -- for exercises: percentage correct
  time_spent_seconds int default 0,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  unique(user_id, class_number, chapter_id)
);

alter table public.ap_textbook_progress enable row level security;
drop policy if exists "own_ap_progress" on ap_textbook_progress;
create policy "own_ap_progress" on ap_textbook_progress 
  for all using (auth.uid() = user_id);
