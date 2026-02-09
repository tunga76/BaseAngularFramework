import { DestroyRef, inject } from '@angular/core';

/**
 * Utility to get a DestroyRef for cleanups in signals or effects.
 */
export function injectDestroy() {
    return inject(DestroyRef);
}
