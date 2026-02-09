import { Injectable } from '@angular/core';
import { BaseHttpService, RequestOptions } from '@platform/framework';
import { Observable } from 'rxjs';

export interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

@Injectable({ providedIn: 'root' })
export class TestApiService extends BaseHttpService {

    // Standard GET List
    getPosts(): Observable<Post[]> {
        return this.get<Post[]>('posts');
    }

    // GET with ID
    getPost(id: number): Observable<Post> {
        return this.get<Post>(`posts/${id}`);
    }

    // POST
    createPost(post: Omit<Post, 'id'>): Observable<Post> {
        return this.post<Post>('posts', post);
    }

    // PUT
    updatePost(id: number, post: Partial<Post>): Observable<Post> {
        return this.put<Post>(`posts/${id}`, post);
    }

    // DELETE
    deletePost(id: number): Observable<void> {
        return this.delete<void>(`posts/${id}`);
    }

    // Error Testing (Simulate 404)
    getNonExistent(): Observable<any> {
        return this.get('non-existent-endpoint');
    }

    // Circuit Breaker Test
    getWithCircuitBreaker(): Observable<any> {
        return this.get('failing-endpoint-to-trip-breaker', {
            resilience: {
                circuitBreaker: true,
                retry: 0 // Don't retry so we trip fixed threshold faster
            }
        });
    }

    // Loading State Test (using delay from a real API or mock)
    // Since we use jsonplaceholder (likely), we might not have a delay endpoint, 
    // but the network latency should show it.
    // Alternatively, we can use httpstat for explicit errors if the base URL allows it, 
    // but here we are bound to the configured API Url.

    // Test with special options
    getPostsWithHeaders(): Observable<Post[]> {
        return this.get<Post[]>('posts', {
            headers: { 'X-Custom-Header': 'TestValue' }
        });
    }

    // Test with suppression of global loading
    getPostsBackground(): Observable<Post[]> {
        return this.get<Post[]>('posts', {
            context: undefined // In a real scenario we'd pass a context token to skip loading if implemented
            // For now, let's just make a standard call
        });
    }
}
