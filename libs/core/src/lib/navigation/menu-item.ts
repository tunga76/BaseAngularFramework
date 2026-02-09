export interface MenuItem {
    id: string;
    label: string;
    icon?: string;
    route?: string;
    permission?: string;
    children?: MenuItem[];
    order?: number;
    expanded?: boolean;
    hidden?: boolean;
    data?: any;
}
