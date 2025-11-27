import { apiClient } from "@/lib/apiClient";
import { BorrowedBookResponseSchema, type BorrowedBookInput, type BorrowedBookResponse, type BorrowedBooksPageResponse } from "@/schemas/borrowedBook";


export async function createBorrowedBook(data: Partial<BorrowedBookInput>): Promise<BorrowedBookResponse> {
    const response = await apiClient("/borrowed-books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return BorrowedBookResponseSchema.parse(response);
}

export async function getBorrowedBookById(id: number): Promise<BorrowedBookResponse> {
    const response = await apiClient(`/borrowed-books/${id}`);
    return BorrowedBookResponseSchema.parse(response);
}

export async function updateBorrowedBook(id: number, data: Partial<BorrowedBookInput>): Promise<BorrowedBookResponse> {
    const response = await apiClient(`/borrowed-books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return BorrowedBookResponseSchema.parse(response);
}

export async function deleteBorrowedBook(id: number): Promise<void> {
    await apiClient(`/borrowed-books/${id}`, { method: "DELETE" });
}

export async function getAllBorrowedBooks(page: number = 0, size: number = 10): Promise<BorrowedBooksPageResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });
    const rawResponse = await apiClient(`/borrowed-books?${params}`);
    const parsedContent = rawResponse.content.map((item: unknown) => BorrowedBookResponseSchema.parse(item));
    return {
        content: parsedContent,
        page: rawResponse.page,
    };
}