'use client';

import axios from 'axios';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

// Sets up a global Axios response interceptor that automatically
// logs the user out and redirects to /login on any 401 response.
export default function AxiosInterceptor({ children }) {
    const logout = useAuthStore(state => state.logout);
    const router = useRouter();

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    logout();
                    router.push('/login');
                }
                return Promise.reject(error);
            }
        );

        // Eject interceptor on cleanup to avoid duplicates
        return () => axios.interceptors.response.eject(interceptor);
    }, [logout, router]);

    return children;
}
