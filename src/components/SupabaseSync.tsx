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
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        // Fetch progress
        const { data: progress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (!active) return

        // Hydrate profile
        if (profile && profile.child_name) {
          useKoormaStore.setState({
            childName: profile.child_name,
            audioEnabled: profile.audio_enabled ?? true,
            speechRate: profile.speech_rate ?? 0.75,
          })
        }

        // Hydrate progress
        if (progress) {
          const currentProgress = useKoormaStore.getState()
          useKoormaStore.setState({
            completedSections: progress.completed_sections || currentProgress.completedSections,
            completedPairs: progress.completed_pairs || currentProgress.completedPairs,
            wordProgress: progress.word_progress || currentProgress.wordProgress,
            sentenceProgress: progress.sentence_progress || currentProgress.sentenceProgress,
          })
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

          await supabase
            .from('user_progress')
            .upsert({
              id: session.user.id,
              completed_sections: state.completedSections,
              completed_pairs: state.completedPairs,
              word_progress: state.wordProgress,
              sentence_progress: state.sentenceProgress,
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' })
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
