import { NextRequest, NextResponse } from 'next/server'
import { handler as authorHandler } from './lib/middleware/handlers/author'
import { handler as bookHandler } from './lib/middleware/handlers/book'
import { handler as memberHandler } from './lib/middleware/handlers/member'
import { handler as borrowedBookHandler } from './lib/middleware/handlers/borrowedBook'

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const pathMatch = pathname.match(/^\/(authors|books|members|borrow-books)\/(\d+)$/);
    if (!pathMatch) {
        return NextResponse.next()
    }

    const resource = pathMatch[1];
    const idStr = pathMatch[2];
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
        return NextResponse.next()
    }

    switch (resource) {
        case 'authors':
            return await authorHandler(request, id) ?? NextResponse.next()
        case 'books':
            return await bookHandler(request, id) ?? NextResponse.next()
        case 'members':
            return await memberHandler(request, id) ?? NextResponse.next()
        case 'borrow-books':
            return await borrowedBookHandler(request, id) ?? NextResponse.next()
        default:
            return NextResponse.next()
    }
}

export const config = {
    matcher: [
        '/authors/:id(\\d+)',
        '/books/:id(\\d+)',
        '/members/:id(\\d+)',
        '/borrow-books/:id(\\d+)',
    ],
}