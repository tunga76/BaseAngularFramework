import { InjectionToken } from '@angular/core';

export interface AuthConfig {
  authority: string;
  clientId: string;
  redirectUri: string;
  postLogoutRedirectUri?: string;
  scopes: string[];
  responseType?: string; // default: 'code'
  autoUserInfo?: boolean; // default: true
}

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG');
