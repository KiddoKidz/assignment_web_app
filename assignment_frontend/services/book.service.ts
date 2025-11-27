import { apiClient } from "@/lib/apiClient";
import { BookResponseSchema, type BookInput, type BookResponse, type BooksPageResponse } from "@/schemas/book";


export async function createBook(data: Partial<BookInput>): Promise<BookResponse> {
    const response = await apiClient("/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return BookResponseSchema.parse(response);
}

export async function getBookById(id: number): Promise<BookResponse> {
    const response = await apiClient(`/books/${id}`);
    return response as BookResponse;
}

export async function updateBook(id: number, data: Partial<BookInput>): Promise<BookResponse> {
    const response = await apiClient(`/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return BookResponseSchema.parse(response);
}

export async function deleteBook(id: number): Promise<void> {
    await apiClient(`/books/${id}`, { method: "DELETE" });
}

export async function getAllBooks(page: number = 0, size: number = 10): Promise<BooksPageResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });
    const response = await apiClient(`/books?${params}`);
    return response as BooksPageResponse;
}