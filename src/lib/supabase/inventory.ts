// src/lib/supabase/inventory.ts
import { supabase } from '@/lib/supabase/client'

// Subscribe to inventory changes
export function subscribeToInventoryChanges(callback: (payload: any) => void) {
  const subscription = supabase
    .channel('inventory-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'InventoryItem'
      }, 
      callback
    )
    .subscribe()

  return () => {
    supabase.removeChannel(subscription)
  }
}

// Get realtime inventory count
export async function getRealtimeInventoryCount() {
  const { data, error } = await supabase
    .from('InventoryItem')
    .select('count')

  if (error) throw error
  return data
}