import { Injectable, inject, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Service for sanitizing HTML content to prevent XSS attacks.
 * 
 * @example
 * ```typescript
 * const safe = sanitizer.sanitize('<script>alert("xss")</script>');
 * // Returns: '' (script tags removed)
 * ```
 */
@Injectable({
    providedIn: 'root'
})
export class UiSanitizerService {
    private sanitizer = inject(DomSanitizer);

    /**
     * Sanitizes HTML content, removing potentially dangerous elements and attributes.
     * 
     * @param html - Raw HTML string to sanitize
     * @param allowHtml - If false, treats as plain text. Default: true
     * @returns Sanitized HTML string safe for rendering
     */
    sanitize(html: string, allowHtml: boolean = true): string {
        if (!html) {
            return '';
        }

        if (!allowHtml) {
            // Treat as plain text, escape HTML entities
            return this.escapeHtml(html);
        }

        // Use Angular's DomSanitizer to remove dangerous content
        const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, html);
        return sanitized || '';
    }

    /**
     * Creates a SafeHtml object for use with [innerHTML] binding.
     * 
     * @param html - Raw HTML string
     * @returns SafeHtml object safe for Angular rendering
     */
    sanitizeToSafeHtml(html: string): SafeHtml {
        if (!html) {
            return '';
        }

        // First sanitize to remove dangerous content
        const sanitized = this.sanitize(html);
        // Then mark as safe for Angular
        return this.sanitizer.sanitize(SecurityContext.HTML, sanitized) || '';
    }

    /**
     * Escapes HTML entities to prevent HTML injection.
     * Used when allowHtml is false.
     * 
     * @param text - Plain text to escape
     * @returns Escaped text safe for display
     */
    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Validates if the content contains potentially dangerous patterns.
     * 
     * @param content - Content to validate
     * @returns true if content appears safe, false if suspicious
     */
    validateContent(content: string): boolean {
        if (!content) {
            return true;
        }

        // Check for common XSS patterns
        const dangerousPatterns = [
            /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi, // event handlers like onclick=
            /<iframe/gi,
            /<object/gi,
            /<embed/gi,
        ];

        return !dangerousPatterns.some(pattern => pattern.test(content));
    }
}
