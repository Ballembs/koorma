-- ═══════════════════════════════════════════════
-- KOORMA V2: EXISTING USER MIGRATION SCRIPT
-- ═══════════════════════════════════════════════
-- Run this script ONCE to backfill child profiles for existing Koorma V1 users.
-- This ensures they don't lose their progress when upgrading to V2.

do $$
declare
    user_record record;
    new_child_id uuid;
begin
    -- 1. Loop through all existing users who have progress but NO linked child_id yet
    for user_record in 
        select id from public.user_progress where child_id is null
    loop
        -- 2. Create a default "My Child" profile for them
        insert into public.child_profiles (parent_id, child_name, child_age, avatar_emoji, telugu_level)
        values (
            user_record.id, 
            'My Child',  -- Default name, they can edit this later
            5,           -- Default age
            '🐢',         -- Default avatar
            'beginner'
        )
        returning id into new_child_id;

        -- 3. Link their existing progress to this new child profile
        update public.user_progress
        set child_id = new_child_id
        where id = user_record.id;
        
        raise notice 'Migrated user % to child profile %', user_record.id, new_child_id;
    end loop;
end $$;
