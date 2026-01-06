import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: number;
    brand: string;
    model: string;
    price: number;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
    (set) => ({
        items: [],
        addItem: (newItem) => set((state) => {
        const existing = state.items.find(i => i.id === newItem.id);
        if (existing) {
            return {
            items: state.items.map(i => 
                i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
            )
            };
        }
        return { items: [...state.items, { ...newItem, quantity: 1 }] };
        }),
        removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
        })),
        clearCart: () => set({ items: [] }),
    }),
    { name: 'laptop-shop-cart' } // This saves the cart in the browsers LocalStorage
    )
);