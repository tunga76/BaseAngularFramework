import { Signal } from '@angular/core';

export interface MenuItem {
    id: string;
    label: string;
    icon?: string;
    route?: string;
    /** Permission key required to access this item */
    permission?: string;
    /** Roles required to access this item (OR logic usually, or depends on strategy) */
    roles?: string[];
    /** Badge value to display (e.g. '5', 'New') */
    badge?: string | number | Signal<string | number | undefined>;
    children?: MenuItem[];
    order?: number;
    /** Initial expanded state for submenus */
    expanded?: boolean;
    hidden?: boolean;
    data?: any;
    /** Link target (e.g. '_blank') */
    target?: string;

    // Runtime properties (managed by service/components)
    active?: boolean;
    level?: number;
}
