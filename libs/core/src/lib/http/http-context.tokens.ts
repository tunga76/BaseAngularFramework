import { HttpContextToken } from '@angular/common/http';

export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);
export const SKIP_ERROR_HANDLING = new HttpContextToken<boolean>(() => false);
export const API_BASE_URL = new HttpContextToken<string | null>(() => null);
export const CUSTOM_HEADERS = new HttpContextToken<Record<string, string> | null>(() => null);
export const CUSTOM_BODY_DATA = new HttpContextToken<Record<string, any> | null>(() => null);
export const LOADING_KEY = new HttpContextToken<string | null>(() => null);
export const SKIP_LOGGING = new HttpContextToken<boolean>(() => false);
export const SKIP_UI_FEEDBACK = new HttpContextToken<boolean>(() => false);
