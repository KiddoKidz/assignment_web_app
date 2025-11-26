import { apiClient } from "@/lib/apiClient";
import { type BorrowedBook } from "@/schemas/borrowedBook";


// CREATE
export async function createBorrowedBook(data: Partial<BorrowedBook>): Promise<BorrowedBook> {
    const response = await apiClient("/borrowed-books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response as BorrowedBook;
}

// READ
export async function getBorrowedBookById(id: number): Promise<BorrowedBook> {
    const response = await apiClient(`/borrowed-books/${id}`);
    return response as BorrowedBook;
}

// UPDATE
export async function updateBorrowedBook(id: number, data: Partial<BorrowedBook>): Promise<BorrowedBook> {
    const response = await apiClient(`/borrowed-books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response as BorrowedBook;
}

// DELETE
export async function deleteBorrowedBook(id: number): Promise<void> {
    await apiClient(`/borrowed-books/${id}`, { method: "DELETE" });
}

// Optional: GET ALL
export async function getAllBorrowedBooks(): Promise<BorrowedBook[]> {
    const response = await apiClient("/borrowed-books");
    return response as BorrowedBook[];
}