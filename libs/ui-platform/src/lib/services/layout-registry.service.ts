import { Injectable, Type, signal, computed } from '@angular/core';

export interface LayoutEntry {
    name: string;
    component: Type<any>;
}

@Injectable({
    providedIn: 'root'
})
export class LayoutRegistryService {
    private layouts = signal<Map<string, Type<any>>>(new Map());
    private activeLayoutName = signal<string>('dashboard');

    public readonly activeLayout = computed(() => {
        const name = this.activeLayoutName();
        return this.layouts().get(name);
    });

    registerLayout(name: string, component: Type<any>) {
        this.layouts.update(map => {
            const newMap = new Map(map);
            newMap.set(name, component);
            return newMap;
        });
    }

    setActiveLayout(name: string) {
        if (this.layouts().has(name)) {
            this.activeLayoutName.set(name);
        } else {
            console.warn(`Layout "${name}" is not registered.`);
        }
    }

    getActiveLayout() {
        return this.activeLayoutName();
    }
}
