import { NextResponse } from 'next/server';

export async function GET() {
	// Clear the auth cookie (assume cookie name is 'frameit-auth')
	const response = NextResponse.redirect('/');
	response.cookies.set('frameit-auth', '', {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
		expires: new Date(0), // Expire immediately
	});
	return response;
}
