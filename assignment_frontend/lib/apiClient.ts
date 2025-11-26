export async function apiClient(url: string, options?: RequestInit) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options?.headers || {}),
        },
    });

    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    return res.json();
}