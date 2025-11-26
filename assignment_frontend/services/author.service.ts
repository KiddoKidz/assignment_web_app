import { apiClient } from "@/lib/apiClient";
import { type Author } from "@/schemas/author";

// CREATE
export async function createAuthor(data: Partial<Author>): Promise<Author> {
    const response = await apiClient("/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response as Author;
}

// READ
export async function getAuthorById(id: number): Promise<Author> {
    const response = await apiClient(`/authors/${id}`);
    return response as Author;
}

// UPDATE
export async function updateAuthor(id: number, data: Partial<Author>): Promise<Author> {
    const response = await apiClient(`/authors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response as Author;
}

// DELETE
export async function deleteAuthor(id: number): Promise<void> {
    await apiClient(`/authors/${id}`, { method: "DELETE" });
}

// Optional: GET ALL
export async function getAllAuthors(): Promise<Author[]> {
    const response = await apiClient("/authors");
    return response as Author[];
}