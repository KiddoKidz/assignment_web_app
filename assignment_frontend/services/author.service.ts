import { apiClient } from "@/lib/apiClient";
import { type Author, type AuthorsPageResponse } from "@/schemas/author";

export async function createAuthor(data: Partial<Author>): Promise<Author> {
    const response = await apiClient("/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response as Author;
}

export async function getAuthorById(id: number): Promise<Author> {
    const response = await apiClient(`/authors/${id}`);
    return response as Author;
}

export async function updateAuthor(id: number, data: Partial<Author>): Promise<Author> {
    const response = await apiClient(`/authors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response as Author;
}

export async function deleteAuthor(id: number): Promise<void> {
    await apiClient(`/authors/${id}`, { method: "DELETE" });
}

export async function getAllAuthors(page: number = 0, size: number = 10): Promise<AuthorsPageResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });
    const response = await apiClient(`/authors?${params}`);
    return response as AuthorsPageResponse;
}