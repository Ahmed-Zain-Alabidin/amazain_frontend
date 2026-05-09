import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// User-scoped storage adapter for wishlist
const createUserScopedStorage = () => ({
    getItem: (name) => {
        const { useAuthStore } = require('./authStore');
        const userId = useAuthStore.getState().user?._id;
        const key = userId ? `${name}-${userId}` : `${name}-guest`;
        const str = localStorage.getItem(key);
        return str ? JSON.parse(str) : null;
    },
    setItem: (name, value) => {
        const { useAuthStore } = require('./authStore');
        const userId = useAuthStore.getState().user?._id;
        const key = userId ? `${name}-${userId}` : `${name}-guest`;
        localStorage.setItem(key, JSON.stringify(value));
    },
    removeItem: (name) => {
        const { useAuthStore } = require('./authStore');
        const userId = useAuthStore.getState().user?._id;
        const key = userId ? `${name}-${userId}` : `${name}-guest`;
        localStorage.removeItem(key);
    },
});

export const useWishlistStore = create(
    persist(
        (set, get) => ({
            items: [],

            // Add item to wishlist
            addToWishlist: (product) => {
                const items = get().items;
                const exists = items.find(item => item._id === product._id);
                
                if (!exists) {
                    set({ items: [...items, product] });
                    return true;
                }
                return false;
            },

            // Remove item from wishlist
            removeFromWishlist: (productId) => {
                set({ items: get().items.filter(item => item._id !== productId) });
            },

            // Check if item is in wishlist
            isInWishlist: (productId) => {
                return get().items.some(item => item._id === productId);
            },

            // Toggle item in wishlist
            toggleWishlist: (product) => {
                const isInList = get().isInWishlist(product._id);
                if (isInList) {
                    get().removeFromWishlist(product._id);
                    return false;
                } else {
                    get().addToWishlist(product);
                    return true;
                }
            },

            // Clear wishlist
            clearWishlist: () => {
                set({ items: [] });
            },

            // Get wishlist count
            getCount: () => {
                return get().items.length;
            },
        }),
        {
            name: 'amazain-wishlist',
            storage: createJSONStorage(() => createUserScopedStorage()),
        }
    )
);
