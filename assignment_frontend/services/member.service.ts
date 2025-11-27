import { apiClient } from "@/lib/apiClient";
import { type Member, type MembersPageResponse } from "@/schemas/member";


export async function createMember(data: Partial<Member>): Promise<Member> {
    const response = await apiClient("/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response as Member;
}

export async function getMemberById(id: number): Promise<Member> {
    const response = await apiClient(`/members/${id}`);
    return response as Member;
}

export async function updateMember(id: number, data: Partial<Member>): Promise<Member> {
    const response = await apiClient(`/members/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response as Member;
}

export async function deleteMember(id: number): Promise<void> {
    await apiClient(`/members/${id}`, { method: "DELETE" });
}

export async function getAllMembers(page: number = 0, size: number = 10): Promise<MembersPageResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });
    const response = await apiClient(`/members?${params}`);
    return response as MembersPageResponse;
}