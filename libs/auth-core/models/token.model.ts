export interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    id_token?: string;
    scope?: string;
}

export interface AccessTokenPayload {
    iss?: string;
    sub?: string;
    aud?: string | string[];
    exp: number;
    nbf?: number;
    iat?: number;
    [key: string]: any;
}
