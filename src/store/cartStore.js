import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { useAuthStore } from './authStore';

// Build a per-user localStorage key so carts never bleed between accounts
const getStorageKey = () => {
    try {
        const auth = JSON.parse(localStorage.getItem('auth-storage') || '{}');
        const userId = auth?.state?.user?._id;
        return userId ? `amazain-cart-${userId}` : 'amazain-cart-guest';
    } catch {
        return 'amazain-cart-guest';
    }
};

// Custom storage adapter that resolves the key at runtime
const userScopedStorage = {
    getItem: (name) => {
        const key = getStorageKey();
        return localStorage.getItem(key);
    },
    setItem: (name, value) => {
        const key = getStorageKey();
        localStorage.setItem(key, value);
    },
    removeItem: (name) => {
        const key = getStorageKey();
        localStorage.removeItem(key);
    },
};

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,
            error: null,

            // Call on login to load the server cart and discard any stale local state
            fetchCart: async () => {
                const token = useAuthStore.getState().token;
                if (!token) return;
                try {
                    const res = await axios.get('http://localhost:4500/api/cart', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    // Server returns { data: { items: [...] } }
                    set({ items: res.data.data?.items || [] });
                } catch (error) {
                    console.error('Failed to fetch cart', error);
                }
            },

            // Clear local cart state on logout (does NOT call the API — just wipes local)
            clearLocalCart: () => {
                set({ items: [], error: null });
            },

            addToCart: async (product, quantity) => {
                const token = useAuthStore.getState().token;

                // Guest: store locally
                if (!token) {
                    set((state) => {
                        const productId = typeof product === 'object' ? product._id : product;
                        const existing = state.items.find(
                            (i) => (i.product?._id || i.product) === productId
                        );
                        if (existing) {
                            return {
                                items: state.items.map((i) =>
                                    (i.product?._id || i.product) === productId
                                        ? { ...i, quantity: i.quantity + quantity }
                                        : i
                                ),
                            };
                        }
                        return { items: [...state.items, { product, quantity }] };
                    });
                    return;
                }

                set({ isLoading: true, error: null });
                try {
                    const productId = typeof product === 'object' ? product._id : product;
                    const res = await axios.post(
                        'http://localhost:4500/api/cart',
                        { productId, quantity },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    // Server returns { status: 'Success', data: { user, items: [...], totalPrice } }
                    const cartData = res.data.data;
                    set({ items: cartData?.items || [], isLoading: false });
                } catch (error) {
                    console.error('Add to cart error:', error);
                    set({
                        error: error.response?.data?.message || 'Failed to add to cart',
                        isLoading: false,
                    });
                }
            },

            removeFromCart: async (productId) => {
                const token = useAuthStore.getState().token;

                if (!token) {
                    set((state) => ({
                        items: state.items.filter(
                            (i) => (i.product?._id || i.product) !== productId
                        ),
                    }));
                    return;
                }

                set({ isLoading: true });
                try {
                    const res = await axios.delete(
                        `http://localhost:4500/api/cart/${productId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const cartData = res.data.data;
                    set({ items: cartData?.items || [], isLoading: false });
                } catch (error) {
                    console.error('Remove from cart error:', error);
                    set({ error: 'Failed to remove item', isLoading: false });
                }
            },

            updateQuantity: async (productId, quantity) => {
                const token = useAuthStore.getState().token;
                if (quantity < 1) return;

                if (!token) {
                    set((state) => ({
                        items: state.items.map((i) =>
                            (i.product?._id || i.product) === productId
                                ? { ...i, quantity }
                                : i
                        ),
                    }));
                    return;
                }

                set({ isLoading: true });
                try {
                    const res = await axios.put(
                        `http://localhost:4500/api/cart/${productId}`,
                        { quantity },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const cartData = res.data.data;
                    set({ items: cartData?.items || [], isLoading: false });
                } catch (error) {
                    console.error('Update quantity error:', error);
                    set({ error: 'Failed to update quantity', isLoading: false });
                }
            },

            clearCart: async () => {
                const token = useAuthStore.getState().token;

                if (!token) {
                    set({ items: [], error: null });
                    return;
                }

                set({ isLoading: true });
                try {
                    await axios.delete('http://localhost:4500/api/cart', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    set({ items: [], isLoading: false, error: null });
                } catch (error) {
                    set({ error: 'Failed to clear cart', isLoading: false });
                }
            },
        }),
        {
            name: 'amazain-cart',
            storage: createJSONStorage(() => userScopedStorage),
        }
    )
);
