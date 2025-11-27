import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from '@/lib/apiClient'

export async function handler(request: NextRequest, id: number): Promise<NextResponse | null> {
    try {
        await apiClient(`/members/${id}`);
        return null;
    } catch (error) {
        console.error('Member not found or fetch failed:', error);
        return NextResponse.redirect(new URL('/members', request.url));
    }
}