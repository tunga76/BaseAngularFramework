import { HttpContextToken } from '@angular/common/http';

export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);
export const SKIP_ERROR_HANDLING = new HttpContextToken<boolean>(() => false);
export const API_BASE_URL = new HttpContextToken<string | null>(() => null);
