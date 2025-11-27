import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from '@/lib/apiClient'

export async function handler(request: NextRequest, id: number): Promise<NextResponse | null> {
    try {
        await apiClient(`/books/${id}`);
        return null;
    } catch (error) {
        console.error('Book not found or fetch failed:', error);
        return NextResponse.redirect(new URL('/books', request.url));
    }
}