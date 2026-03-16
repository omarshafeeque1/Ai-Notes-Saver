import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, title, content, tags } = await req.json()

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (tags !== undefined) updateData.tags = tags

    console.log('API UPDATE - Attempting to update note:', { id, userId: user.id });

    const { data, error } = await supabase
      .from('notes')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('API UPDATE - Supabase Update Error:', error);
      throw error
    }

    console.log('API UPDATE - Successfully updated note:', id);

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
