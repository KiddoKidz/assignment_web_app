import { QueryKey } from '@tanstack/react-query';

export const authorKeys = {
    all: (filters?: { page: number; limit: number }): QueryKey =>
        ['authors', filters ?? {}] as QueryKey,
    lists: (): QueryKey => ['authors'] as QueryKey,
    details: (id: number): QueryKey => ['authors', id] as QueryKey,
} as const;
export const bookKeys = {
    all: (filters?: { page: number; limit: number }): QueryKey =>
        ['books', filters ?? {}] as QueryKey,
    lists: (): QueryKey => ['books'] as QueryKey,
    details: (id: number): QueryKey => ['books', id] as QueryKey,
} as const;

export const memberKeys = {
    all: (filters?: { page: number; limit: number }): QueryKey =>
        ['members', filters ?? {}] as QueryKey,
    lists: (): QueryKey => ['members'] as QueryKey,
    details: (id: number): QueryKey => ['members', id] as QueryKey,
} as const;

export const borrowedBookKeys = {
    all: (filters?: { page: number; limit: number }): QueryKey =>
        ['borrowedBooks', filters ?? {}] as QueryKey,
    list: (filters: { page: number; limit: number; search?: string; borrowDate?: string }): QueryKey =>
        ['borrowedBooks', 'list', filters] as QueryKey,
    lists: (): QueryKey => ['borrowedBooks'] as QueryKey,
    details: (id: number): QueryKey => ['borrowedBooks', id] as QueryKey,
} as const;