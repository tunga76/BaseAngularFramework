import { Injectable, inject } from '@angular/core';
import { ApiClient } from '@platform/core';
import { Observable } from 'rxjs';

export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

@Injectable({
    providedIn: 'root'
})
export class TestApiService {
    private api = inject(ApiClient);

    // We use the full URL to bypass the configured base URL for this specific test
    // or we could configure a secondary client, but for simplicity we'll just use full URLs
    // The ApiClient should handle full URLs correctly if they start with http/https
    private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

    getPosts(): Observable<Post[]> {
        return this.api.get<Post[]>(`${this.baseUrl}/posts`);
    }

    getPost(id: number): Observable<Post> {
        return this.api.get<Post>(`${this.baseUrl}/posts/${id}`);
    }

    createPost(post: Omit<Post, 'id'>): Observable<Post> {
        return this.api.post<Post>(`${this.baseUrl}/posts`, post);
    }

    updatePost(id: number, post: Post): Observable<Post> {
        return this.api.put<Post>(`${this.baseUrl}/posts/${id}`, post);
    }

    patchPost(id: number, changes: Partial<Post>): Observable<Post> {
        return this.api.patch<Post>(`${this.baseUrl}/posts/${id}`, changes);
    }

    deletePost(id: number): Observable<void> {
        return this.api.delete<void>(`${this.baseUrl}/posts/${id}`);
    }

    // Simulations

    simulateError(status: number): Observable<any> {
        // jsonplaceholder doesn't have a status endpoint, so we'll just hit valid/invalid endpoints
        if (status === 404) {
            return this.api.get(`${this.baseUrl}/posts/999999`); // Not found
        }
        // For other errors we might need a different approach or a mock backend, 
        // but httpstat.us is good for status codes
        return this.api.get(`https://httpstat.us/${status}`);
    }
}
