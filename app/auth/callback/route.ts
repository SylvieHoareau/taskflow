import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
    // We need to get the code from the query parameters to exchange it for a session
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code')

    // If we have a code, we can exchange it for a session and set the cookies
    if (code) {
        const supabase = await createServerSupabaseClient();
        await supabase.auth.exchangeCodeForSession(code)
    }

    // Redirect to the dashboard after the session has been set
    return NextResponse.redirect(`${origin}/dashboard`);
}