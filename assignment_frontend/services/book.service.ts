import { apiClient } from "@/lib/apiClient";
import { type Book } from "@/schemas/book";


// CREATE
export async function createBook(data: Partial<Book>): Promise<Book> {
    const response = await apiClient("/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response as Book;
}

// READ
export async function getBookById(id: number): Promise<Book> {
    const response = await apiClient(`/books/${id}`);
    return response as Book;
}

// UPDATE
export async function updateBook(id: number, data: Partial<Book>): Promise<Book> {
    const response = await apiClient(`/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response as Book;
}

// DELETE
export async function deleteBook(id: number): Promise<void> {
    await apiClient(`/books/${id}`, { method: "DELETE" });
}

// Optional: GET ALL
export async function getAllBooks(): Promise<Book[]> {
    const response = await apiClient("/books");
    return response as Book[];
}