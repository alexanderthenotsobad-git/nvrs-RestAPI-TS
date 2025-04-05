// /var/www/RestAPI/src/models/menuItems.ts
// This is NVRS-TS model definition for the backend
export interface MenuItem {
    item_id: number;
    item_name: string;
    item_desc: string;
    price: number;
    item_type: string;
}

export interface MenuItemImage {
    menu_item_id: number;
    item_image: Buffer;
}

// If you need any model-specific methods, they go here
export const createMenuItem = (data: Omit<MenuItem, 'item_id'>) => {
    // Implementation
};

export const getMenuItemById = (id: number) => {
    // Implementation
};