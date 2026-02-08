import { HttpContextToken } from '@angular/common/http';
import { RequestOptions } from '../models/request-options';

export const REQUEST_OPTIONS = new HttpContextToken<RequestOptions>(() => ({}));
