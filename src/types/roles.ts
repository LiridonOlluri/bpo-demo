export type AccessLevel = 1 | 2 | 3 | 4 | 5

export interface Role {
    id: string
    name: string
    level: AccessLevel
    modules: string[]
    permissions: Record<string, ('view' | 'edit' | 'approve' | 'admin')[]>
}

export interface User {
    id: string
    name: string
    email: string
    role: Role
    teamId?: string
    managerId?: string
}
