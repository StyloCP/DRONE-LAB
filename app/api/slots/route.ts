import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date')

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('appointments')
    .select('slot')
    .eq('date', date)
    .neq('status', 'מבוטל')   // cancelled slots are available again

  if (error) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  const taken = (data ?? []).map(r => r.slot as string)
  return NextResponse.json({ taken })
}
