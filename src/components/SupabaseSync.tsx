'use client'

import { useEffect, useRef } from 'react'
import { useKoormaStore } from '@/lib/store'
import { createClient } from '@/utils/supabase/client'

export function SupabaseSync() {
  const supabase = createClient()
  const initRef = useRef(false)
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let active = true

    const hydrateFromCloud = async () => {
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

      // Hydrate profile (only if we have cloud data)
      if (profile && profile.child_name) {
        useKoormaStore.setState({
          childName: profile.child_name,
          audioEnabled: profile.audio_enabled ?? true,
          speechRate: profile.speech_rate ?? 0.75,
        })
      }

      // Hydrate progress (merge cloud with default states safely)
      if (progress) {
        const currentProgress = useKoormaStore.getState()
        useKoormaStore.setState({
          completedSections: progress.completed_sections || currentProgress.completedSections,
          completedPairs: progress.completed_pairs || currentProgress.completedPairs,
          wordProgress: progress.word_progress || currentProgress.wordProgress,
          sentenceProgress: progress.sentence_progress || currentProgress.sentenceProgress,
        })
      }

      initRef.current = true
    }

    hydrateFromCloud()

    // Subscribe to Zustand changes and debounced sync to Supabase
    const unsubscribe = useKoormaStore.subscribe(async (state) => {
      // Don't sync back immediately if we haven't finished the initial cloud hydration
      if (!initRef.current) return

      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }

      // Debounce the save by 2.5 seconds to avoid spamming the DB during rapid clicking
      syncTimeoutRef.current = setTimeout(async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        // Upsert Progress
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

        // Optional: Update specific profile settings if they changed (like audio)
      }, 2500)
    })

    return () => {
      active = false
      unsubscribe()
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current)
    }
  }, [supabase])

  return null // This is a headless component, it renders nothing!
}
