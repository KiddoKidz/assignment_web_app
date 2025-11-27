import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from '@/lib/apiClient'

export async function handler(request: NextRequest, id: number): Promise<NextResponse | null> {
    try {
        await apiClient(`/borrowed-books/${id}`);
        return null;
    } catch (error) {
        console.error('Borrowed book not found or fetch failed:', error);
        return NextResponse.redirect(new URL('/borrow-books', request.url));
    }
}