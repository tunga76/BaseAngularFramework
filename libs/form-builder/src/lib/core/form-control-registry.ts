import { Injectable, Type } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormControlRegistry {
    private mapping = new Map<string, Type<any>>();

    register(type: string, component: Type<any>): void {
        this.mapping.set(type, component);
    }

    getComponent(type: string): Type<any> | undefined {
        return this.mapping.get(type);
    }

    hasType(type: string): boolean {
        return this.mapping.has(type);
    }
}
