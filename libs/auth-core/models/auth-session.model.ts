import { UserClaims } from './user-claims.model';

export interface AuthSession {
    isAuthenticated: boolean;
    user: UserClaims | null;
    loading: boolean;
    error: string | null;
}
