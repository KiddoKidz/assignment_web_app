import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from '@/lib/apiClient'

export async function handler(request: NextRequest, id: number): Promise<NextResponse | null> {
    try {
        await apiClient(`/authors/${id}`);
        return null;
    } catch (error) {
        console.error('Author not found or fetch failed:', error);
        return NextResponse.redirect(new URL('/authors', request.url));
    }
}