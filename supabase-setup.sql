-- 1. Create a table to link Auth users to their Koorma profiles
create table public.profiles (
  id uuid references auth.users not null primary key,
  child_name text not null,
  telugu_level text not null default 'beginner',
  audio_enabled boolean not null default true,
  speech_rate numeric not null default 0.75,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS) for profiles
alter table public.profiles enable row level security;
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- 2. Create a table for granular user progress matching the Zustand store
create table public.user_progress (
  id uuid references auth.users not null primary key,
  unlocked_sections text[] not null default '{"vowels"}',
  completed_sections text[] not null default '{}',
  completed_pairs text[] not null default '{}',
  word_progress jsonb not null default '{"wordsLearned": [], "categoriesCompleted": []}',
  sentence_progress jsonb not null default '{"currentLevel": 1, "levelsUnlocked": [1], "sentencesFormed": 0}',
  story_progress jsonb not null default '{"tier1": {}, "tier2Generated": 0, "totalStoriesRead": 0, "savedMagicStories": []}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS) for user_progress
alter table public.user_progress enable row level security;
create policy "Users can read own progress" on user_progress for select using (auth.uid() = id);
create policy "Users can insert own progress" on user_progress for insert with check (auth.uid() = id);
create policy "Users can update own progress" on user_progress for update using (auth.uid() = id);

-- 3. Trigger to automatically create progress row when profile is created
create or replace function public.handle_new_user_progress()
returns trigger as $$
begin
  insert into public.user_progress (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.handle_new_user_progress();


