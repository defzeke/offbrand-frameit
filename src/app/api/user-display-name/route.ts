import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { jwtDecode } from 'jwt-decode';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('frameit_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'No auth token found', display_name: null }, { status: 401 });
  }

  let userId = null;
  try {
    const decoded = jwtDecode(token);
    userId = decoded.sub;
  } catch {
    return NextResponse.json({ error: 'Invalid token', display_name: null }, { status: 401 });
  }

  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'Invalid user ID', display_name: null }, { status: 401 });
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data, error } = await supabase.auth.admin.getUserById(userId);
  if (error || !data?.user) {
    return NextResponse.json({ error: error?.message || 'User not found', display_name: null }, { status: 401 });
  }
  const displayName = data.user.user_metadata?.display_name || data.user.email;
  return NextResponse.json({ display_name: displayName });
}
