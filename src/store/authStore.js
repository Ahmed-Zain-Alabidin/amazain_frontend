import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            _hasHydrated: false,

            setHasHydrated: (state) => set({ _hasHydrated: state }),

            login: (userData, token) => {
                set({ user: userData, token, isAuthenticated: true });
                // Fetch the user's server cart after login (lazy import to avoid circular deps)
                import('./cartStore').then(({ useCartStore }) => {
                    useCartStore.getState().fetchCart();
                });
            },

            logout: () => {
                // Wipe local cart before clearing auth so the storage key still resolves correctly
                import('./cartStore').then(({ useCartStore }) => {
                    useCartStore.getState().clearLocalCart();
                });
                // Clear wishlist on logout
                import('./wishlistStore').then(({ useWishlistStore }) => {
                    useWishlistStore.getState().clearWishlist();
                });
                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
                // Re-sync cart from server when the page reloads and user is already logged in
                if (state?.token) {
                    import('./cartStore').then(({ useCartStore }) => {
                        useCartStore.getState().fetchCart();
                    });
                }
            },
        }
    )
);
