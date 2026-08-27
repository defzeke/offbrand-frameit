import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required', display_name: null }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.auth.admin.getUserById(userId);

  if (error || !data?.user) {
    return NextResponse.json({ 
      error: error?.message || 'User not found', 
      display_name: 'Original Creator' 
    }, { status: 404 });
  }

  const displayName = data.user.user_metadata?.display_name || data.user.email || 'Original Creator';
  
  return NextResponse.json({ display_name: displayName });
}
