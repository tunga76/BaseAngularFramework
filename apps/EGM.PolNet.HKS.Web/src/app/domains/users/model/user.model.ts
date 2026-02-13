export interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
    status: 'active' | 'inactive';
}

export interface UserStats {
    total: number;
    active: number;
}
