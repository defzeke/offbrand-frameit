import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
	const { email, password, remember } = await request.json();
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	const { data, error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 401 });
	}

	// Set both the JWT token and session
	const response = NextResponse.json({ user: data.user, session: data.session });
	
	// Set cookie expiry based on remember me option
	const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30 days if remember, 7 days otherwise
	
	if (data.session && data.session.access_token) {
		response.cookies.set('frameit_token', data.session.access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			maxAge
		});
		
		// Also set refresh token
		if (data.session.refresh_token) {
			response.cookies.set('frameit_refresh_token', data.session.refresh_token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				path: '/',
				maxAge
			});
		}
	}
	return response;
}
