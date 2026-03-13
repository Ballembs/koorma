'use client'

import { useEffect, useRef } from 'react'
import { useKoormaStore } from '@/lib/store'
import { createClient } from '@/utils/supabase/client'

export function SupabaseSync() {
  const initRef = useRef(false)
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let active = true
    let supabase: ReturnType<typeof createClient>

    try {
      supabase = createClient()
    } catch (err) {
      console.warn('[SupabaseSync] Could not create client:', err)
      return
    }

    const hydrateFromCloud = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          initRef.current = true
          return
        }

        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .limit(1)
        const profile = profileData?.[0]

        // Fetch child profiles
        const { data: childData } = await supabase
          .from('child_profiles')
          .select('*')
          .eq('parent_id', session.user.id)

        let currentState = useKoormaStore.getState()

        if (childData && childData.length > 0) {
          useKoormaStore.setState({
            profiles: childData.map(c => ({
              id: c.id,
              childName: c.child_name,
              childNickname: c.child_name,
              childAge: c.child_age,
              avatarEmoji: c.avatar_emoji,
              displayName: c.child_name,
              teluguLevel: c.telugu_level === 'beginner' ? 1 : 2,
              friends: [],
            }))
          })
          currentState = useKoormaStore.getState()
        }

        const activeId = currentState.activeProfileId

        // Fetch progress for this specific child
        let progress = null;
        if (activeId) {
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('*')
            .eq('child_id', activeId)
            .limit(1)
          progress = progressData?.[0]
        } else {
          // Fallback to old behavior
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('*')
            .eq('id', session.user.id)
            .limit(1)
          progress = progressData?.[0]
        }

        // Catch up AP Textbook Progress
        const { data: apData } = await supabase
          .from('ap_textbook_progress')
          .select('*')
          .eq('user_id', session.user.id)

        if (!active) return

        // Hydrate profile setting overrides
        if (profile) {
          useKoormaStore.setState({
            audioEnabled: profile.audio_enabled ?? true,
            speechRate: profile.speech_rate ?? 0.75,
          })
        }

        const hydratedApProgress: Record<string, any> = { ...currentState.apProgress };
        if (apData) {
          apData.forEach(row => {
            const key = `c${row.class_number}-${row.chapter_id}-${row.content_type}`;
            let starsEarned = 0;
            if (row.score > 0) {
              if (row.score <= 50) starsEarned = 1;
              else if (row.score <= 80) starsEarned = 2;
              else starsEarned = 3;
            }
            hydratedApProgress[key] = {
              completed: row.completed,
              score: row.score,
              starsEarned
            };
          });
        }

        // Hydrate progress
        if (progress) {
          useKoormaStore.setState({
            completedSections: progress.completed_sections || currentState.completedSections,
            completedPairs: progress.completed_pairs || currentState.completedPairs,
            wordProgress: progress.word_progress || currentState.wordProgress,
            sentenceProgress: progress.sentence_progress || currentState.sentenceProgress,
            storyProgress: progress.story_progress || currentState.storyProgress,
            apProgress: hydratedApProgress,
          })
        } else if (apData) {
          useKoormaStore.setState({ apProgress: hydratedApProgress });
        }
      } catch (err) {
        console.warn('[SupabaseSync] Cloud hydration failed, using local state:', err)
      } finally {
        initRef.current = true
      }
    }

    hydrateFromCloud()

    // Subscribe to Zustand changes and debounced sync to Supabase
    const unsubscribe = useKoormaStore.subscribe(async (state) => {
      if (!initRef.current) return

      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }

      syncTimeoutRef.current = setTimeout(async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (!session) return

          let upsertData: any = {
            id: session.user.id, // Fallback V1 behavior
            completed_sections: state.completedSections,
            completed_pairs: state.completedPairs,
            word_progress: state.wordProgress,
            sentence_progress: state.sentenceProgress,
            story_progress: state.storyProgress,
            updated_at: new Date().toISOString()
          };

          if (state.activeProfileId) {
            // Update the specific child's row
            upsertData.child_id = state.activeProfileId;
            // Since `id` acts as the primary key mapped to auth.users, and a child_id might not map 1:1 to an auth.user id in the future,
            // we will need to query for the specific row id if we wanted true multi-row support, 
            // but for now, we just update the row tied to this session.user.id with the active child_id

            // To be truly robust for MULTIPLE children, we need to match on `child_id`.
            // Because `user_progress.id` is PK `references auth.users`, V1 only allowed 1 progress per parent.
            // In V2, we might want to drop that PK constraint eventually.
            // For now, this upsert will preserve V1 behavior but stamp it with the active child.
          }

          await supabase
            .from('user_progress')
            .upsert(upsertData, { onConflict: 'id' })

          if (Object.keys(state.apProgress).length > 0) {
            const apUpserts = Object.entries(state.apProgress).map(([key, data]) => {
              // Expected key format: c{classNumber}-{chapterId}-{contentType}
              // However, chapterId can have dashes. 
              // Assuming schema: c1-chapter-1-rhyme -> class: 1, type: rhyme, chapterId: chapter-1
              // Let's parse strictly: key always starts with 'c', followed by digit, followed by '-'.
              const classStr = key.substring(1, key.indexOf('-'));
              const classNumber = parseInt(classStr, 10);
              const remainder = key.substring(key.indexOf('-') + 1);
              const lastDashIdx = remainder.lastIndexOf('-');
              const contentType = remainder.substring(lastDashIdx + 1);
              const chapterId = remainder.substring(0, lastDashIdx);

              return {
                user_id: session.user.id,
                class_number: classNumber,
                chapter_id: chapterId,
                content_type: contentType,
                completed: data.completed,
                score: data.score
              }
            });

            await supabase
              .from('ap_textbook_progress')
              .upsert(apUpserts, { onConflict: 'user_id,class_number,chapter_id' })
          }
        } catch (err) {
          console.warn('[SupabaseSync] Cloud save failed:', err)
        }
      }, 2500)
    })

    return () => {
      active = false
      unsubscribe()
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current)
    }
  }, [])

  return null
}
