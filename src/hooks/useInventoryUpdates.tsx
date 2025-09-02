// src/hooks/useInventoryUpdates.ts
'use client'

import { useEffect } from 'react'
import { subscribeToInventoryChanges } from '@/lib/supabase/inventory'
import { useRouter } from 'next/navigation'

export function useInventoryUpdates(callback: () => Promise<void> | void) {
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = subscribeToInventoryChanges(payload => {
      console.log('Inventory change detected:', payload)
      // Refresh the inventory page when changes occur
      router.refresh()
      callback()
    })

    return () => {
      unsubscribe()
    }
  }, [router, callback])
}