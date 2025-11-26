import { apiClient } from "@/lib/apiClient";
import { type Member } from "@/schemas/member";


// CREATE
export async function createMember(data: Partial<Member>): Promise<Member> {
    const response = await apiClient("/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response as Member;
}

// READ
export async function getMemberById(id: number): Promise<Member> {
    const response = await apiClient(`/members/${id}`);
    return response as Member;
}

// UPDATE
export async function updateMember(id: number, data: Partial<Member>): Promise<Member> {
    const response = await apiClient(`/members/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response as Member;
}

// DELETE
export async function deleteMember(id: number): Promise<void> {
    await apiClient(`/members/${id}`, { method: "DELETE" });
}

// Optional: GET ALL
export async function getAllMembers(): Promise<Member[]> {
    const response = await apiClient("/members");
    return response as Member[];
}